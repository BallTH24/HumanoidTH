import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding map contribution clusters into StatsCache...");

  const clusters = [
    {
      id: "cluster-chula-robotics",
      title: "Chulalongkorn University Robotics Lab",
      organization: "Chulalongkorn University (CU-RoboCOVID)",
      locationLabel: "Pathum Wan, Bangkok, Thailand",
      latitude: 13.7367,
      longitude: 100.5331,
      summary: "Pioneering medical service robotics including Pinto Robot, Mirror Telepresence System, Ninja Robot, and stroke rehabilitation exoskeletons.",
      contributorType: "University Research Lab",
      contributionCount: 4,
      detailsList: [
        "Pinto Robot - Medical delivery in infectious wards",
        "Mirror Telepresence System - Remote clinical consultations",
        "Ninja Robot - Doctor-patient video rounds",
        "Chula Rehabilitation Robots for Stroke Patients - Neuro-rehab arm guidance"
      ]
    },
    {
      id: "cluster-ct-asia-robotics",
      title: "CT Asia Robotics R&D Center",
      organization: "CT Asia Robotics Co., Ltd.",
      locationLabel: "Huai Khwang, Bangkok, Thailand",
      latitude: 13.782,
      longitude: 100.5732,
      summary: "Thailand's first commercial humanoid and eldercare robot manufacturer, creator of the Dinsaw and Dinsaw Mini series.",
      contributorType: "Private Industry / Maker",
      contributionCount: 2,
      detailsList: [
        "Dinsaw Robot - Commercial hospital and service companion",
        "Dinsaw Mini Home AI Assistance - Dementia and medication compliance monitoring"
      ]
    },
    {
      id: "cluster-chula-hospital",
      title: "King Chulalongkorn Memorial Hospital Division",
      organization: "King Chulalongkorn Memorial Hospital & Thai Red Cross",
      locationLabel: "Pathum Wan, Bangkok, Thailand",
      latitude: 13.7317,
      longitude: 100.535,
      summary: "Clinical field deployment center for hospital outpatient orientation and radioactive iodine therapy assistance.",
      contributorType: "Public Teaching Hospital",
      contributionCount: 2,
      detailsList: [
        "Mr SAM outpatient service robot - OPD triage and automated queue guidance",
        "Radioactive Iodine Therapy Medical Assistant Robot - Remote nuclear medicine patient checks"
      ]
    },
    {
      id: "cluster-vistec-brain",
      title: "VISTEC Bio-inspired Robotics Lab (BRAIN)",
      organization: "Vidyasirimedhi Institute of Science and Technology (VISTEC)",
      locationLabel: "Wangchan Valley, Rayong, Thailand",
      latitude: 12.915,
      longitude: 101.442,
      summary: "Cutting-edge research in rehabilitation robotics, assistive wearables, and AI-driven locomotion.",
      contributorType: "Research Institute",
      contributionCount: 2,
      detailsList: [
        "CORGI Healthcare and Physical Therapy Assistant Robot - Pediatric and geriatric therapy coaching",
        "Exoskeleton Wheelchair Robot - Lower-limb paraplegia mobility assistance"
      ]
    },
    {
      id: "cluster-noetix-thai",
      title: "Noetix Robotics Innovation Center",
      organization: "Noetix Robotics Thailand & Innovation Partners",
      locationLabel: "Siam, Bangkok, Thailand",
      latitude: 13.746,
      longitude: 100.534,
      summary: "Demonstration and research center for full bipedal humanoid robotics and conversational AI agents in Thailand.",
      contributorType: "Industry Partner",
      contributionCount: 2,
      detailsList: [
        "Bumi humanoid robot - Full-size bipedal walking humanoid showcase",
        "Kaitomm Robot - Companion conversational assistant for seniors"
      ]
    }
  ];

  await prisma.statsCache.upsert({
    where: { key: "map_contribution_clusters" },
    update: {
      valueJson: clusters as any,
      updatedAt: new Date()
    },
    create: {
      key: "map_contribution_clusters",
      valueJson: clusters as any
    }
  });

  console.log("Seeding complete. Cached 5 verified ecosystem clusters.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
