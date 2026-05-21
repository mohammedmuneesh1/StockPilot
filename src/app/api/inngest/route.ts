import {serve} from "inngest/next"
import { inngest } from "@/lib/inngest/client" 
import { sendDailyNewsSummary, sendSignUpEmail } from "@/lib/inngest/function";
export const {GET,POST,PUT}  = serve({
    client: inngest,
    functions:[
        sendSignUpEmail,
        sendDailyNewsSummary
    ] , // backgorund jobs , the function that will run in the background when triggered by an event or workflow in inngest
});

//essentially exposing inngest function via next js api route 
//which make this function callable within our app, next js will handle the routing and we can call this function from anywhere in our app to trigger background jobs or workflows defined in inngest.

