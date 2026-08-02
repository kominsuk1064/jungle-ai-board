import { describe, expect, it } from "vitest";

import {
  type AiTelemetryEvent,
  type AiTelemetryOptions,
  withAiTelemetry,
} from "../src/lib/ai/telemetry";

function createOptions(
  events: AiTelemetryEvent[],
  times: number[],
): AiTelemetryOptions {
  let timeIndex = 0;

  return {
    now: () => times[timeIndex++] ?? times.at(-1) ?? 0,
    timestamp: () => "2026-08-02T00:00:00.000Z",
    traceIdFactory: () => "trace-test-123",
    sink: (event) => events.push(event),
  };
}

describe("withAiTelemetry", () => {
  it("records a successful operation and adds correlation headers", async () => {
    const events: AiTelemetryEvent[] = [];
    const response = await withAiTelemetry(
      { method: "post" },
      "agent.moderation",
      async () => Response.json({ status: "ready" }),
      createOptions(events, [100, 142]),
    );

    expect(response.headers.get("x-ai-trace-id")).toBe("trace-test-123");
    expect(response.headers.get("x-ai-duration-ms")).toBe("42");
    expect(response.headers.get("server-timing")).toBe("ai;dur=42");
    expect(events).toEqual([
      {
        schemaVersion: 1,
        event: "ai.operation.completed",
        timestamp: "2026-08-02T00:00:00.000Z",
        traceId: "trace-test-123",
        feature: "agent.moderation",
        method: "POST",
        outcome: "success",
        httpStatus: 200,
        durationMs: 42,
      },
    ]);
  });

  it.each([
    [400, "client_error"],
    [503, "server_error"],
  ] as const)("classifies HTTP %i as %s", async (status, outcome) => {
    const events: AiTelemetryEvent[] = [];
    const response = await withAiTelemetry(
      { method: "GET" },
      "rag.similar-posts",
      async () =>
        new Response(null, {
          status,
          headers: { "server-timing": "db;dur=8" },
        }),
      createOptions(events, [200, 225]),
    );

    expect(response.headers.get("server-timing")).toBe(
      "db;dur=8, ai;dur=25",
    );
    expect(events[0]).toMatchObject({
      outcome,
      httpStatus: status,
      durationMs: 25,
    });
  });

  it("records only the error type before rethrowing an exception", async () => {
    const events: AiTelemetryEvent[] = [];
    const secret = "private prompt text";

    await expect(
      withAiTelemetry(
        { method: "POST" },
        "agent.review-assistant",
        async () => {
          throw new TypeError(secret);
        },
        createOptions(events, [300, 311]),
      ),
    ).rejects.toThrow(secret);

    expect(events).toEqual([
      {
        schemaVersion: 1,
        event: "ai.operation.completed",
        timestamp: "2026-08-02T00:00:00.000Z",
        traceId: "trace-test-123",
        feature: "agent.review-assistant",
        method: "POST",
        outcome: "exception",
        httpStatus: 500,
        durationMs: 11,
        errorType: "TypeError",
      },
    ]);
    expect(JSON.stringify(events)).not.toContain(secret);
  });
});
