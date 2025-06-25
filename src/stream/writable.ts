import type * as NodeStream from "node:stream";
import { EventEmitter } from "node-mock-http/_polyfill/events";
import { Buffer } from "node-mock-http/_polyfill/buffer";
import type { BufferEncoding, Callback } from "../_internal/types";

export class Writable extends EventEmitter implements NodeStream.Writable {
  __unenv__ = {};

  readonly writable: boolean = true;
  writableEnded: boolean = false;
  writableFinished: boolean = false;
  readonly writableHighWaterMark: number = 0;
  readonly writableLength: number = 0;
  readonly writableObjectMode: boolean = false;
  readonly writableCorked: number = 0;
  readonly closed: boolean = false;
  readonly errored: Error | null = null;
  readonly writableNeedDrain: boolean = false;
  readonly writableAborted: boolean = false;

  destroyed: boolean = false;

  _data: unknown;
  _encoding: BufferEncoding = "utf8";

  constructor(_opts?: NodeStream.WritableOptions) {
    super();
  }

  pipe<T>(_destenition: T, _options?: { end?: boolean }): T {
    return {} as T;
  }

  _write(chunk: any, encoding: BufferEncoding, callback?: Callback): void {
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return;
    }
    if (this._data === undefined) {
      this._data = chunk;
    } else {
      const a =
        typeof this._data === "string"
          ? Buffer.from(this._data, this._encoding || encoding || "utf8")
          : this._data;
      const b =
        typeof chunk === "string"
          ? Buffer.from(chunk, encoding || this._encoding || "utf8")
          : chunk;
      this._data = Buffer.concat([a, b]);
    }
    this._encoding = encoding;
    if (callback) {
      callback();
    }
  }

  _writev?(
    _chunks: Array<{ chunk: any; encoding: BufferEncoding }>,
    _callback: (error?: Error | null) => void,
  ): void {}

  _destroy(_error: any, _callback: Callback<any>): void {}

  _final(_callback: Callback) {}

  write(
    chunk: any,
    arg2?: BufferEncoding | Callback,
    arg3?: Callback,
  ): boolean {
    const encoding = typeof arg2 === "string" ? this._encoding : "utf8";
    // prettier-ignore
    // eslint-disable-next-line unicorn/no-nested-ternary
    const cb = typeof arg2 === "function" ? arg2 : typeof arg3 === "function"  ? arg3 : undefined;
    this._write(chunk, encoding, cb);
    return true;
  }

  setDefaultEncoding(_encoding: BufferEncoding): this {
    return this;
  }

  end(arg1: Callback | any, arg2?: Callback | BufferEncoding, arg3?: Callback) {
    // prettier-ignore
    // eslint-disable-next-line unicorn/no-nested-ternary
    const callback = typeof arg1 === "function" ? arg1 : typeof arg2 === "function" ? arg2 : typeof arg3 === "function" ? arg3 : undefined;
    if (this.writableEnded) {
      if (callback) {
        callback();
      }
      return this;
    }
    const data = arg1 === callback ? undefined : arg1;
    if (data) {
      const encoding = arg2 === callback ? undefined : arg2;
      this.write(data, encoding, callback);
    }
    this.writableEnded = true;
    this.writableFinished = true;
    this.emit("close");
    this.emit("finish");
    return this;
  }

  cork(): void {}

  uncork(): void {}

  destroy(_error?: Error) {
    this.destroyed = true;
    delete this._data;
    this.removeAllListeners();
    return this;
  }

  compose<T extends NodeJS.ReadableStream>(
    _stream: T | ((source: any) => void) | Iterable<T> | AsyncIterable<T>,
    _options?: { signal: AbortSignal } | undefined,
  ): T {
    throw new Error("Method not implemented.");
  }
}
