import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await prisma.subscribers.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingSubscriber) {
      if (existingSubscriber.is_active) {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 409 }
        );
      } else {
        // Reactivate the subscription
        await prisma.subscribers.update({
          where: { id: existingSubscriber.id },
          data: { is_active: true },
        });

        return NextResponse.json(
          { message: "Subscription reactivated successfully" },
          { status: 200 }
        );
      }
    }

    // Create new subscription
    await prisma.subscribers.create({
      data: {
        email: email.toLowerCase().trim(),
        is_active: true,
      },
    });

    return NextResponse.json(
      { message: "Successfully subscribed to property alerts" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
