import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function parseJson<T>(request: Request, schema: ZodSchema<T>): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues.map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`).join("; ");
      throw new ApiError(400, message);
    }
    throw new ApiError(400, "Invalid JSON request body");
  }
}

export function ok<T>(payload: T, init?: ResponseInit) {
  return NextResponse.json(payload, init);
}

export function fail(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  const message = error instanceof Error ? error.message : "Unexpected server error";
  return NextResponse.json({ error: message }, { status: 500 });
}
