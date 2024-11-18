import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

export const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID, // Google Cloudで取得したクライアントID
    process.env.GOOGLE_CLIENT_SECRET, // クライアントシークレット
    "https://line-bot-for-calender.vercel.app/oauth2callback" // リダイレクトURI
);

export const generateAuthUrl = () => {
    const scopes = ["https://www.googleapis.com/auth/calendar"];
    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
    })
}

export const getAccessToken = async (code :string) => {
    const { tokens } =await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens;
}


