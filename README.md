# Discord event guards

Two small dependency-free utilities extracted from a larger Discord bot:

- a keyed debouncer that coalesces gateway event bursts per guild;
- an operation tracker that distinguishes bot-owned rebuild work from matching user-generated events.

Together they prevent duplicate notifications and avoid treating the bot's own channel or role changes as external interference. Timer injection keeps the debounce behavior deterministic in tests.

```sh
npm test
```

The bot client, commands, tokens, guild configuration, database code and moderation logic are intentionally not part of this repository.

