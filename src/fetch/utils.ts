import type { NodeResponseHeaders } from "./types";

export const NodeHeadersObj = /* @__PURE__ */ (() => {
  const C = function () {};
  C.prototype = Object.create(null);
  return C;
})() as unknown as { new (): any };

export function toNodeRequestHeaders(
  headers: HeadersInit | Record<string, string | string[]> = {},
): Record<string, string | string[]> {
  const nodeHeaders: Record<string, string | string[]> = new NodeHeadersObj();
  const headerEntries =
    Array.isArray(headers) || _isinitHeaders(headers)
      ? headers
      : Object.entries(headers);
  for (const [name, value] of headerEntries) {
    if (!value) {
      continue;
    }
    if (nodeHeaders[name] === undefined) {
      nodeHeaders[name] = value;
      continue;
    }
    nodeHeaders[name] = [
      ...(Array.isArray(nodeHeaders[name])
        ? nodeHeaders[name]
        : [nodeHeaders[name]]),
      ...(Array.isArray(value) ? value : [value]),
    ];
  }
  return nodeHeaders;
}

function _isinitHeaders(
  value: HeadersInit | Record<string, any>,
): value is Headers {
  return typeof value?.entries === "function";
}

export function toWebResponseHeaders(
  headers: NodeResponseHeaders = {},
): Headers {
  if (headers instanceof Headers) {
    return headers;
  }
  const webHeaders = new Headers();
  for (const [name, value] of Object.entries(headers)) {
    if (value === undefined) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const v of value) {
        webHeaders.append(name, String(v));
      }
      continue;
    }
    webHeaders.set(name, String(value));
  }
  return webHeaders;
}
