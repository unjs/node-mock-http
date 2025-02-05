import unjs from "eslint-config-unjs";

export default unjs({
  ignores: [
    "src/_polyfill/buffer/**"
  ],
  rules: {
    "unicorn/no-null": 0,
    "unicorn/prefer-event-target": 0,
  },
  markdown: {
    rules: {
      // markdown rule overrides
    },
  },
});
