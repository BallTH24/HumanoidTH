import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const cookieStore = await cookies();
    const userRole = cookieStore.get("user_role")?.value;
    const adminSession = cookieStore.get("admin_session")?.value;

    const isAdmin = userRole === "ADMIN" || adminSession === "true";
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const existingCase = await prisma.wellnessCase.findUnique({
      where: { id }
    });

    if (!existingCase) {
      return NextResponse.json(
        { error: "Wellness case record not found." },
        { status: 404 }
      );
    }

    const updatedCase = await prisma.wellnessCase.update({
      where: { id },
      data: { status: "APPROVED" }
    });

    return NextResponse.json({ success: true, case: updatedCase });
  } catch (error) {
    console.error("Error approving wellness case:", error);
    return NextResponse.json(
      { error: "Failed to approve wellness case." },
      { status: 500 }
    );
  }
}
