const test = require("node:test");
const assert = require("node:assert/strict");
const { createGuildOperationTracker } = require("../src/guildOperationTracker");

test("tracks a bot-owned operation for one guild", () => {
  const tracker = createGuildOperationTracker();

  assert.equal(tracker.isActive("123"), false);
  tracker.begin("123");
  assert.equal(tracker.isActive("123"), true);
  tracker.end("123");
  assert.equal(tracker.isActive("123"), false);
});

test("normalizes numeric and string guild ids", () => {
  const tracker = createGuildOperationTracker();
  tracker.begin(123);
  assert.equal(tracker.isActive("123"), true);
});

test("does not mix state between guilds", () => {
  const tracker = createGuildOperationTracker();
  tracker.begin("guild-a");

  assert.equal(tracker.isActive("guild-a"), true);
  assert.equal(tracker.isActive("guild-b"), false);
});

