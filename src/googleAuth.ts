import { google } from "googleapis";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient";

dotenv.config();

const app = express();

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID, 
  process.env.GOOGLE_CLIENT_SECRET, 
 "https://line-bot-for-calender.vercel.app/oauth2callback"
);

export const generateAuthUrl = () => {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
};

export const getAccessToken = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

app.get(
  "/oauth2callback",
  async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const userId = req.query.state as string;

    if (!code) {
      return res.status(400).send("Bad Request: Missing code");
    }

    try {
      const tokens = await getAccessToken(code);
      oauth2Client.setCredentials(tokens);

      const { error }  = await supabase.from('user_tokens').insert({ access_token: tokens.access_token, line_user_id: userId});

      if (error) {
          throw new Error("failed to insert information to DB");
    }

      res.status(200).send("Success");
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
  }
);
