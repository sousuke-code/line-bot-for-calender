const chrono = require("chrono-node");

export const parseMessageToEvent = (message: string) => {
    // chronoでメッセージを解析
    const parsed = chrono.parse(message); 

    if (parsed.length === 0) {
        throw new Error("メッセージから日時情報を解析できませんでした。");
    }

    const result = parsed[0]; // 最初の解析結果を使用
    const startDateTime = result.start.date(); // 開始日時
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1時間後を終了日時とする

    // イベントタイトルを取得（日時部分を除外）
    const title = message.replace(result.text, "").trim();

    if (!title) {
        throw new Error("イベントのタイトルが見つかりませんでした。");
    }

    // Googleカレンダー用のイベントデータを作成
    return {
        summary: title,
        start: { dateTime: startDateTime.toISOString(), timeZone: "Asia/Tokyo" },
        end: { dateTime: endDateTime.toISOString(), timeZone: "Asia/Tokyo" },
    };
};