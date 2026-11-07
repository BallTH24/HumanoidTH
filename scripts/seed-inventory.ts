import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding organizations and owned inventory...");

  // 1. Seed Organizations
  const orgs = [
    {
      name: "Chulalongkorn University",
      entityType: "university",
      canonicalKey: "chulalongkorn-university",
      sourceMeta: { country: "Thailand", city: "Bangkok" }
    },
    {
      name: "CT Asia Robotics",
      entityType: "company",
      canonicalKey: "ct-asia-robotics",
      sourceMeta: { country: "Thailand", city: "Bangkok" }
    },
    {
      name: "King Chulalongkorn Memorial Hospital",
      entityType: "hospital",
      canonicalKey: "king-chulalongkorn-memorial-hospital",
      sourceMeta: { country: "Thailand", city: "Bangkok" }
    },
    {
      name: "VISTEC (Vidyasirimedhi Institute)",
      entityType: "university",
      canonicalKey: "vistec-robotics",
      sourceMeta: { country: "Thailand", city: "Rayong" }
    },
    {
      name: "CreativeLabTH",
      entityType: "project_team",
      canonicalKey: "creativelabth",
      sourceMeta: { country: "Thailand", city: "Bangkok" }
    }
  ];

  for (const org of orgs) {
    await prisma.entity.upsert({
      where: { canonicalKey: org.canonicalKey },
      update: { name: org.name, entityType: org.entityType, sourceMeta: org.sourceMeta },
      create: org
    });
  }

  // 2. Find robot models to link
  const nao = await prisma.robotModel.findFirst({ where: { canonicalName: "NAO" } });
  const dinsaw = await prisma.robotModel.findFirst({ where: { canonicalName: "Dinsaw Robot" } });
  const dinsawMini = await prisma.robotModel.findFirst({ where: { canonicalName: "Dinsaw Mini Home AI Assistance" } });
  const bumi = await prisma.robotModel.findFirst({ where: { canonicalName: "Bumi humanoid robot" } });

  // 3. Seed Owned Inventory
  const inventoryItems = [
    {
      robotModelId: nao?.id || null,
      displayName: "NAO H25 Academic Companion Unit",
      ownershipStatus: "active_testing",
      ownerOrg: "CreativeLabTH / Research Lab",
      custodian: "HRI Engineering Team",
      locationLabel: "Main Robotics Lab, Bangkok",
      serialNumber: "THA-NAO-2024-001",
      publicSerialSafe: true,
      conditionStatus: "operational",
      firmwareVersion: "NAOqi 2.8.5",
      visibility: "public",
      notes: "Allocated for social interaction and autism therapy evaluations."
    },
    {
      robotModelId: dinsawMini?.id || null,
      displayName: "Dinsaw Mini Eldercare Unit #04",
      ownershipStatus: "deployed_pilot",
      ownerOrg: "CT Asia Robotics & CreativeLabTH",
      custodian: "Geriatric Clinical Caregiver",
      locationLabel: "Senior Assisted Living Center, Nonthaburi",
      serialNumber: "DSW-MINI-TH-8921",
      publicSerialSafe: true,
      conditionStatus: "operational",
      firmwareVersion: "DinsawOS 3.4.1",
      visibility: "public",
      notes: "Continuous trial for automated medication prompts and bedside safety monitoring."
    },
    {
      robotModelId: bumi?.id || null,
      displayName: "Bumi Bipedal Humanoid Prototype Unit",
      ownershipStatus: "research_evaluation",
      ownerOrg: "CreativeLabTH",
      custodian: "Embodied AI Research Lead",
      locationLabel: "Robotics Motion Testing Arena, Bangkok",
      serialNumber: "BUMI-TH-EVAL-02",
      publicSerialSafe: false,
      conditionStatus: "maintenance_calibration",
      firmwareVersion: "ROS2 Humble / Ubuntu 22.04 LTS",
      visibility: "public",
      notes: "Undergoing bipedal gait trajectory calibration and zero-moment point tuning."
    },
    {
      robotModelId: dinsaw?.id || null,
      displayName: "Dinsaw Hospital Service Unit #02",
      ownershipStatus: "active_service",
      ownerOrg: "King Chulalongkorn Memorial Hospital",
      custodian: "OPD Nurse Administration",
      locationLabel: "Outpatient Building 3, Bangkok",
      serialNumber: "DSW-HOSP-2023-11",
      publicSerialSafe: true,
      conditionStatus: "operational",
      firmwareVersion: "DinsawMed 2.1",
      visibility: "public",
      notes: "Assisting with OPD triage, directional guidance, and patient queue announcements."
    }
  ];

  for (const item of inventoryItems) {
    const existing = await prisma.ownedInventory.findFirst({
      where: { displayName: item.displayName }
    });

    if (existing) {
      await prisma.ownedInventory.update({
        where: { id: existing.id },
        data: item
      });
    } else {
      await prisma.ownedInventory.create({
        data: item
      });
    }
  }

  const count = await prisma.ownedInventory.count();
  console.log(`Seeding complete. Total owned inventory in database: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
