import { describe, test, expect } from "vitest";
import nock from "nock";
import { HttpMessageGateway } from "../http-message.gateway";

describe("HttpMessageGateway", () => {
  test("postMessage", async () => {
    const message = {
      id: "m1",
      author: "alice-id",
      text: "alice message",
      publishedAt: "2023-06-12T20:58:00.000Z",
      timelineId: "alice-timeline-id",
    };
    nock("http://localhost:3000", {
      reqheaders: {
        "Content-Type": "application/json",
      },
    })
      .post("/messages", message)
      .reply(201);
    const messageGateway = new HttpMessageGateway();

    expect(() => messageGateway.postMessage(message)).not.toThrowError();
  });
});
