import type { IncomingMessage } from "../http/request";
import type { ServerResponse } from "../http/response";

type MaybePromise<T> = T | Promise<T>;

export type NodeRequestHandler = (
  req: IncomingMessage,
  res: ServerResponse,
) => MaybePromise<void | unknown>;

export type NodeRequestHeaders = Record<string, string | string[]>;

export type NodeResponseHeaders = Record<
  string,
  string | undefined | number | string[]
>;

export type AbstractRequest = {
  [key: string]: any;
  url?: URL | string;
  method?: string;
  headers?: HeadersInit | NodeRequestHeaders;
  protocol?: string;
  body?: any;
};

export type AbstractResponse = {
  body: any;
  headers: NodeResponseHeaders;
  status: number;
  statusText: string;
};
