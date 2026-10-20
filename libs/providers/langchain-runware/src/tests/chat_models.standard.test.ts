import { AIMessageChunk } from "@langchain/core/messages";
import { ChatModelUnitTests } from "@langchain/standard-tests/vitest";
import { ChatRunware, type ChatOpenAICallOptions } from "../chat_models.js";

class ChatRunwareStandardUnitTests extends ChatModelUnitTests<
  ChatOpenAICallOptions,
  AIMessageChunk
> {
  constructor() {
    super({
      Cls: ChatRunware,
      chatModelHasToolCalling: true,
      chatModelHasStructuredOutput: true,
      constructorArgs: {},
    });
    process.env.RUNWARE_API_KEY = "test";
  }

  testChatModelInitApiKey() {
    process.env.RUNWARE_API_KEY = "";
    super.testChatModelInitApiKey();
    process.env.RUNWARE_API_KEY = "test";
  }
}

const testClass = new ChatRunwareStandardUnitTests();
testClass.runTests("ChatRunwareStandardUnitTests");
