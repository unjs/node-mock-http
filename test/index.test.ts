import { describe, expect, it } from "vitest";
import {
  fetchNodeRequestHandler,
  callNodeRequestHandler,
  IncomingMessage,
  ServerResponse,
  type NodeRequestHandler,
  type NodeRequestHeaders,
} from "../src";

const echoHandler: NodeRequestHandler = (req, res) => {
  res.end(JSON.stringify({ url: req.url, headers: req.headers }));
};

describe("callNodeRequestHandler", () => {
  it("works", async () => {
    const res = await callNodeRequestHandler(echoHandler, { url: "/test" });
    expect(JSON.parse(res.body)).toEqual({
      url: "/test",
      headers: { host: "localhost" },
    });
  });
});

describe("fetchNodeRequestHandler", () => {
  it("works", async () => {
    const res = await fetchNodeRequestHandler(
      echoHandler,
      "http://example.com/test",
    );
    expect(await res.json()).toEqual({
      url: "/test",
      headers: { host: "example.com" },
    });
  });

  const requestHeaderTestCases: {
    description: string;
    input: HeadersInit & (HeadersInit | NodeRequestHeaders);
    expected: Record<string, string | string[]>;
  }[] = [
    {
      description: "Headers",
      input: new Headers({ foo: "bar", empty: "" }),
      expected: { foo: "bar", host: "localhost" },
    },
    {
      description: "object",
      input: { foo: "bar", empty: "" },
      expected: { foo: "bar", host: "localhost" },
    },
    {
      description: "array",
      input: [
        ["foo", "bar"],
        ["empty", ""],
        ["array", "a"],
        ["array", "b"],
        ["array", ""],
        ["array", "c"],
      ],
      expected: { foo: "bar", host: "localhost", array: ["a", "b", "c"] },
    },
  ];

  for (const testCase of requestHeaderTestCases) {
    const { description, input, expected } = testCase;

    it(`with request headers formatted as ${description}`, async () => {
      const res = await fetchNodeRequestHandler(echoHandler, "/test", {
        headers: input,
      });
      expect(await res.json()).toEqual({ url: "/test", headers: expected });
    });
  }

  it("error response", async () => {
    const res = await fetchNodeRequestHandler(() => {
      throw new Error("test error");
    }, "/error");
    expect(await res.text()).toBe("Error: test error");
    expect(res.status).toBe(500);
  });

  it("HEAD request", async () => {
    const res = await fetchNodeRequestHandler(
      (req, res) => {
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ url: req.url }));
      },
      "/test",
      { method: "HEAD" },
    );
    expect(await res.text()).toBe("");
    expect(res.headers.get("content-type")).toBe("application/json");
    expect(res.headers.get("content-length")).toBe(null);
  });

  it("response headers", async () => {
    const res = await fetchNodeRequestHandler((req, res) => {
      res.setHeader("content-type", "application/json");
      res.setHeader("max-age", 3600);
      res.setHeader("set-cookie", "a=b; c=d");
      res.appendHeader("set-cookie", ["e=f", "g=h"]);
      res.setHeader("x-unused", undefined as any);
    }, "/test");

    expect(res.headers.getSetCookie()).toEqual(["a=b; c=d", "e=f", "g=h"]);

    expect(Object.fromEntries(res.headers)).toEqual({
      "content-type": "application/json",
      "max-age": "3600",
      "set-cookie": "g=h", // expect Headers behavior
    });
  });
});

describe("ServerResponse#end callback", () => {
  it("invokes callback with no chunk", async () => {
    const calls: string[] = [];
    const res = await fetchNodeRequestHandler((_req, res) => {
      res.on("finish", () => calls.push("finish"));
      res.end(() => calls.push("callback"));
    }, "/test");
    expect(await res.text()).toBe("");
    expect(calls).toEqual(["finish", "callback"]);
  });

  it("invokes callback once with chunk", async () => {
    const calls: string[] = [];
    const res = await fetchNodeRequestHandler((_req, res) => {
      res.on("finish", () => calls.push("finish"));
      res.end("hello", () => calls.push("callback"));
    }, "/test");
    expect(await res.text()).toBe("hello");
    expect(calls).toEqual(["finish", "callback"]);
  });

  it("invokes callback once with chunk and encoding", async () => {
    let calls = 0;
    const res = await fetchNodeRequestHandler((_req, res) => {
      res.end("hello", "utf8", () => calls++);
    }, "/test");
    expect(await res.text()).toBe("hello");
    expect(calls).toBe(1);
  });

  it("invokes callback on an already ended response", async () => {
    let calls = 0;
    const res = await fetchNodeRequestHandler((_req, res) => {
      res.end("hello");
      res.end(() => calls++);
    }, "/test");
    expect(await res.text()).toBe("hello");
    expect(calls).toBe(1);
  });
});

describe("ServerResponse.writeHead header arrays", () => {
  it("accepts Node's flat [k, v, k, v] array", () => {
    const res = new ServerResponse(new IncomingMessage());
    res.writeHead(200, ["content-type", "image/jpeg", "x-a", "1"]);
    expect(res.getHeader("content-type")).toBe("image/jpeg");
    expect(res.getHeader("x-a")).toBe("1");
  });

  it("accepts an array of [k, v] pairs", () => {
    const res = new ServerResponse(new IncomingMessage());
    res.writeHead(200, [
      ["content-type", "image/png"],
      ["x-b", "2"],
    ]);
    expect(res.getHeader("content-type")).toBe("image/png");
    expect(res.getHeader("x-b")).toBe("2");
  });

  it("replaces an earlier setHeader, then appends duplicates", () => {
    const res = new ServerResponse(new IncomingMessage());
    res.setHeader("x-nosniff", "old");
    res.writeHead(200, [
      "x-nosniff",
      "new",
      "set-cookie",
      "a=1",
      "set-cookie",
      "b=2",
    ]);
    expect(res.getHeader("x-nosniff")).toBe("new");
    expect(res.getHeader("set-cookie")).toEqual(["a=1", "b=2"]);
  });

  it("keeps an array value in a pair intact", () => {
    const res = new ServerResponse(new IncomingMessage());
    res.writeHead(200, [
      ["set-cookie", ["a=1", "b=2"]],
      ["x-e", "5"],
    ]);
    expect(res.getHeader("set-cookie")).toEqual(["a=1", "b=2"]);
    expect(res.getHeader("x-e")).toBe("5");
  });

  it("ignores a trailing key with no value in a flat list", () => {
    const res = new ServerResponse(new IncomingMessage());
    res.writeHead(200, ["x-d", "4", "dangling"]);
    expect(res.getHeader("x-d")).toBe("4");
    expect(res.getHeader("dangling")).toBeUndefined();
  });

  it("ignores a pair with no value", () => {
    const res = new ServerResponse(new IncomingMessage());
    res.writeHead(200, [["x-a", "1"], ["dangling"]] as never);
    expect(res.hasHeader("dangling")).toBe(false);
    expect(res.getHeaderNames()).toEqual(["x-a"]);
  });

  it("keeps falsy duplicate values", () => {
    const res = new ServerResponse(new IncomingMessage());
    res.writeHead(200, ["x-id", 1, "x-id", 0] as never);
    expect(res.getHeader("x-id")).toEqual([1, 0]);

    const res2 = new ServerResponse(new IncomingMessage());
    res2.writeHead(200, ["x-s", "a", "x-s", ""]);
    expect(res2.getHeader("x-s")).toEqual(["a", ""]);
  });

  it("still accepts a plain headers object", () => {
    const res = new ServerResponse(new IncomingMessage());
    res.writeHead(200, { "content-type": "text/html" });
    expect(res.getHeader("content-type")).toBe("text/html");
  });
});
