import type * as NodeNet from "node:net";
import type { Callback, BufferEncoding } from "../_internal/types";
import { Duplex } from "../stream/duplex";

export class Socket extends Duplex implements NodeNet.Socket {
  __unenv__ = {};

  readonly bufferSize: number = 0;
  readonly bytesRead: number = 0;
  readonly bytesWritten: number = 0;
  readonly connecting: boolean = false;
  override readonly destroyed: boolean = false;
  readonly pending: boolean = false;
  readonly localAddress: string = "";
  readonly localPort: number = 0;
  readonly remoteAddress: string | undefined = "";
  readonly remoteFamily: string | undefined = "";
  readonly remotePort: number | undefined = 0;
  readonly autoSelectFamilyAttemptedAddresses = [];
  readonly readyState: NodeNet.SocketReadyState = "readOnly";

  constructor(_options?: NodeNet.SocketConstructorOpts) {
    super();
  }

  override write(
    _buffer: Uint8Array | string,
    _arg1?: BufferEncoding | Callback<Error | undefined>,
    _arg2?: Callback<Error | undefined>,
  ): boolean {
    return false;
  }

  connect(
    _arg1: number | string | NodeNet.SocketConnectOpts,
    _arg2?: string | Callback,
    _arg3?: Callback,
  ) {
    return this;
  }

  override end(
    _arg1?: Callback | Uint8Array | string,
    _arg2?: BufferEncoding | Callback,
    _arg3?: Callback,
  ) {
    return this;
  }

  override setEncoding(_encoding?: BufferEncoding): this {
    return this;
  }

  override pause() {
    return this;
  }

  override resume() {
    return this;
  }

  setTimeout(_timeout: number, _callback?: Callback): this {
    return this;
  }

  setNoDelay(_noDelay?: boolean): this {
    return this;
  }

  setKeepAlive(_enable?: boolean, _initialDelay?: number): this {
    return this;
  }

  address() {
    return {};
  }

  unref() {
    return this;
  }

  ref() {
    return this;
  }

  destroySoon() {
    this.destroy();
  }

  resetAndDestroy() {
    const err = new Error("ERR_SOCKET_CLOSED");
    (err as any).code = "ERR_SOCKET_CLOSED";
    this.destroy(err);
    return this;
  }
}

export class SocketAddress implements NodeNet.SocketAddress {
  readonly __unenv__ = true;

  address: string;
  family: "ipv4" | "ipv6";
  port: number;
  flowlabel: number;
  constructor(options: NodeNet.SocketAddress) {
    this.address = options.address;
    this.family = options.family;
    this.port = options.port;
    this.flowlabel = options.flowlabel;
  }
}
