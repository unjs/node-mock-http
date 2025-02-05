import type NodeHTTP from "node:http";
import { Socket } from "../net/socket";
import { Readable } from "../stream/readable";

export class IncomingMessage
  extends Readable
  implements NodeHTTP.IncomingMessage
{
  public aborted: boolean = false;
  public httpVersion: string = "1.1";
  public httpVersionMajor: number = 1;
  public httpVersionMinor: number = 1;
  public complete: boolean = true;
  public connection: Socket;
  public socket: Socket;
  public headers: NodeHTTP.IncomingHttpHeaders = {};
  public trailers = {};
  public method: string = "GET";
  public url: string = "/";
  public statusCode: number = 200;
  public statusMessage: string = "";

  public override closed: boolean = false;
  public override errored: Error | null = null;

  override readable: boolean = false;

  constructor(socket?: Socket) {
    super();
    this.socket = this.connection = socket || new Socket();
  }

  get rawHeaders() {
    const headers = this.headers;
    const rawHeaders = [];
    for (const key in headers) {
      if (Array.isArray(headers[key])) {
        for (const h of headers[key] as any) {
          rawHeaders.push(key, h);
        }
      } else {
        rawHeaders.push(key, headers[key]);
      }
    }
    return rawHeaders;
  }

  get rawTrailers() {
    return [];
  }

  setTimeout(_msecs: number, _callback?: () => void) {
    return this;
  }

  get headersDistinct() {
    return _distinct(this.headers);
  }

  get trailersDistinct() {
    return _distinct(this.trailers);
  }
}

function _distinct(obj: Record<string, any>) {
  const d: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key) {
      d[key as string] = (Array.isArray(value) ? value : [value]).filter(
        Boolean,
      );
    }
  }
  return d;
}
