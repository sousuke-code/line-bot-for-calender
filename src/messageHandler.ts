import { Client,WebhookEvent,Message } from "@line/bot-sdk";
import dotenv from "dotenv";

dotenv.config();


const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
    channelSecret: process.env.CHANNEL_SECRET!,
}

const client = new Client(config);


export const  handleEvent = (event: WebhookEvent) => {
    if (event.type !== "message" || event.message.type !== "text" ) {
        return Promise.resolve(null);
    }

    const userMessage = event.message.text;

    let replyMessage: Message;

    switch(userMessage) {
        case "こんにちは":
            replyMessage = {
                type:"text",
                text: "何かお手伝いしましょうか？",
            };
            break;
        case "よてい":
            replyMessage = {
                type: "text",
                text: "日程と予定を入力して下さい",
            };
            break;
        default:
            replyMessage = {
                type:"text",
                text: "よていと打って下さい",
            };
            break;
    }

   return client.replyMessage(event.replyToken, [replyMessage]);
}