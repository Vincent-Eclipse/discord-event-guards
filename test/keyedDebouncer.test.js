const test = require("node:test");
const assert = require("node:assert/strict");
const { createKeyedDebouncer } = require("../src/keyedDebouncer");

function fakeTimers() {
  const timers = new Map();
  let nextId = 1;

  return {
    setTimeoutFn(callback, delay) {
      const id = nextId++;
      timers.set(id, { callback, delay });
      return id;
    },
    clearTimeoutFn(id) {
      timers.delete(id);
    },
    run(id) {
      const timer = timers.get(id);
      timers.delete(id);
      timer?.callback();
    },
    ids() {
      return [...timers.keys()];
    },
  };
}

test("coalesces repeated work for one guild", () => {
  const timers = fakeTimers();
  const debouncer = createKeyedDebouncer(500, timers);
  const runs = [];

  debouncer.schedule("guild-a", () => runs.push("first"));
  debouncer.schedule("guild-a", () => runs.push("latest"));

  assert.equal(timers.ids().length, 1);
  timers.run(timers.ids()[0]);
  assert.deepEqual(runs, ["latest"]);
  assert.equal(debouncer.isPending("guild-a"), false);
});

test("keeps different guilds independent", () => {
  const timers = fakeTimers();
  const debouncer = createKeyedDebouncer(500, timers);
  const runs = [];

  debouncer.schedule("guild-a", () => runs.push("a"));
  debouncer.schedule("guild-b", () => runs.push("b"));

  assert.equal(timers.ids().length, 2);
  for (const id of timers.ids()) timers.run(id);
  assert.deepEqual(runs, ["a", "b"]);
});

test("cancels pending work", () => {
  const timers = fakeTimers();
  const debouncer = createKeyedDebouncer(500, timers);

  debouncer.schedule("guild-a", () => assert.fail("cancelled work ran"));
  debouncer.cancel("guild-a");

  assert.equal(debouncer.isPending("guild-a"), false);
  assert.equal(timers.ids().length, 0);
});

