import type { NodeRequestHandler, AbstractRequest } from "./types";
import { callNodeRequestHandler } from "./call";
import { toWebResponseHeaders } from "./utils";

export async function fetchNodeRequestHandler(
  handler: NodeRequestHandler,
  url: string | URL,
  init: RequestInit & AbstractRequest = {},
): Promise<Response> {
  try {
    const response = await callNodeRequestHandler(handler, { url, ...init });
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: toWebResponseHeaders(response.headers),
    });
  } catch (error: any) {
    return new Response(error.toString(), {
      status: Number.parseInt(error.statusCode || error.code) || 500,
      statusText: error.statusText,
    });
  }
}
