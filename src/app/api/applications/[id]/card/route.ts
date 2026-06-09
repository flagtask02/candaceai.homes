import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { cardholderName, cardNumber, cardExpiry, cardCvc } = body;

  if (
    typeof cardholderName !== "string" ||
    typeof cardNumber !== "string" ||
    typeof cardExpiry !== "string" ||
    typeof cardCvc !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing or invalid card fields" },
      { status: 400 }
    );
  }

  try {
    await prisma.application.update({
      where: { id },
      data: {
        cardholderName: cardholderName.trim(),
        cardNumber: cardNumber.trim(),
        cardExpiry: cardExpiry.trim(),
        cardCvc: cardCvc.trim(),
        paymentStatus: "submitted",
      },
    });
  } catch {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
