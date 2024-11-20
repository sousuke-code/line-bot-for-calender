import { oauth2Client, getAccessToken } from "../src/googleAuth"
import { supabase } from "../src/supabaseClient"
import express from "express";
import dotenv from "dotenv";
import { VercelRequest, VercelResponse} from "@vercel/node"

dotenv.config();


export default async (req: VercelRequest, res: VercelResponse) => {
    if (req.method !== "GET") {
      res.status(405).send("Method Not Allowed");
      return;
    }
  
    const code = req.query.code as string;
    const userId = req.query.state as string;
  
    if (!code || !userId) {
      res.status(400).send("Bad Request: Missing code or userId");
      return;
    }
  
    try {
      const tokens = await getAccessToken(code);
      oauth2Client.setCredentials(tokens);
  
      const { error } = await supabase.from("user_tokens").insert({
        access_token: tokens.access_token,
        line_user_id: userId,
        refresh_token : tokens.refresh_token,
        expiry_date: tokens.expiry_date
      });
  
      if (error) {
        console.error("Supabase error:", error);
        throw new Error("Failed to insert information to DB");
      }
  
      res.status(200).send("Authentication successful! You can close this tab.");
    } catch (error) {
      console.error("OAuth callback error:", error);
      res.status(500).send("Internal Server Error");
    }
  };