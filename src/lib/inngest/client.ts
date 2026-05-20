import { Inngest} from "inngest";

export const inngest = new Inngest({
    id: 'StockPilot',
    //"Hey Inngest, when my background jobs need AI features, use Gemini with this API key."
    ai: { gemini: {
         apiKey: process.env.GEMINI_API_KEY! 
        }}
});





// Thing	Purpose
// Inngest	Runs background jobs/workflows/events
// Gemini	AI model that generates text/thinks