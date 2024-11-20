import { google } from "googleapis";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient";
import { assert, error } from "console";

dotenv.config();

const app = express();

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID, 
  process.env.GOOGLE_CLIENT_SECRET, 
 "https://line-bot-for-calender.vercel.app/api/oauth2callback"
);

export const generateAuthUrl = (userId : string) => {
  const scopes = ["https://www.googleapis.com/auth/calendar"];
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: userId,
  });
};

export const getAccessToken = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

export const saveUserAccessToken = async (userId: string, tokens:any) => {
    const { access_token, refresh_token, expiry_date} = tokens;
    await supabase
     .from('user_tokens')
     .update({ access_token, refresh_token, expiry_date})
     .eq('line_user_id', userId)
};

export const getUserAccessToken = async(userId : string) => {
    const {data, error} = await supabase
      .from('user_tokens')
      .select('access_token, refresh_token, expiry_date')
      .eq('line_user_id', userId)
      .single();
    if (error) throw error;
    return data;
}


