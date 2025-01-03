import { Client,WebhookEvent,Message } from "@line/bot-sdk";
import dotenv from "dotenv";
import { generateAuthUrl } from "./googleAuth";
import { addEventToCalendar } from "./calenderService";
import { parseMessageToEvent } from "./utils/messageParser";

dotenv.config();


const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN!,
    channelSecret: process.env.CHANNEL_SECRET!,
}

const client = new Client(config);


export const  handleEvent = async(event: WebhookEvent) => {
    if (event.type !== "message" || event.message.type !== "text" ) {
        return Promise.resolve(null);
    }

    const userMessage = event.message.text;

    let replyMessage: Message;

    if(userMessage === "認証") {
        const userId  = event.source.userId;
        if (!userId) {
            return client.replyMessage(event.replyToken, {
                type: "text",
                text: "もう一度送信して下さい"
            })
        }
        const authUrl = `https://thyhkmeeivukrfixjnsa.supabase.co/auth/v1/authorize?provider=google`;
        return client.replyMessage(event.replyToken, [{
          type: "text",
          text: "下記のURLから認証を行ってください"
        },
        {
            type: "text",
            text: `${authUrl}`

        }
    ]);
    }


    
    const parsedEvent = parseMessageToEvent(userMessage);
    const userId  = event.source.userId;
    if (!userId)  {
        return client.replyMessage(event.replyToken,
             {
            type: "text",
            text: "もう一度送信して下さい"
        });
    }
    
    if (parsedEvent) {
        try {
            const result = await addEventToCalendar(userId , parsedEvent);
            return client.replyMessage(event.replyToken, {
                type: "text",
                text: "予定をカレンダーに追加しました！",
            });
        } catch (error) {
            console.error("failed to add event:", error);
            return client.replyMessage(event.replyToken, {
                type: "text",
                text: "予定の追加に失敗しました。再試行してください。",
            });
        }
    } else {
        return client.replyMessage(event.replyToken, {
            type: "text",
            text: "予定を追加するには「YYYY/MM/DD HH:MM タイトル」の形式で送信してください。",
        });
    }
}