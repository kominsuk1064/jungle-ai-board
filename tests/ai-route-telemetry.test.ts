import { afterEach, describe, expect, it, vi } from "vitest";

import { POST as moderate } from "../src/app/api/ai/agent/moderation/route";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AI route telemetry integration", () => {
  it("adds trace headers and logs a sanitized event", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const request = new Request("http://localhost/api/ai/agent/moderation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await moderate(request);
    const serializedEvent = log.mock.calls.at(-1)?.[0];
    const event = JSON.parse(String(serializedEvent)) as Record<string, unknown>;

    expect(response.status).toBe(400);
    expect(response.headers.get("x-ai-trace-id")).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(response.headers.get("server-timing")).toMatch(/^ai;dur=\d+$/);
    expect(event).toMatchObject({
      schemaVersion: 1,
      event: "ai.operation.completed",
      feature: "agent.moderation",
      method: "POST",
      outcome: "client_error",
      httpStatus: 400,
    });
    expect(event).not.toHaveProperty("url");
    expect(event).not.toHaveProperty("body");
  });
});
