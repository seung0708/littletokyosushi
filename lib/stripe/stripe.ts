import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  appInfo: {
    name: "Little Tokyo Sushi",
    version: "0.1.0",
  },
});

export default stripe;