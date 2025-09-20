import {Resend} from 'resend'
import { action } from './_generated/server'
import { v } from 'convex/values'


export const sendEmail = action({
    args:{
        to:v.string(),
        subject:v.string(),
        html:v.string(),
        text:v.optional(v.string()),
        apiKey:v.string()
    },

    handler:async(ctx,args)=>{
        const resend = new Resend(args.apiKey)

        try{
            const result = await resend.emails.send({
                from :"SettleUp <onboarding@resend.dev>",
                // to:args.to,
                to:"m2079b@gmail.com",
                subject:args.subject,
                html:args.html,
                text:args.text,
            }) 
            return {success:true,id:result.id}
        }
        catch(error){
            console.log("error:failed to send email:",error)
            return {success:false,error:error.message}
        }
    }
})