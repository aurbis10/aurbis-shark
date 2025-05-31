export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 500,
    public context?: any,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function handleError(error: unknown, context?: string): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message, "UNKNOWN_ERROR", 500, { context, originalError: error.name })
  }

  return new AppError("An unknown error occurred", "UNKNOWN_ERROR", 500, { context })
}

export async function logError(error: AppError | Error, context?: any) {
  const errorData = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  }

  // Log to console (in production, send to monitoring service)
  console.error("Error logged:", errorData)

  // In production, send to error tracking service
  try {
    await fetch("/api/error-handler", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errorData),
    })
  } catch (logError) {
    console.error("Failed to log error to service:", logError)
  }
}
