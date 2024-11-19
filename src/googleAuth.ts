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




