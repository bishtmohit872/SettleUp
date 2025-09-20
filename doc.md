# REMEMBER: Mentioning the Router for signIn and Signout to clerk which made with the help of clerk component in .env.local file

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Tools
convex db
inngest : schdule task automatically with timer (cronjov)
recharts : For graphs
shadcn ui

# challenges

1)after login user data is not storing in user schema
2)adding function(lib/inngest/functions) to inngest plaform 
3)data is not adding into database because in expenses database there is a field called category, i forgot to put the type inside v.optional() that is v.optional(v.string()) and also the arrangement of the column was mismatched in expenses table
4)inside create group i was not able show contacts in "add member" option because map callback function was enclosed with {} instead of this () bracket


5) convexClientProvider also a client side component that why after importing useConvexQuery file in createGroupModel without mentioning "use client" directive it still run but in dasahboard.jsx file it was producing error for "use client" directive  got it.

6) optimized the query with the help of hashmap( in inngest.js file) to prevent from unneccessary hit on db for getting userId
7) crobjob for reminding the user for their payments and sending them monthly insight about their expenditure by using "Inngest"

8) resend.com for sending the email

4:06:38