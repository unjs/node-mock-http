import { IncomingMessage } from "../http/request";
import { ServerResponse } from "../http/response";
import type {
  AbstractRequest,
  AbstractResponse,
  NodeRequestHandler,
} from "./types";
import { toNodeRequestHeaders } from "./utils";

const nullBodyResponses = new Set([101, 204, 205, 304]);

export async function callNodeRequestHandler(
  handler: NodeRequestHandler,
  aRequest: AbstractRequest,
): Promise<AbstractResponse> {
  const req = new IncomingMessage();
  const res = new ServerResponse(req);

  req.url = aRequest.url?.toString() || "/";

  let hostFromURL: string | undefined;
  if (!req.url.startsWith("/")) {
    const url = new URL(req.url);
    hostFromURL = url.host;
    req.url = url.pathname + url.search + url.hash;
  }

  req.method = aRequest.method || "GET";

  req.headers = toNodeRequestHeaders(aRequest.headers || {});

  if (!req.headers.host) {
    req.headers.host = aRequest.host || hostFromURL || "localhost";
  }

  (req.connection as any).encrypted =
    (req.connection as any).encrypted || aRequest.protocol === "https";

  (req as any).body = aRequest.body || null;

  req.__unenv__ = aRequest.context;

  await handler(req, res);

  // https://developer.mozilla.org/en-US/docs/Web/API/Response/body
  // TODO: Ensure _data is either of BodyInit (or narrower) types
  // Blob | ArrayBuffer | TypedArray | DataView | FormData | ReadableStream | URLSearchParams | String
  let responseBody = res._data as BodyInit | null;
  if (
    nullBodyResponses.has(res.statusCode) ||
    req.method.toUpperCase() === "HEAD"
  ) {
    responseBody = null;
    delete res._headers["content-length"];
  }

  const response = {
    status: res.statusCode,
    statusText: res.statusMessage,
    headers: res._headers,
    body: responseBody,
  };

  req.destroy();
  res.destroy();

  return response;
}
