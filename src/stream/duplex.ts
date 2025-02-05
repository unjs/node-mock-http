import type * as NodeStream from "node:stream";
import { Readable } from "./readable";
import { Writable } from "./writable";

type DuplexClass = new () => NodeStream.Duplex;

const __Duplex: DuplexClass = class {
  allowHalfOpen: boolean = true;
  private _destroy: (error?: Error) => void;

  constructor(readable = new Readable(), writable = new Writable()) {
    Object.assign(this, readable);
    Object.assign(this, writable);
    this._destroy = mergeFns(readable._destroy, writable._destroy);
  }
} as any;

function getDuplex() {
  Object.assign(__Duplex.prototype, Readable.prototype);
  Object.assign(__Duplex.prototype, Writable.prototype);
  return __Duplex;
}

function mergeFns(...functions: ((...args: any[]) => any)[]) {
  return function (...args: any[]) {
    for (const fn of functions) {
      fn(...args);
    }
  };
}

export const Duplex = /* #__PURE__ */ getDuplex();
