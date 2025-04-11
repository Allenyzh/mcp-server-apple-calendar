import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { addCalendarEvent } from "./calendar";

const server = new McpServer({
  name: "playwright-mcp-server",
  description: "A server that add calendar events.",
  version: "1.0.0",
});

server.tool(
  "addCalendarEvent",
  "Add a calendar event",
  {
    title: z.string().default("").describe(`Event title, this is required`),
    location: z.string().default("").describe("Event location, input excat address as detailed as possible, like: '100 some av, city, provence, country, A1A2B2' , this is required"),
    isAllDay: z.boolean().default(false).describe("Is this an all-day event?"),
    startTime: z.string().describe("format: yyyy-mm-dd HH:MM:SS , this is required"),
    endTime: z.string().describe("format: yyyy-mm-dd HH:MM:SS , this is required"),
  },
  async (args) => {
    await addCalendarEvent({
      title: args.title,
      location: args.location,
      isAllDay: args.isAllDay,
      startTime: args.startTime,
      endTime: args.endTime,
    });
    return {
      content: [
        {
          type: "text",
          text: "Calendar event added successfully.",
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main(): ", error);
  process.exit(1);
});
