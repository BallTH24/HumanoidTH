import { PrismaClient } from "../generated/prisma";

export async function seedWellnessCases(prisma: PrismaClient) {
  console.log("Seeding verified Thai HRI wellness cases...");

  const dinsawMini = await prisma.robotModel.findFirst({
    where: { canonicalName: { contains: "Dinsaw Mini", mode: "insensitive" } }
  });

  const chulaRehab = await prisma.robotModel.findFirst({
    where: { canonicalName: { contains: "Chula Rehabilitation", mode: "insensitive" } }
  });

  const pinto = await prisma.robotModel.findFirst({
    where: { canonicalName: { contains: "Pinto", mode: "insensitive" } }
  });

  const bumi = await prisma.robotModel.findFirst({
    where: { canonicalName: { contains: "Bumi", mode: "insensitive" } }
  });

  if (!dinsawMini || !chulaRehab || !pinto) {
    console.warn("Required robot records not found in database. Skipping wellness cases seeding.");
    return;
  }

  const cases = [
    {
      title: "Dinsaw Mini in Elderly Home Care Routine Assistance",
      robotId: dinsawMini.id,
      scenarioContext: "Elderly Care",
      activityDesc:
        "Deployment of Dinsaw Mini tabletop companion robots in private residences and elderly day-care centers across Bangkok. The robot alerts elderly patients for scheduled medication times, leads mild seated brain-gym exercises, monitors cognitive patterns via facial emotion recognition, and provides one-touch video calls to family caregivers.",
      stressScore: 2,
      comfortScore: 5,
      trustScore: 5,
      usefulnessScore: 5,
      caveats:
        "Requires reliable Wi-Fi for video telepresence; voice recognition accuracy decreases in environments with ambient television noise or heavy Thai regional dialects.",
      evidenceUrl: "https://www.ctasiarobotics.com/dinsaw-mini-elderly-care",
      submittedBy: "Chulalongkorn University & CT Asia Robotics Clinical Study",
      status: "APPROVED" as const
    },
    {
      title: "Chula Rehab Robot in Upper-Limb Stroke Rehabilitation",
      robotId: chulaRehab.id,
      scenarioContext: "Physical Rehabilitation",
      activityDesc:
        "Clinical randomized controlled trials at King Chulalongkorn Memorial Hospital utilizing interactive bilateral robotic arm training devices. Post-stroke hemiparesis patients perform reaching tasks assisted by adaptive impedance force control, gamified with visual biofeedback on an interactive display to stimulate neuroplasticity.",
      stressScore: 3,
      comfortScore: 4,
      trustScore: 5,
      usefulnessScore: 5,
      caveats:
        "Requires initial physical therapist fitting and supervision; not indicated for acute spasticity patients with Ashworth scale > 3.",
      evidenceUrl: "https://chula.ac.th/en/news/stroke-rehabilitation-robot/",
      submittedBy: "Department of Rehabilitation Medicine, King Chulalongkorn Memorial Hospital",
      status: "APPROVED" as const
    },
    {
      title: "Pinto Robot in Quarantine & Hospital Bedside Interaction",
      robotId: pinto.id,
      scenarioContext: "Hospital Concierge",
      activityDesc:
        "Deployment of CU-RoboCOVID Pinto telepresence and remote payload delivery robots across 12 Thai public hospitals. The robot delivers prescription medication and nutritional trays directly to isolation ward bedsides while enabling two-way HD audiovisual rounds between attending physicians and quarantined patients, eliminating clinician exposure risk.",
      stressScore: 2,
      comfortScore: 4,
      trustScore: 5,
      usefulnessScore: 5,
      caveats:
        "Payload capacity limited to 15 kg; requires smooth hospital corridors or ramp access with elevation grade under 8 degrees.",
      evidenceUrl: "https://www.eng.chula.ac.th/en/pinto-robot-covid19-hospital-aid",
      submittedBy: "Faculty of Engineering, Chulalongkorn University (CU-RoboCOVID Team)",
      status: "APPROVED" as const
    },
    ...(bumi
      ? [
          {
            title: "Bumi Humanoid in Interactive Cognitive Therapy at EEC Robotics Center",
            robotId: bumi.id,
            scenarioContext: "Social/Education",
            activityDesc: "การทดสอบบทบาทผู้ช่วยฝึกบริหารสมองและสื่อสารเชิงบวกในกลุ่มทดสอบวัยเกษียณ",
            stressScore: 2,
            comfortScore: 4,
            trustScore: 4,
            usefulnessScore: 4,
            caveats: "การใช้งานต้องมีวิทยากรหรือผู้เชี่ยวชาญร่วมแนะนำการโต้ตอบในช่วงเริ่มต้น (Pilot Evaluation Phase)",
            evidenceUrl: "https://noetixrobotics.com/en/news/events/962",
            submittedBy: "EEC Automation Park & Robotics Demonstration Center",
            status: "PENDING" as const
          }
        ]
      : [])
  ];

  for (const c of cases) {
    const existing = await prisma.wellnessCase.findFirst({
      where: { title: c.title }
    });

    if (existing) {
      await prisma.wellnessCase.update({
        where: { id: existing.id },
        data: c
      });
      console.log(`Updated case: ${c.title}`);
    } else {
      await prisma.wellnessCase.create({
        data: c
      });
      console.log(`Created case: ${c.title}`);
    }
  }

  console.log("Seeding wellness cases completed successfully.");
}

if (process.argv[1]?.includes("seed-wellness-cases")) {
  const prisma = new PrismaClient();
  seedWellnessCases(prisma)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
