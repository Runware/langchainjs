import { describe, expect, test } from "vitest";
import { ChatRunware } from "../chat_models.js";

describe("ChatRunware", () => {
  test("defaults the model and uses apiKey", () => {
    const model = new ChatRunware({ apiKey: "test-api-key" });

    expect(model.model).toBe("google-gemini-3-flash");
    expect(model.getLsParams({})).toMatchObject({ ls_provider: "runware" });
  });

  test("throws when no api key is configured", () => {
    const current = process.env.RUNWARE_API_KEY;
    delete process.env.RUNWARE_API_KEY;

    try {
      expect(() => new ChatRunware()).toThrow(/Runware API key not found/);
    } finally {
      if (current === undefined) {
        delete process.env.RUNWARE_API_KEY;
      } else {
        process.env.RUNWARE_API_KEY = current;
      }
    }
  });

  test("uses the default Runware base URL", () => {
    const model = new ChatRunware({ apiKey: "test-api-key" });

    expect(model.clientConfig.baseURL).toBe("https://api.runware.ai/v1");
  });

  test("honors baseURL and RUNWARE_BASE_URL", () => {
    const model = new ChatRunware({
      apiKey: "test-api-key",
      baseURL: "https://proxy.example.com/v1",
    });
    expect(model.clientConfig.baseURL).toBe("https://proxy.example.com/v1");

    const current = process.env.RUNWARE_BASE_URL;
    process.env.RUNWARE_BASE_URL = "https://env.example.com/v1";
    try {
      const envModel = new ChatRunware({ apiKey: "test-api-key" });
      expect(envModel.clientConfig.baseURL).toBe("https://env.example.com/v1");
    } finally {
      if (current === undefined) {
        delete process.env.RUNWARE_BASE_URL;
      } else {
        process.env.RUNWARE_BASE_URL = current;
      }
    }
  });

  test("maps secrets to environment variables", () => {
    const model = new ChatRunware({ apiKey: "test-api-key" });

    expect(model.lc_secrets).toMatchObject({ apiKey: "RUNWARE_API_KEY" });
  });

  test("returns a profile for known models", () => {
    const model = new ChatRunware({
      apiKey: "test-api-key",
      model: "google-gemini-3-flash",
    });

    expect(model.profile.maxInputTokens).toBe(1048576);
  });
});
