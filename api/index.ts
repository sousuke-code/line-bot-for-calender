import express from "express";

import dotenv from "dotenv";
import { Client, WebhookEvent,middleware } from "@line/bot-sdk";
import { handleEvent } from "../src/messageHandler";

dotenv.config();


const app = express();


const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.CHANNEL_SECRET!,
};

app.use("/webhook",middleware(config));

const client = new Client(config);



app.post("/webhook", async(req, res) => {
    try {
        const events = req.body.events;
        await Promise.all(events.map(handleEvent));
        res.status(200).send("OK")
    } catch (error) {
        console.error("faile to connect", error);
        res.status(500).send("internal error");
    }
})


export default app;