import {google} from "googleapis";
import { oauth2Client } from "./googleAuth";
import { getUserAccessToken } from "./googleAuth";



export const addEventToCalendar = async(userId: string,event: any) => {
    const tokens = await getUserAccessToken(userId);
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client});

    try {
        const response = await calendar.events.insert({
            calendarId : "primary",
            requestBody: event,
        });
        return response.data;
    } catch (error) {
        console.error("failed to add event:", error);
        throw error;
    }
};
