import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getRobotHRIProfile } from "@/lib/hri-evaluation";
import RobotDetailClient from "./RobotDetailClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  try {
    const robot = await prisma.robotModel.findFirst({
      where: {
        OR: [{ id: decodedId }, { canonicalName: decodedId }]
      },
      select: { canonicalName: true, description: true, developerOrg: true }
    });

    if (!robot) {
      return {
        title: "Robot Model Not Found | Thailand Humanoid Atlas"
      };
    }

    return {
      title: `${robot.canonicalName} | Robot Model Profile`,
      description:
        robot.description ||
        `Technical and Human-Robot Interaction specifications for ${robot.canonicalName} developed by ${robot.developerOrg || "Thailand Robotics"}.`
    };
  } catch {
    return {
      title: "Robot Model Profile | Thailand Humanoid Atlas"
    };
  }
}

export default async function RobotDetailPage({ params }: PageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "en") as "en" | "th";

  let robot = null;
  let dbOffline = false;

  try {
    robot = await prisma.robotModel.findFirst({
      where: {
        OR: [{ id: decodedId }, { canonicalName: decodedId }]
      },
      include: {
        contributions: {
          select: {
            id: true,
            title: true,
            contributionType: true,
            sourceUrl: true
          },
          take: 10
        },
        inventory: {
          select: {
            id: true,
            displayName: true,
            ownershipStatus: true
          },
          take: 10
        }
      }
    });
  } catch (error) {
    console.error("Database query error on robot detail page:", error);
    dbOffline = true;
  }

  if (dbOffline) {
    return (
      <div className="p-6 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200">
        <h2 className="text-lg font-bold mb-2">Database Connection Offline</h2>
        <p className="text-xs text-amber-300">
          Live robot records cannot be retrieved at this moment. Please verify the PostgreSQL service.
        </p>
      </div>
    );
  }

  if (!robot) {
    notFound();
  }

  const profile = getRobotHRIProfile(robot);

  return (
    <RobotDetailClient
      robot={robot}
      profile={profile}
      currentLang={lang}
    />
  );
}
