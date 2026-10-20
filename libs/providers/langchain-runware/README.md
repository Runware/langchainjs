# @langchain/runware

This package contains the LangChain.js integration for [Runware](https://runware.ai/).

## Installation

```bash npm2yarn
npm install @langchain/runware @langchain/core
```

## Authentication

Set the `RUNWARE_API_KEY` environment variable or pass `apiKey` to the constructor.

```bash
export RUNWARE_API_KEY="your-api-key"
```

The base URL defaults to `https://api.runware.ai/v1` and can be overridden with
the `baseURL` constructor arg or the `RUNWARE_BASE_URL` environment variable.

## Chat models

`ChatRunware` uses Runware's OpenAI-compatible chat completions API. Model ids
must be taken from Runware's `GET /v1/models` endpoint (e.g.
`google-gemini-3-flash`).

```typescript
import { ChatRunware } from "@langchain/runware";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatRunware({
  model: "google-gemini-3-flash",
  temperature: 0,
});

const response = await model.invoke([new HumanMessage("Hello there!")]);
console.log(response.content);
```
