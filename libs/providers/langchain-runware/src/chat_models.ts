import type { LangSmithParams } from "@langchain/core/language_models/chat_models";
import { getEnvironmentVariable } from "@langchain/core/utils/env";
import {
  type ChatOpenAICallOptions,
  ChatOpenAICompletions,
  type ChatOpenAIFields,
} from "@langchain/openai";
import type { ModelProfile } from "@langchain/core/language_models/profile";
import PROFILES from "./profiles.js";

/**
 * Input for the Runware chat model.
 */
export interface ChatRunwareInput extends ChatOpenAIFields {
  /**
   * The Runware API key. @default process.env.RUNWARE_API_KEY
   */
  apiKey?: string;
  /**
   * Model id from Runware's `GET /v1/models` endpoint.
   */
  model?: string;
  /**
   * Base URL of the Runware OpenAI-compatible API.
   * @default "https://api.runware.ai/v1"
   */
  baseURL?: string;
}

/**
 * Runware chat model integration.
 *
 * Runware exposes an OpenAI-compatible chat completions API.
 * See https://runware.ai/docs/tools/compatible-apis
 *
 * Setup:
 * Install `@langchain/runware` and set `RUNWARE_API_KEY`.
 */
export class ChatRunware extends ChatOpenAICompletions<ChatOpenAICallOptions> {
  static lc_name() {
    return "ChatRunware";
  }

  lc_serializable = true;

  lc_namespace = ["langchain", "chat_models", "runware"];

  _llmType() {
    return "runware";
  }

  get lc_secrets(): { [key: string]: string } | undefined {
    return {
      apiKey: "RUNWARE_API_KEY",
    };
  }

  constructor(fields?: Partial<ChatRunwareInput>) {
    const apiKey = fields?.apiKey || getEnvironmentVariable("RUNWARE_API_KEY");

    if (!apiKey) {
      throw new Error(
        `Runware API key not found. Please set the RUNWARE_API_KEY environment variable or pass the key into the "apiKey" field.`
      );
    }

    super({
      ...fields,
      model: fields?.model || "google-gemini-3-flash",
      apiKey,
      configuration: {
        baseURL:
          fields?.baseURL ||
          getEnvironmentVariable("RUNWARE_BASE_URL") ||
          "https://api.runware.ai/v1",
        ...fields?.configuration,
      },
    });
    this._addVersion("@langchain/runware", __PKG_VERSION__);
  }

  getLsParams(options: this["ParsedCallOptions"]): LangSmithParams {
    const params = super.getLsParams(options);
    params.ls_provider = "runware";
    return params;
  }

  toJSON() {
    const result = super.toJSON();

    if (
      "kwargs" in result &&
      typeof result.kwargs === "object" &&
      result.kwargs != null
    ) {
      delete result.kwargs.openai_api_key;
      delete result.kwargs.configuration;
    }

    return result;
  }

  /**
   * Profiling information for the model.
   */
  get profile(): ModelProfile {
    return PROFILES[this.model] ?? {};
  }

  protected override get streamEventProvider(): string {
    return "runware";
  }
}
