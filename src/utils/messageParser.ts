const chrono = require("chrono-node");

export const parseMessageToEvent = (message: string) => {
    const parsed = chrono.parse(message); 

    if (parsed.length === 0) {
        throw new Error("メッセージから日時情報を解析できませんでした。");
    }

    const result = parsed[0];
    const startDateTime = result.start.date(); 
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); 

    
    const title = message.replace(result.text, "").trim();

    if (!title) {
        throw new Error("イベントのタイトルが見つかりませんでした。");
    }

    return {
        summary: title,
        start: { dateTime: startDateTime.toISOString(), timeZone: "Asia/Tokyo" },
        end: { dateTime: endDateTime.toISOString(), timeZone: "Asia/Tokyo" },
    };
};