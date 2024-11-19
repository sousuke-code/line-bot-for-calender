export const parseMessageToEvent = (message: string) => {
    const regex = /(\d{4}\/\d{2}\/\d{2}) (\d{2}:\d{2}) (.+)/;
    const match = message.match(regex);

    if (!match) {
        console.error("Invalid message format:", message); // デバッグ用
        throw new Error("Invalid message format. Please use 'YYYY/MM/DD HH:MM タイトル'.");
    }

    const [_, date, time, title] = match;
    const [year, month, day] = date.split("/").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    // 日付の妥当性チェック
    if (month < 1 || month > 12 || day < 1 || day > 31) {
        throw new Error(`Invalid date: ${date}`);
    }

    // 時刻の妥当性チェック
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        throw new Error(`Invalid time: ${time}`);
    }

    const startDateTime = `${date}T${time}:00+09:00`;

    if (isNaN(new Date(startDateTime).getTime())) {
        console.error("Invalid date or time value:", startDateTime); // デバッグ用
        throw new Error("Invalid date or time value. Please check your input.");
    }

    const endDateTime = new Date(
        new Date(startDateTime).getTime() + 60 * 60 * 1000 // 1時間後
    ).toISOString();

    return {
        summary: title,
        start: { dateTime: startDateTime, timeZone: "Asia/Tokyo" },
        end: { dateTime: endDateTime, timeZone: "Asia/Tokyo" },
    };
};