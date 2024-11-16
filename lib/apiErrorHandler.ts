import {NextResponse} from "next/server";

interface ErrorResponse {
  error: string;
  details?: string;
}

interface ErrorObject {
  customErrorMessage?: string;
  statusCode?: number;
  error?: Error;
}

export const handleError = ({
  customErrorMessage = "Internal Server Error",
  statusCode = 500,
  error,
}: ErrorObject): NextResponse<ErrorResponse> => {
  const errorResponse: ErrorResponse = {
    error: customErrorMessage,
    details: error?.message,
  };

  if (error && process.env.NODE_ENV !== "production") {
    errorResponse.details = `${error.message}\n${error.stack}`;
  }

  const headers = {
    "Content-Type": "application/json",
  };

  console.error(`[ERROR] ${statusCode}: ${customErrorMessage}`, error);

  return NextResponse.json(errorResponse, {
    status: statusCode,
    headers: headers,
  });
};
