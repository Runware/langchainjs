import { describe, expect, test } from "vitest";
import { HumanMessage } from "@langchain/core/messages";
import { ChatRunware } from "../chat_models.js";

const describeIfRunwareKey = process.env.RUNWARE_API_KEY
  ? describe
  : describe.skip;

describeIfRunwareKey("ChatRunware integration", () => {
  test("invoke", async () => {
    const chat = new ChatRunware({
      model: "google-gemini-3-flash",
      maxRetries: 1,
    });
    const result = await chat.invoke([new HumanMessage("Hello!")]);

    expect(typeof result.content).toBe("string");
    expect(String(result.content).length).toBeGreaterThan(0);
  });
});
