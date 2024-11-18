export const parseMessageToEvent = (message: string) => {
    const regex = /(\d{4}\/\d{2}\/\d{2}) (\d{2}:\d{2}) (.+)/;
    const match = message.match(regex);

    if (match) {
        const [_, date, time, title] = match;
        const startDateTime = `${date}T${time}:00+09:00`;
        const endDateTime = new Date(
            new Date(startDateTime).getTime() + 60 * 60 * 1000
        ).toISOString();

        return {
            summary: title,
            start: { dateTime: startDateTime, timeZone: "Asia/Tokyo" },
            end: { dateTime: endDateTime, timeZone: "Asia/Tokyo" },
        };
    }

    return null;
};