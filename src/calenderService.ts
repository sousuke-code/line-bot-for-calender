import {google} from "googleapis";
import { oauth2Client } from "./googleAuth";

const calendar = google.calendar({ version: "v3", auth: oauth2Client});

export const addEventToCalendar = async(event: any) => {
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
