import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { paymentReminder } from "@/lib/inngest/paymentReminder";
import { spendingInsights } from "@/lib/inngest/spendingInsights";

// Create an API that serves zero functions
export const  { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    paymentReminder,
    spendingInsights,
  ],
  streaming: "force",
});
