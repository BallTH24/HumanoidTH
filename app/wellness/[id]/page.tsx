import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import WellnessCaseDetailClient from "./WellnessCaseDetailClient";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const caseItem = await prisma.wellnessCase.findUnique({
    where: { id },
    include: { robot: true }
  });

  if (!caseItem) {
    return {
      title: "Case Study Not Found | Thailand Humanoid Atlas"
    };
  }

  return {
    title: `${caseItem.title} | Wellness Casebook`,
    description: `HRI clinical observation and field case study for ${caseItem.robot.canonicalName} in ${caseItem.scenarioContext} scenario.`
  };
}

export default async function WellnessCaseDetailPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "th") as "en" | "th";

  const caseItem = await prisma.wellnessCase.findUnique({
    where: { id },
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
    }
  });

  if (!caseItem) {
    notFound();
  }

  return <WellnessCaseDetailClient caseData={caseItem} currentLang={lang} />;
}
