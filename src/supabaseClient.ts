import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;


if (!supabaseUrl || !supabaseAnonKey){
    throw new Error("not found supabase enviroment variable");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


async function signInWithGoogle() {
    const { error }  = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
           redirectTo: 'https://thyhkmeeivukrfixjnsa.supabase.co/auth/v1/callback'
        },
    })

    if (error) {
        console.error('Google sigin-in error', error);
    }
}
