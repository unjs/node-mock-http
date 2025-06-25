import type NodeHTTP from "node:http";
import type { Socket } from "node:net";
import type { Callback } from "../_internal/types";
import { Writable } from "../stream/writable";
import type { IncomingMessage } from "node:http";

export class ServerResponse
  extends Writable
  implements NodeHTTP.ServerResponse<IncomingMessage>
{
  statusCode: number = 200;
  statusMessage: string = "";
  upgrading: boolean = false;
  chunkedEncoding: boolean = false;
  shouldKeepAlive: boolean = false;
  useChunkedEncodingByDefault: boolean = false;
  sendDate: boolean = false;
  finished: boolean = false;
  headersSent: boolean = false;
  strictContentLength = false;
  writableAborted = false;
  connection: Socket | null = null;
  socket: Socket | null = null;

  req: NodeHTTP.IncomingMessage;

  _headers: Record<string, number | string | string[] | undefined> = {};

  constructor(req: NodeHTTP.IncomingMessage) {
    super();
    this.req = req;
  }

  assignSocket(socket: Socket): void {
    // @ts-ignore
    socket._httpMessage = this;
    // socket.on('close', onServerResponseClose)
    this.socket = socket;
    this.connection = socket;
    this.emit("socket", socket);
    this._flush();
  }

  _flush() {
    this.flushHeaders();
  }

  detachSocket(_socket: Socket): void {}

  writeContinue(_callback?: Callback): void {}

  writeHead(
    statusCode: number,
    arg1?:
      | string
      | NodeHTTP.OutgoingHttpHeaders
      | NodeHTTP.OutgoingHttpHeader[],
    arg2?: NodeHTTP.OutgoingHttpHeaders | NodeHTTP.OutgoingHttpHeader[],
  ) {
    if (statusCode) {
      this.statusCode = statusCode;
    }
    if (typeof arg1 === "string") {
      this.statusMessage = arg1;
      arg1 = undefined;
    }
    const headers = arg2 || arg1;
    if (headers) {
      if (Array.isArray(headers)) {
        // TODO: OutgoingHttpHeader[]
      } else {
        for (const key in headers) {
          // @ts-ignore
          this.setHeader(key, headers[key]);
        }
      }
    }
    this.headersSent = true;
    return this;
  }

  writeProcessing(): void {}

  setTimeout(_msecs: number, _callback?: Callback): this {
    return this;
  }

  appendHeader(name: string, value: string | string[]) {
    name = name.toLowerCase();
    const current = this._headers[name];
    const all = [
      ...(Array.isArray(current) ? current : [current]),
      ...(Array.isArray(value) ? value : [value]),
    ].filter(Boolean) as string[];
    this._headers[name] = all.length > 1 ? all : all[0];
    return this;
  }

  setHeader(name: string, value: number | string | string[]): this {
    this._headers[name.toLowerCase()] = value;
    return this;
  }

  setHeaders(
    headers: Headers | Map<string, number | string | readonly string[]>,
  ): this {
    for (const [key, value] of Object.entries(headers)) {
      this.setHeader(key, value);
    }
    return this;
  }

  getHeader(name: string): number | string | string[] | undefined {
    return this._headers[name.toLowerCase()];
  }

  getHeaders(): NodeHTTP.OutgoingHttpHeaders {
    return this._headers;
  }

  getHeaderNames(): string[] {
    return Object.keys(this._headers);
  }

  hasHeader(name: string): boolean {
    return name.toLowerCase() in this._headers;
  }

  removeHeader(name: string): void {
    delete this._headers[name.toLowerCase()];
  }

  addTrailers(
    _headers: NodeHTTP.OutgoingHttpHeaders | ReadonlyArray<[string, string]>,
  ): void {}

  flushHeaders(): void {}

  writeEarlyHints(
    _headers: NodeHTTP.OutgoingHttpHeaders,
    cb: () => void,
  ): void {
    if (typeof cb === "function") {
      cb();
    }
  }
}
