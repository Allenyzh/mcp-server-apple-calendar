import { writeFileSync } from "fs";
import { exec } from "child_process";
import path from "path";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

interface CalendarEventOptions {
  title: string;
  location: string;
  isAllDay: boolean;
  startTime: string; // "yyyy-mm-dd HH:MM:SS"
  endTime: string; // "yyyy-mm-dd HH:MM:SS"
}

export function addCalendarEvent(options: CalendarEventOptions): CallToolResult {
  const { title, location, isAllDay, startTime, endTime } = options;
//   const currentDateStr = new Date().toISOString().split("T")[0];

  const calendarName = "个人";
  const parseDateParts = (datetime: string) => {
    const [datePart, timePart] = datetime.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);
    return { year, month, day, hour, minute };
  };

  const start = parseDateParts(startTime);
  const end = parseDateParts(endTime);

  const eventDateScript = isAllDay
    ? ""
    : `
      set sd to current date
      set year of sd to ${start.year}
      set month of sd to ${start.month}
      set day of sd to ${start.day}
      set time of sd to (${start.hour} * hours + ${start.minute} * minutes)
      
      set ed to current date
      set year of ed to ${end.year}
      set month of ed to ${end.month}
      set day of ed to ${end.day}
      set time of ed to (${end.hour} * hours + ${end.minute} * minutes)
    `;

  const eventProps = isAllDay
    ? `allday event:true`
    : `start date:sd, end date:ed`;

  const scriptContent = `
    ${eventDateScript}
    tell application "Calendar"
      activate
      tell calendar "${calendarName}"
        make new event with properties {summary:"${title}", location:"${location}", ${eventProps}}
      end tell
    end tell
  `;

  const scriptPath = path.join(__dirname, "create_event.applescript");
  writeFileSync(scriptPath, scriptContent, { encoding: "utf8" });

  exec(`osascript "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ 添加失败: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ AppleScript 报错: ${stderr}`);
      return;
    }
    console.error("✅ 日历事件添加成功！");
    
  });

  return {
    content: [
      {
        type: "text",
        text: `事件 "${title}" 已添加到 "${calendarName}" 日历中。`,
      },
    ],
  };
}

// addCalendarEvent({
//     title: "AI 会议启动",
//     location: "Apple 总部",
//     isAllDay: false,
//     startTime: "2025-04-08 14:00:00",
//     endTime: "2025-04-08 15:30:00"
//   });
