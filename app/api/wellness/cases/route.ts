import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { wellnessCaseSchema } from "@/lib/validations/wellness-case";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedStatus = searchParams.get("status");

    const statusFilter =
      requestedStatus === "ALL"
        ? undefined
        : requestedStatus === "PENDING"
          ? "PENDING"
          : requestedStatus === "REJECTED"
            ? "REJECTED"
            : "APPROVED";

    const cases = await prisma.wellnessCase.findMany({
      where: statusFilter ? { status: statusFilter } : undefined,
      include: {
        robot: {
          select: {
            id: true,
            canonicalName: true,
            robotType: true,
            manufacturer: true,
            developerOrg: true,
            thailandStatus: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ cases });
  } catch (error) {
    console.error("Error fetching wellness cases:", error);
    return NextResponse.json(
      { error: "Failed to retrieve wellness cases" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = wellnessCaseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.flatten()
        },
        { status: 400 }
      );
    }

    const {
      title,
      robotId,
      scenarioContext,
      activityDesc,
      stressScore,
      comfortScore,
      trustScore,
      usefulnessScore,
      caveats,
      evidenceUrl,
      submittedBy
    } = validation.data;

    // Verify robot exists
    const robot = await prisma.robotModel.findUnique({
      where: { id: robotId }
    });

    if (!robot) {
      return NextResponse.json(
        { error: "Selected robot model was not found" },
        { status: 404 }
      );
    }

    const newCase = await prisma.wellnessCase.create({
      data: {
        title,
        robotId,
        scenarioContext,
        activityDesc,
        stressScore,
        comfortScore,
        trustScore,
        usefulnessScore,
        caveats: caveats || null,
        evidenceUrl,
        submittedBy: submittedBy || null,
        status: "PENDING"
      }
    });

    return NextResponse.json(
      { success: true, id: newCase.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating wellness case:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while creating case" },
      { status: 500 }
    );
  }
}
