import type * as NodeStream from "node:stream";
import { EventEmitter } from "node-mock-http/_polyfill/events";
import type { BufferEncoding, Callback } from "../_internal/types";
import { createNotImplementedError } from "../_internal/utils";

export class Readable extends EventEmitter implements NodeStream.Readable {
  __unenv__ = {};

  readonly readableEncoding: BufferEncoding | null = null;
  readonly readableEnded: boolean = true;
  readonly readableFlowing: boolean | null = false;
  readonly readableHighWaterMark: number = 0;
  readonly readableLength: number = 0;
  readonly readableObjectMode: boolean = false;
  readonly readableAborted: boolean = false;
  readonly readableDidRead: boolean = false;
  readonly closed: boolean = false;
  readonly errored: Error | null = null;

  readable: boolean = false;
  destroyed: boolean = false;

  static from(
    _iterable: Iterable<any> | AsyncIterable<any>,
    options?: NodeStream.ReadableOptions,
  ) {
    return new Readable(options);
  }

  constructor(_opts?: NodeStream.ReadableOptions) {
    super();
  }

  _read(_size: number) {}

  read(_size?: number) {}

  setEncoding(_encoding: BufferEncoding) {
    return this;
  }

  pause() {
    return this;
  }

  resume() {
    return this;
  }

  isPaused() {
    return true;
  }

  unpipe(_destination?: any) {
    return this;
  }

  unshift(_chunk: any, _encoding?: BufferEncoding) {}

  wrap(_oldStream: any) {
    return this;
  }

  push(_chunk: any, _encoding?: BufferEncoding) {
    return false;
  }

  _destroy(_error?: any, _callback?: Callback<any>) {
    this.removeAllListeners();
  }

  destroy(error?: Error) {
    this.destroyed = true;
    this._destroy(error);
    return this;
  }

  pipe<T>(_destination: T, _options?: { end?: boolean }): T {
    return {} as T;
  }

  compose<T extends NodeJS.ReadableStream>(
    _stream: T | ((source: any) => void) | Iterable<T> | AsyncIterable<T>,
    _options?: { signal: AbortSignal } | undefined,
  ): T {
    throw new Error("Method not implemented.");
  }

  [Symbol.asyncDispose]() {
    this.destroy();
    return Promise.resolve();
  }

  // eslint-disable-next-line require-yield
  async *[Symbol.asyncIterator](): NodeJS.AsyncIterator<any> {
    throw createNotImplementedError("Readable.asyncIterator");
  }

  iterator(
    _options?: { destroyOnReturn?: boolean | undefined } | undefined,
  ): NodeJS.AsyncIterator<any> {
    throw createNotImplementedError("Readable.iterator");
  }

  map(
    _fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => any,
    _options?: ArrayOptions | undefined,
  ): NodeStream.Readable {
    throw createNotImplementedError("Readable.map");
  }

  filter(
    _fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined,
    ) => boolean,
    _options?: ArrayOptions | undefined,
  ): NodeStream.Readable {
    throw createNotImplementedError("Readable.filter");
  }

  forEach(
    _fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined,
    ) => void | Promise<void>,
    _options?: ArrayOptions | undefined,
  ): Promise<void> {
    throw createNotImplementedError("Readable.forEach");
  }

  reduce(
    _fn: (
      accumulator: any,
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined,
    ) => any,
    _initialValue?: any,
    _options?: ArrayOptions | undefined,
  ): Promise<any> {
    throw createNotImplementedError("Readable.reduce");
  }

  find(
    _fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined,
    ) => boolean,
    _options?: ArrayOptions | undefined,
  ): Promise<any> {
    throw createNotImplementedError("Readable.find");
  }

  findIndex(
    _fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined,
    ) => boolean,
    _options?: ArrayOptions | undefined,
  ): Promise<number> {
    throw createNotImplementedError("Readable.findIndex");
  }

  some(
    _fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined,
    ) => boolean,
    _options?: ArrayOptions | undefined,
  ): Promise<boolean> {
    throw createNotImplementedError("Readable.some");
  }

  toArray(_options?: Pick<ArrayOptions, "signal"> | undefined): Promise<any[]> {
    throw createNotImplementedError("Readable.toArray");
  }

  every(
    _fn: (
      data: any,
      options?: Pick<ArrayOptions, "signal"> | undefined,
    ) => boolean | Promise<boolean>,
    _options?: ArrayOptions | undefined,
  ): Promise<boolean> {
    throw createNotImplementedError("Readable.every");
  }

  flatMap(
    _fn: (data: any, options?: Pick<ArrayOptions, "signal"> | undefined) => any,
    _options?: ArrayOptions | undefined,
  ): NodeStream.Readable {
    throw createNotImplementedError("Readable.flatMap");
  }

  drop(
    _limit: number,
    _options?: Pick<ArrayOptions, "signal"> | undefined,
  ): NodeStream.Readable {
    throw createNotImplementedError("Readable.drop");
  }

  take(
    _limit: number,
    _options?: Pick<ArrayOptions, "signal"> | undefined,
  ): NodeStream.Readable {
    throw createNotImplementedError("Readable.take");
  }

  asIndexedPairs(
    _options?: Pick<ArrayOptions, "signal"> | undefined,
  ): NodeStream.Readable {
    throw createNotImplementedError("Readable.asIndexedPairs");
  }
}

interface ArrayOptions {
  concurrency?: number;
  signal?: AbortSignal;
}
