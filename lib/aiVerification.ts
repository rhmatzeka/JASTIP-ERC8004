import OpenAI from "openai";
import type { Order, VerificationReportJson, VerificationStatus } from "./types";
import { makeReportJson } from "./mockDb";

const VERIFICATION_PROMPT = `You are an impartial AI verification agent for a trustless jastip escrow platform.

Your task is to verify whether the jastiper purchased the correct product for the buyer.

Analyze:
1. Receipt photo
2. Purchased item photo
3. Buyer reference photo
4. Order metadata

Check:
- Store name
- Receipt date
- Item name
- Price
- Quantity
- Brand match
- Model match
- Color match
- Visible details
- Whether item photo and receipt appear to be in the same real-world context
- Fraud risk indicators

Return only valid JSON with this exact schema:

{
  "store": {
    "verified": boolean,
    "name": string
  },
  "item": {
    "match_confidence": number,
    "notes": string
  },
  "price": {
    "amount_idr": number,
    "within_budget": boolean
  },
  "date": {
    "valid": boolean
  },
  "fraud_risk": {
    "score": number,
    "flags": string[]
  },
  "overall_status": "APPROVED" | "FLAGGED" | "REJECTED"
}

Decision rules:
- APPROVED if item confidence >= 85, price within budget, fraud risk < 30
- FLAGGED if item confidence is 60-84 or fraud risk 30-69
- REJECTED if item confidence < 60 or fraud risk >= 70`;

const reportSchema = {
  type: "object",
  additionalProperties: false,
  required: ["store", "item", "price", "date", "fraud_risk", "overall_status"],
  properties: {
    store: {
      type: "object",
      additionalProperties: false,
      required: ["verified", "name"],
      properties: {
        verified: { type: "boolean" },
        name: { type: "string" }
      }
    },
    item: {
      type: "object",
      additionalProperties: false,
      required: ["match_confidence", "notes"],
      properties: {
        match_confidence: { type: "number" },
        notes: { type: "string" }
      }
    },
    price: {
      type: "object",
      additionalProperties: false,
      required: ["amount_idr", "within_budget"],
      properties: {
        amount_idr: { type: "number" },
        within_budget: { type: "boolean" }
      }
    },
    date: {
      type: "object",
      additionalProperties: false,
      required: ["valid"],
      properties: {
        valid: { type: "boolean" }
      }
    },
    fraud_risk: {
      type: "object",
      additionalProperties: false,
      required: ["score", "flags"],
      properties: {
        score: { type: "number" },
        flags: {
          type: "array",
          items: { type: "string" }
        }
      }
    },
    overall_status: {
      type: "string",
      enum: ["APPROVED", "FLAGGED", "REJECTED"]
    }
  }
};

export function normalizeReport(report: VerificationReportJson, order: Order): VerificationReportJson {
  let status: VerificationStatus = report.overall_status;
  const confidence = clampScore(report.item.match_confidence);
  const fraudScore = clampScore(report.fraud_risk.score);
  const flags = [...(report.fraud_risk?.flags || [])];
  const storeName = report.store.name?.trim() || "";
  const priceAmountIdr = Math.max(0, Math.round(report.price.amount_idr || 0));
  const withinBudget = priceAmountIdr <= order.maxBudgetIdr;

  if (!storeName) flags.push("Receipt store name is empty");
  if (!report.date.valid) flags.push("Receipt date is invalid or not visible");
  if (!withinBudget) flags.push("Receipt total is above buyer max budget");
  if (priceAmountIdr > order.maxBudgetIdr * 1.1) flags.push("Price is above budget by more than 10%");
  if (confidence < 60 || fraudScore >= 70) status = "REJECTED";
  else if (confidence < 85 || fraudScore >= 30 || !withinBudget) status = "FLAGGED";
  else status = "APPROVED";

  return {
    ...report,
    store: {
      verified: Boolean(report.store.verified && storeName),
      name: storeName
    },
    item: {
      match_confidence: confidence,
      notes: report.item.notes?.trim() || "No item analysis notes returned."
    },
    price: {
      amount_idr: priceAmountIdr,
      within_budget: withinBudget
    },
    date: {
      valid: Boolean(report.date.valid)
    },
    fraud_risk: {
      ...report.fraud_risk,
      score: fraudScore,
      flags: Array.from(new Set(flags))
    },
    overall_status: status
  };
}

function clampScore(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export async function verifyJastipOrder({
  order,
  receiptPhotoUrl,
  itemPhotoUrl,
  additionalItemPhotoUrl
}: {
  order: Order;
  receiptPhotoUrl?: string;
  itemPhotoUrl?: string;
  additionalItemPhotoUrl?: string;
}): Promise<VerificationReportJson> {
  const hardRejectFlags: string[] = [];
  if (!receiptPhotoUrl) hardRejectFlags.push("Missing receipt photo");
  if (!itemPhotoUrl) hardRejectFlags.push("Missing item photo");
  if (hardRejectFlags.length > 0) {
    return {
      ...makeReportJson("REJECTED", order),
      fraud_risk: {
        score: 92,
        flags: hardRejectFlags
      },
      overall_status: "REJECTED"
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_MOCK_AI !== "true") {
      throw new Error("OpenAI verification is not configured");
    }
    return normalizeReport(makeReportJson("APPROVED", order), order);
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const orderMetadata = {
      itemName: order.itemName,
      brand: order.brand,
      model: order.model,
      color: order.color,
      size: order.size,
      destinationCountry: order.destinationCountry,
      targetStore: order.targetStore,
      maxBudgetIdr: order.maxBudgetIdr,
      estimatedIdrPrice: order.estimatedIdrPrice
    };

    // Responses API supports multimodal image inputs and structured JSON output.
    const response = await client.responses.create({
      model: process.env.OPENAI_VERIFICATION_MODEL || "gpt-4o",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: `${VERIFICATION_PROMPT}\n\nOrder metadata JSON:\n${JSON.stringify(orderMetadata)}` },
            { type: "input_image", image_url: receiptPhotoUrl },
            { type: "input_image", image_url: itemPhotoUrl },
            ...(order.referencePhotoUrl ? [{ type: "input_image" as const, image_url: order.referencePhotoUrl }] : []),
            ...(additionalItemPhotoUrl ? [{ type: "input_image" as const, image_url: additionalItemPhotoUrl }] : [])
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "jastip_verification_report",
          strict: true,
          schema: reportSchema
        }
      }
    } as never);

    const text = (response as { output_text?: string }).output_text || "{}";
    return normalizeReport(JSON.parse(text) as VerificationReportJson, order);
  } catch (error) {
    const fallback = makeReportJson("FLAGGED", order);
    fallback.fraud_risk.flags = [
      ...fallback.fraud_risk.flags,
      "OpenAI verification failed, rule-based fallback report used"
    ];
    return normalizeReport(fallback, order);
  }
}
