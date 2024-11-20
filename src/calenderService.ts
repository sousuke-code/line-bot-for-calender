import { google } from "googleapis";
import { getUserAccessToken } from "./googleAuth";

// イベントの型定義
interface Event {
    title: string;
    startDateTime: string;
    endDateTime: string;
}

export const addEventToUserCalendar = async (
    userId: string,
    event: Event
): Promise<boolean> => {
    const tokens = await getUserAccessToken(userId);
    const oauthClient = new google.auth.OAuth2();
    oauthClient.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauthClient });

    try {
        const res = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
                summary: event.title,
                start: { dateTime: event.startDateTime, timeZone: "Asia/Tokyo" },
                end: { dateTime: event.endDateTime, timeZone: "Asia/Tokyo" },
            },
        });

        return res.status === 200;
    } catch (error) {
        console.error("Failed to add event:", error);
        return false;
    }
};