import express from "express";

import dotenv from "dotenv";
import { Client, WebhookEvent,middleware } from "@line/bot-sdk";
import ngrok  from "ngrok";
import { handleEvent } from "./messageHandler";

dotenv.config();


const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
  channelSecret: process.env.CHANNEL_SECRET!,
};

app.use(middleware(config));

const client = new Client(config);



app.post("/webhook", async(req, res) => {
    try {
        const events = req.body.events;
        await Promise.all(events.map(handleEvent));
        res.status(200).send("OK")
    } catch (error) {
        console.log("faile to connect");
        res.status(500).send("internal error");
    }
})


app.listen(port, async() => {
    console.log(`Sercver is runnning on port ${port}`);

    try {
        const url = await ngrok.connect(port); 
        console.log(`ngrok URL: ${url}/webhook`);     
    } catch (error) {
        
    }
})