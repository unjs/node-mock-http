import { describe, expect, it } from "vitest";
import {
  fetchNodeRequestHandler,
  callNodeRequestHandler,
  type NodeRequestHandler,
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
    input: Record<string, string> | Headers | [string, string][];
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
        ["array", "c"],
      ],
      expected: { foo: "bar", host: "localhost", array: ["a", "b", "c"] },
    },
  ];

  it.each(requestHeaderTestCases)(
    "with request headers formatted as ($description)",
    async ({ input, expected }) => {
      const res = await fetchNodeRequestHandler(echoHandler, "/test", {
        headers: input,
      });
      expect(await res.json()).toEqual({ url: "/test", headers: expected });
    },
  );

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
