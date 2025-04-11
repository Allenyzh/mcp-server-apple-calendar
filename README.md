# MCP Server for apple calendar

This is a simple mcp-server that allows you to use claude or other client to generate a calendar event.

## How to use

### Install dependencies and build

```bash
pnpm i
pnpm build
```

### Inpesctor tool

```bash
pnpm inspector
```

### MCP Server configration

Replace the `args` with your own path

```json
{
  "mcpServers:": {
    "mcp-server-apple-calendar": {
      "command": "node",
      "args": "./build/index.js"
    }
  }
}
```

## Example

<iframe width="436.8" height="245.7" src="https://www.youtube-nocookie.com/embed/2zp5Is0QhnE?si=4gq-msJq24Ip0xez" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Enjoy and Have fun!
