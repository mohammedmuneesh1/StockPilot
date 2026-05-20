


financial application typically use dark theme , because its easy for eyes and provide better contrasts for chart and data visualisation




//--------------------------------------------------------------------- shadcn ---------------------------------------------------------------------
shadcn-> npx shadcn@latest init
button -> npx shadcn@latest add button
//--------------------------------------------------------------------- shadcn ---------------------------------------------------------------------


//--------------------------------------------------------------------- RAFCE ---------------------------------------------------------------------
RAFCE
//--------------------------------------------------------------------- RAFCE ---------------------------------------------------------------------



//--------------------------------------------------------------------- (ROOT)  ---------------------------------------------------------------------





//--------------------------------------------------------------------- (ROOT)  ---------------------------------------------------------------------

Route Groups are a  folerr convention that let you organzie routes by category or team. 
(folderName)


//--------------------------------------------------------------------- (ROOT)  ---------------------------------------------------------------------


//------------------------------------------------------------ DROP DOWN MENU -> npx shadcn@latest add dropdown-menu
avatar



//------------------------------------------------------------ 
TRADING VIEW 
------------------------------------------------------------ 

TradingView -> for chart 

react hook form ---> npm install react-hook-form


react-select-country-list-> npm i react-select-country-list
npx shadcn@latest add input label select 





better auth for authentication 


--> Better Auth is a framework-agnostic, universal authentication and authorization framework for TypeScript. 


website: https://better-auth.com/docs/installation


npm install better-auth



step-2:SETUP THE AUTH ENV
-->generate the auth secret on website 
-->then set auth url on the env

step-3:FOLDER lib with better-auth 


auth.ts





inngest

Inngest is an event-driven durable execution platform that allows you to run fast, reliable code on any platform, without managing queues, infra, or state.



Write functions in TypeScript, Python or Go to power background and scheduled jobs, with steps built in. We handle the backend infra, queueing, scaling, concurrency, throttling, rate limiting, and observability for you.



step-1:npm install inngest
step-2:inngest dev


gemini ai setup 
GEMINI_API_KEY




inngest 

import { inngest } from "./client";

export const sendSignUpEmail = inngest.createFunction()

<!-- createFunction(config, handler) -->



async ({event,step}) => {}

is the ACTUAL event payload received.


event format 
{
  name: "app/user.created",
  data: {
    email: "john@gmail.com"
  }
}


            const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
            `


What is step

step is an Inngest helper for durable workflow steps.


await step.run("send-email", async () => {
   await sendEmail()
})


Because Inngest can:

retry failed steps
resume workflows
track execution
avoid rerunning completed steps

Very important in production systems.



Without step.run, if your function crashes halfway:

email may send twice
DB writes duplicate
chaos enters the chat

Humans call this "distributed systems."




f the step fail, how many times it re-run ?

Function retries: up to 4 attempts total


step.run() itself is durable.


await step.run('generate-ai-text', async () => {
   return await generateText()
})

await step.run('send-email', async () => {
   return await sendEmail()
})


Suppose:

AI generation succeeds ✅
email sending fails ❌


On retry:

generate-ai-text  -> NOT rerun
send-email        -> rerun only


await step.run('send-welcome-email', async () => {

will rerun IF:

sendWelcomeEmail() throws error
timeout occurs
network fails
provider fails


Retry 1 -> after few seconds
Retry 2 -> after longer
Retry 3 -> even longer



inngest.createFunction(
  {
    id: "send-email",
    retries: 2
  },
  ...
)


Meaning:

original run
+2 retries




latest add sonner





middleware 

we using better-auth


in next js middleware , ites recommended to onlyy check for the existend of a session cookie  to handle redirection,. to avoid blocking requests by making API or database calls. 

you case use the "getSessionCookie" helper from Better Auth for this purpose:



Next.js 16 replaces "middleware" with "proxy". You can use the Node.js runtime for full session validation with database checks:


