import { randomUUID } from "node:crypto";

export type AiFeature =
  | "agent.board-assistant"
  | "agent.moderation"
  | "agent.review-assistant"
  | "mcp.briefing"
  | "mcp.kbo-game-record"
  | "mcp.kbo-games"
  | "prediction.game"
  | "rag.draft-similar-posts"
  | "rag.related-post-summary"
  | "rag.similar-posts";

export type AiTelemetryOutcome =
  | "success"
  | "client_error"
  | "server_error"
  | "exception";

export type AiTelemetryEvent = {
  schemaVersion: 1;
  event: "ai.operation.completed";
  timestamp: string;
  traceId: string;
  feature: AiFeature;
  method: string;
  outcome: AiTelemetryOutcome;
  httpStatus: number;
  durationMs: number;
  errorType?: string;
};

export type AiTelemetryOptions = {
  now?: () => number;
  timestamp?: () => string;
  traceIdFactory?: () => string;
  sink?: (event: AiTelemetryEvent) => void;
};

function getOutcome(status: number): AiTelemetryOutcome {
  if (status >= 500) {
    return "server_error";
  }

  if (status >= 400) {
    return "client_error";
  }

  return "success";
}

function getDuration(startedAt: number, completedAt: number): number {
  return Math.max(0, Math.round(completedAt - startedAt));
}

function defaultSink(event: AiTelemetryEvent): void {
  const serialized = JSON.stringify(event);

  if (event.outcome === "server_error" || event.outcome === "exception") {
    console.error(serialized);
    return;
  }

  console.info(serialized);
}

function emit(
  sink: (event: AiTelemetryEvent) => void,
  event: AiTelemetryEvent,
): void {
  try {
    sink(event);
  } catch (error) {
    console.error(
      "Failed to emit AI telemetry.",
      error instanceof Error ? error.name : "UnknownError",
    );
  }
}

function attachTelemetryHeaders(
  response: Response,
  traceId: string,
  durationMs: number,
): void {
  const metric = `ai;dur=${durationMs}`;
  const currentServerTiming = response.headers.get("server-timing");

  response.headers.set("x-ai-trace-id", traceId);
  response.headers.set("x-ai-duration-ms", String(durationMs));
  response.headers.set(
    "server-timing",
    currentServerTiming ? `${currentServerTiming}, ${metric}` : metric,
  );
}

export async function withAiTelemetry(
  request: Pick<Request, "method">,
  feature: AiFeature,
  handler: () => Promise<Response>,
  options: AiTelemetryOptions = {},
): Promise<Response> {
  const now = options.now ?? Date.now;
  const getTimestamp = options.timestamp ?? (() => new Date().toISOString());
  const sink = options.sink ?? defaultSink;
  const traceId = (options.traceIdFactory ?? randomUUID)();
  const startedAt = now();

  try {
    const response = await handler();
    const durationMs = getDuration(startedAt, now());

    attachTelemetryHeaders(response, traceId, durationMs);
    emit(sink, {
      schemaVersion: 1,
      event: "ai.operation.completed",
      timestamp: getTimestamp(),
      traceId,
      feature,
      method: request.method.toUpperCase(),
      outcome: getOutcome(response.status),
      httpStatus: response.status,
      durationMs,
    });

    return response;
  } catch (error) {
    emit(sink, {
      schemaVersion: 1,
      event: "ai.operation.completed",
      timestamp: getTimestamp(),
      traceId,
      feature,
      method: request.method.toUpperCase(),
      outcome: "exception",
      httpStatus: 500,
      durationMs: getDuration(startedAt, now()),
      errorType: error instanceof Error ? error.name : "UnknownError",
    });

    throw error;
  }
}
