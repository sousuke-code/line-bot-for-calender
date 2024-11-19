import { oauth2Client, getAccessToken } from "../src/googleAuth"
import { supabase } from "../src/supabaseClient"
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get(
    "/oauth2callback",
    async (req , res) => {
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
  