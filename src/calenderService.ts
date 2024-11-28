import {google} from "googleapis";
import { oauth2Client } from "./googleAuth";
import { getUserAccessToken } from "./googleAuth";
import { supabase } from "./supabaseClient";



export const addEventToCalendar = async(userId: string,event: any) => {
    const { data: {session}, error: sessionError} = await supabase.auth.getSession();
    if (!session || sessionError) {
        console.error("Failed to retrieve user session:", sessionError || "No session found");
        throw new Error("User not authenticated or session not found");
    }

    const accessToken = session.provider_token;

    oauth2Client.setCredentials({ access_token: accessToken});

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
