function createGuildOperationTracker() {
  const activeGuilds = new Set();

  function isActive(guildId) {
    return activeGuilds.has(String(guildId));
  }

  function begin(guildId) {
    activeGuilds.add(String(guildId));
  }

  function end(guildId) {
    activeGuilds.delete(String(guildId));
  }

  return { isActive, begin, end };
}

module.exports = { createGuildOperationTracker };

