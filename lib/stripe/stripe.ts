import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia", // Update to the required version
  appInfo: {
    name: "Little Tokyo Sushi",
    version: "0.1.0",
  },
});