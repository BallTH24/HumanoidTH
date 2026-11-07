import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { submissionSchema } from "@/lib/validations/submission";
import { canonicalizeUrl } from "@/lib/url";
import { Prisma } from "../../../generated/prisma";

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);
    if (!json || typeof json !== "object") {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const validation = submissionSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          issues: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const { submissionType, title, url, notes, submitterName, submitterContact } = validation.data;
    const cleanUrl = url ? canonicalizeUrl(url) || null : null;

    // Optional user association
    let submittedById: string | null = null;
    if (submitterContact) {
      const user = await prisma.user.findUnique({
        where: { email: submitterContact }
      });
      if (user) {
        submittedById = user.id;
      }
    }

    const submission = await prisma.submittedData.create({
      data: {
        submissionType,
        title,
        url: cleanUrl,
        notes: notes || null,
        submitterName: submitterName || null,
        submitterContact: submitterContact || null,
        submittedById,
        status: "QUEUED",
        payloadJson: {
          submittedVia: "api",
          timestamp: new Date().toISOString()
        } as Prisma.InputJsonValue
      }
    });

    return NextResponse.json(
      {
        message: "Submission received and queued for review.",
        submission
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error." },
      { status: 500 }
    );
  }
}
