const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { customer, delivery } = await req.json();
    console.log(customer, delivery)

    return NextResponse.json({ customer, delivery });
}