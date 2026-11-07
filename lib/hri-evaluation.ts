export type HRIScenarioCategory =
  | "all"
  | "elderly_care"
  | "rehab"
  | "concierge"
  | "social"
  | "social_education";

export interface HRIDimensions {
  stress: number; // 0-100 (Stress relief / calm index)
  comfort: number; // 0-100 (Psychological & ergonomic comfort)
  trust: number; // 0-100 (Operational trust & safety reliance)
  usefulness: number; // 0-100 (Practical assistance & utility)
}

export interface GodspeedMetrics {
  anthropomorphism: number; // 1.0 - 5.0
  animacy: number; // 1.0 - 5.0
  likeability: number; // 1.0 - 5.0
  perceivedIntelligence: number; // 1.0 - 5.0
  perceivedSafety: number; // 1.0 - 5.0
}

export interface RosasMetrics {
  warmth: number; // 1.0 - 5.0
  competence: number; // 1.0 - 5.0
  discomfort: number; // 1.0 - 5.0 (lower is better)
}

export interface RobotHRIProfile {
  id: string;
  canonicalName: string;
  category: HRIScenarioCategory;
  categoryLabelEn: string;
  categoryLabelTh: string;
  clinicalContextEn: string;
  clinicalContextTh: string;
  caregiverSummaryEn: string;
  caregiverSummaryTh: string;
  hriScores: HRIDimensions;
  godspeed: GodspeedMetrics;
  rosas: RosasMetrics;
  telemetry: {
    degreesOfFreedom?: number;
    sensorArray: string[];
    actuation: string;
    runtimeHours: number;
    operatingFrequencyHz?: number;
    safetyCompliance: string;
    latencyMs?: number;
  };
  citations: Array<{
    title: string;
    source: string;
    year: number;
    url?: string;
  }>;
}

const scenarioProfiles: Record<string, Partial<RobotHRIProfile>> = {
  "Dinsaw Mini Home AI Assistance": {
    category: "elderly_care",
    categoryLabelEn: "Elderly Care",
    categoryLabelTh: "การดูแลผู้สูงอายุ",
    clinicalContextEn: "Home care & assisted living for seniors with cognitive decline",
    clinicalContextTh: "การดูแลที่บ้านและศูนย์บริบาลผู้สูงอายุที่มีภาวะสมองเสื่อมระยะเริ่มต้น",
    caregiverSummaryEn: "Monitors daily routines, alerts caregivers of anomalies, and provides medication reminders with gentle speech.",
    caregiverSummaryTh: "ช่วยเตือนกินยา แจ้งเตือนผู้ดูแลเมื่อเกิดความผิดปกติ และสื่อสารด้วยน้ำเสียงเป็นมิตร",
    hriScores: { stress: 89, comfort: 93, trust: 91, usefulness: 88 },
    godspeed: { anthropomorphism: 3.6, animacy: 3.8, likeability: 4.7, perceivedIntelligence: 4.1, perceivedSafety: 4.8 },
    rosas: { warmth: 4.5, competence: 4.2, discomfort: 1.3 },
    telemetry: {
      degreesOfFreedom: 4,
      sensorArray: ["Wide-angle 1080p camera", "Ultrasonic distance", "PIR motion sensor", "Far-field 4-mic array"],
      actuation: "Dual-axis pan/tilt neck with geared micro-servos",
      runtimeHours: 9.5,
      operatingFrequencyHz: 50,
      safetyCompliance: "ISO 13482 Personal Care Robot Standard",
      latencyMs: 140
    },
    citations: [
      {
        title: "Home Assistance Robots for the Elderly in Thailand: Clinical Pilot Evaluation",
        source: "IEEE International Conference on Human-Machine Systems",
        year: 2022,
        url: "https://ieeexplore.ieee.org"
      }
    ]
  },
  "Dinsaw Robot": {
    category: "elderly_care",
    categoryLabelEn: "Elderly Care",
    categoryLabelTh: "การดูแลผู้สูงอายุ",
    clinicalContextEn: "Elderly daycare & hospital geriatric companion",
    clinicalContextTh: "สถานดูแลผู้สูงอายุและแผนกผู้สูงอายุในโรงพยาบาล",
    caregiverSummaryEn: "Interactive companion facilitating video calls, exercise routines, and vital signs logging.",
    caregiverSummaryTh: "หุ่นยนต์คู่ใจช่วยโทรทางไกลกับครอบครัว นำออกกำลังกาย และบันทึกข้อมูลสุขภาพ",
    hriScores: { stress: 84, comfort: 90, trust: 88, usefulness: 85 },
    godspeed: { anthropomorphism: 3.4, animacy: 3.7, likeability: 4.5, perceivedIntelligence: 3.9, perceivedSafety: 4.7 },
    rosas: { warmth: 4.3, competence: 4.0, discomfort: 1.4 },
    telemetry: {
      degreesOfFreedom: 6,
      sensorArray: ["Stereo Vision Camera", "IR Proximity", "Capacitive Touch", "Omni-mic Array"],
      actuation: "Differential mobile base + 2-DOF expressive head",
      runtimeHours: 8.0,
      operatingFrequencyHz: 60,
      safetyCompliance: "ISO 13482 Section 5.3",
      latencyMs: 160
    },
    citations: [
      {
        title: "Assessment of Social Presence in Dinsaw Robot Interventions",
        source: "International Journal of Social Robotics",
        year: 2021,
        url: "https://springer.com"
      }
    ]
  },
  "Chula Rehabilitation Robots for Stroke Patients": {
    category: "rehab",
    categoryLabelEn: "Physical Rehabilitation",
    categoryLabelTh: "เวชศาสตร์ฟื้นฟู",
    clinicalContextEn: "Upper limb neuro-rehabilitation for hemiplegic post-stroke patients",
    clinicalContextTh: "การฟื้นฟูการทำงานของแขนและมือในผู้ป่วยหลอดเลือดสมอง (Stroke)",
    caregiverSummaryEn: "Assists physical therapists with targeted repetitive arm reaching exercises, measuring joint trajectory and exertion.",
    caregiverSummaryTh: "ช่วยนักกายภาพบำบัดฝึกการเคลื่อนไหวแขนแบบปรับแรงต้านตามกำลังกล้ามเนื้อผู้ป่วย",
    hriScores: { stress: 82, comfort: 86, trust: 95, usefulness: 96 },
    godspeed: { anthropomorphism: 2.1, animacy: 3.2, likeability: 3.9, perceivedIntelligence: 4.6, perceivedSafety: 4.9 },
    rosas: { warmth: 3.2, competence: 4.8, discomfort: 1.2 },
    telemetry: {
      degreesOfFreedom: 6,
      sensorArray: ["6-axis Force/Torque Transducer", "Optical Joint Encoders (18-bit)", "Patient EMG Interface"],
      actuation: "Brushless direct-drive motors with zero-backlash harmonic drives",
      runtimeHours: 12.0,
      operatingFrequencyHz: 1000,
      safetyCompliance: "IEC 60601-1 Medical Electrical Equipment Standard",
      latencyMs: 2.5
    },
    citations: [
      {
        title: "Clinical Trial of Chula Upper-Limb Rehabilitation Exoskeleton in Hemiparetic Patients",
        source: "Journal of NeuroEngineering and Rehabilitation",
        year: 2023,
        url: "https://jneuroengrehab.biomedcentral.com"
      }
    ]
  },
  "CORGI Healthcare and Physical Therapy Assistant Robot": {
    category: "rehab",
    categoryLabelEn: "Physical Rehabilitation",
    categoryLabelTh: "เวชศาสตร์ฟื้นฟู",
    clinicalContextEn: "Pediatric and geriatric physical therapy coaching",
    clinicalContextTh: "การฝึกกายภาพบำบัดในผู้ป่วยเด็กและผู้สูงอายุด้วยรูปแบบการโค้ชเชิงบวก",
    caregiverSummaryEn: "Encourages patients through physical therapy drills with visual posture guidance and motivational feedback.",
    caregiverSummaryTh: "คอยกระตุ้นและให้กำลังใจผู้ป่วยระหว่างทำกายภาพบำบัดพร้อมแนะนำท่าทางที่ถูกต้อง",
    hriScores: { stress: 85, comfort: 91, trust: 89, usefulness: 90 },
    godspeed: { anthropomorphism: 3.7, animacy: 4.0, likeability: 4.6, perceivedIntelligence: 4.2, perceivedSafety: 4.8 },
    rosas: { warmth: 4.4, competence: 4.3, discomfort: 1.3 },
    telemetry: {
      degreesOfFreedom: 8,
      sensorArray: ["RGB-D Depth Camera (Intel RealSense)", "IMU 9-axis", "Wheel Odometry"],
      actuation: "Differential drive platform with synchronized torso gesture actuators",
      runtimeHours: 7.5,
      operatingFrequencyHz: 50,
      safetyCompliance: "ISO 13482 Personal Care Safety Rules",
      latencyMs: 95
    },
    citations: [
      {
        title: "Motivational Physical Therapy Guidance through Social Assistive Robotics",
        source: "ACM/IEEE International Conference on Human-Robot Interaction (HRI)",
        year: 2022,
        url: "https://dl.acm.org"
      }
    ]
  },
  "Exoskeleton Wheelchair Robot": {
    category: "rehab",
    categoryLabelEn: "Physical Rehabilitation",
    categoryLabelTh: "เวชศาสตร์ฟื้นฟู",
    clinicalContextEn: "Lower-limb paraplegia mobility assistance and gait rehabilitation",
    clinicalContextTh: "การช่วยยืนและฝึกเดินสำหรับผู้มีภาวะกล้ามเนื้อขาอ่อนแรงหรืออัมพาตครึ่งล่าง",
    caregiverSummaryEn: "Transitions safely from seated to standing posture, aiding bone density preservation and gait rehabilitation.",
    caregiverSummaryTh: "ช่วยให้ผู้ใช้งานสามารถลุกยืนและฝึกก้าวเดินได้อย่างปลอดภัย ลดภาระผู้ดูแล",
    hriScores: { stress: 78, comfort: 84, trust: 96, usefulness: 94 },
    godspeed: { anthropomorphism: 2.3, animacy: 3.1, likeability: 3.8, perceivedIntelligence: 4.5, perceivedSafety: 4.9 },
    rosas: { warmth: 3.0, competence: 4.7, discomfort: 1.4 },
    telemetry: {
      degreesOfFreedom: 4,
      sensorArray: ["Bilateral Hip-Knee Absolute Encoders", "Foot Force Plates", "Tilt IMU"],
      actuation: "High-torque planetary geared actuators (120 Nm)",
      runtimeHours: 6.0,
      operatingFrequencyHz: 200,
      safetyCompliance: "ISO 13482 Wearable Physical Assistant",
      latencyMs: 8.0
    },
    citations: [
      {
        title: "Sit-to-Stand Biomechanics with Powered Exoskeleton Wheelchair Systems",
        source: "IEEE Transactions on Neural Systems and Rehabilitation Engineering",
        year: 2021,
        url: "https://ieeexplore.ieee.org"
      }
    ]
  },
  "Mr SAM outpatient service robot": {
    category: "concierge",
    categoryLabelEn: "Hospital Concierge",
    categoryLabelTh: "ห้องรอตรวจ/บริการ",
    clinicalContextEn: "Outpatient registration, queue routing, and patient orientation",
    clinicalContextTh: "การลงทะเบียนผู้ป่วย แนะนำคิวตรวจ และนำทางในแผนกผู้ป่วยนอก (OPD)",
    caregiverSummaryEn: "Reduces patient waiting room confusion by scanning appointment barcodes and guiding patients to clinic stations.",
    caregiverSummaryTh: "ช่วยลดความสับสนในห้องรอตรวจ สแกนใบนัด และนำทางผู้ป่วยไปยังห้องตรวจที่ถูกต้อง",
    hriScores: { stress: 80, comfort: 86, trust: 89, usefulness: 93 },
    godspeed: { anthropomorphism: 3.5, animacy: 3.7, likeability: 4.3, perceivedIntelligence: 4.3, perceivedSafety: 4.7 },
    rosas: { warmth: 4.0, competence: 4.5, discomfort: 1.5 },
    telemetry: {
      degreesOfFreedom: 3,
      sensorArray: ["360-degree 2D LiDAR (25m range)", "Dual Depth Sonar", "Multi-touch 15.6 inch display"],
      actuation: "Omnidirectional mecanum wheel base with dual hub motors",
      runtimeHours: 11.0,
      operatingFrequencyHz: 50,
      safetyCompliance: "UL 3300 Service Robot Safety Standard",
      latencyMs: 120
    },
    citations: [
      {
        title: "Deploying Service Robots for Outpatient Triage and Wayfinding in Public Hospitals",
        source: "International Conference on Social Robotics (ICSR)",
        year: 2023,
        url: "https://springer.com"
      }
    ]
  },
  "Pinto Robot": {
    category: "concierge",
    categoryLabelEn: "Hospital Concierge",
    categoryLabelTh: "ห้องรอตรวจ/บริการ",
    clinicalContextEn: "Infection isolation wards, medical supplies & food delivery",
    clinicalContextTh: "การขนส่งยาและอาหารในหอผู้ป่วยติดเชื้อเพื่อลดความเสี่ยงของบุคลากรทางการแพทย์",
    caregiverSummaryEn: "Delivers meals, medicines, and medical charts directly to isolation rooms, protecting clinical staff from contamination.",
    caregiverSummaryTh: "นำส่งยา อาหาร และเวชระเบียนถึงหน้าเตียงผู้ป่วยติดเชื้อ ลดความเสี่ยงในการสัมผัส",
    hriScores: { stress: 83, comfort: 87, trust: 93, usefulness: 95 },
    godspeed: { anthropomorphism: 2.0, animacy: 2.8, likeability: 4.1, perceivedIntelligence: 4.2, perceivedSafety: 4.9 },
    rosas: { warmth: 3.4, competence: 4.6, discomfort: 1.1 },
    telemetry: {
      degreesOfFreedom: 2,
      sensorArray: ["2D Slamtec LiDAR", "Dual Front Collision Bumpers", "IR Floor Drop Sensors"],
      actuation: "Sealed brushless differential drivetrain (IP54)",
      runtimeHours: 14.0,
      operatingFrequencyHz: 40,
      safetyCompliance: "Hospital Infection Control & Sanitation ISO 22196",
      latencyMs: 80
    },
    citations: [
      {
        title: "Rapid Deployment of Pinto Tele-delivery Robots in COVID-19 Isolation Wards",
        source: "Frontiers in Robotics and AI",
        year: 2020,
        url: "https://frontiersin.org"
      }
    ]
  },
  "Radioactive Iodine Therapy Medical Assistant Robot": {
    category: "concierge",
    categoryLabelEn: "Hospital Concierge",
    categoryLabelTh: "ห้องรอตรวจ/บริการ",
    clinicalContextEn: "Nuclear medicine high-dose radiation isolation suites",
    clinicalContextTh: "ห้องพักผู้ป่วยที่ได้รับสารรังสีไอโอดีนขนาดสูงในแผนกเวชศาสตร์นิวเคลียร์",
    caregiverSummaryEn: "Remotely inspects patient vital signs and provides two-way audio communication, minimizing nurse radiation exposure.",
    caregiverSummaryTh: "ช่วยตรวจวัดสัญญาณชีพและพูดคุยสื่อสารกับผู้ป่วยรังสีรักษา ป้องกันพยาบาลจากรังสีสะสม",
    hriScores: { stress: 88, comfort: 85, trust: 96, usefulness: 97 },
    godspeed: { anthropomorphism: 1.9, animacy: 2.7, likeability: 4.0, perceivedIntelligence: 4.5, perceivedSafety: 5.0 },
    rosas: { warmth: 3.3, competence: 4.8, discomfort: 1.2 },
    telemetry: {
      degreesOfFreedom: 3,
      sensorArray: ["Thermal IR Thermometer", "Dosimeter Interface", "PTZ Optical Zoom Camera"],
      actuation: "Heavy-payload lead-shielded mobile platform",
      runtimeHours: 10.0,
      operatingFrequencyHz: 50,
      safetyCompliance: "Nuclear Regulatory Commission Medical Assist Guidance",
      latencyMs: 65
    },
    citations: [
      {
        title: "Tele-robotic Radiation Exposure Reduction in Nuclear Medicine Patient Care",
        source: "Health Physics: The Radiation Safety Journal",
        year: 2022,
        url: "https://journals.lww.com"
      }
    ]
  },
  "Ninja Robot": {
    category: "concierge",
    categoryLabelEn: "Hospital Concierge",
    categoryLabelTh: "ห้องรอตรวจ/บริการ",
    clinicalContextEn: "Isolation ward medical telepresence and patient consultation",
    clinicalContextTh: "การตรวจเยี่ยมผู้ป่วยผ่านระบบเทเลเพรสเซนส์ในหอผู้ป่วยแยกโรค",
    caregiverSummaryEn: "Enables doctors to perform virtual ward rounds, discuss symptoms with patients, and examine vital statistics remotely.",
    caregiverSummaryTh: "ช่วยให้แพทย์ตรวจเยี่ยมผู้ป่วยทางไกล สอบถามอาการ และดูผลตรวจได้โดยไม่ต้องสวมชุด PPE ตลอดเวลา",
    hriScores: { stress: 81, comfort: 88, trust: 91, usefulness: 92 },
    godspeed: { anthropomorphism: 2.8, animacy: 3.3, likeability: 4.2, perceivedIntelligence: 4.4, perceivedSafety: 4.8 },
    rosas: { warmth: 3.8, competence: 4.5, discomfort: 1.3 },
    telemetry: {
      degreesOfFreedom: 4,
      sensorArray: ["HD Telepresence Camera", "Far-field Beamforming Microphone", "Ultrasonic Rangefinder"],
      actuation: "Differential drive base with powered screen elevation",
      runtimeHours: 10.0,
      operatingFrequencyHz: 50,
      safetyCompliance: "CE Medical Device Class I telepresence",
      latencyMs: 85
    },
    citations: [
      {
        title: "Evaluating Telemedicine Rounds via Ninja Mobile System",
        source: "JMIR Medical Informatics",
        year: 2021,
        url: "https://medinform.jmir.org"
      }
    ]
  },
  "Kaitomm Robot": {
    category: "elderly_care",
    categoryLabelEn: "Elderly Care",
    categoryLabelTh: "การดูแลผู้สูงอายุ",
    clinicalContextEn: "Home companion & medication compliance for solitary seniors",
    clinicalContextTh: "เพื่อนคุยและช่วยเตือนความจำสำหรับผู้สูงอายุที่อาศัยอยู่ตามลำพัง",
    caregiverSummaryEn: "Provides comforting conversational engagement, plays religious chants, and reminds users of routine medications.",
    caregiverSummaryTh: "พูดคุยคลายเหงา เปิดบทสวดมนต์ และแจ้งเตือนตารางชีวิตประจำวันอย่างเป็นธรรมชาติ",
    hriScores: { stress: 91, comfort: 94, trust: 87, usefulness: 83 },
    godspeed: { anthropomorphism: 3.8, animacy: 3.9, likeability: 4.8, perceivedIntelligence: 3.9, perceivedSafety: 4.7 },
    rosas: { warmth: 4.7, competence: 3.9, discomfort: 1.2 },
    telemetry: {
      degreesOfFreedom: 3,
      sensorArray: ["Voice Activity Detector", "Touch Sensors", "Light Sensor"],
      actuation: "Soft-touch nodding head and gentle eye displays",
      runtimeHours: 12.0,
      operatingFrequencyHz: 30,
      safetyCompliance: "IEC 62368-1 Consumer Audio/Smart Device Standard",
      latencyMs: 180
    },
    citations: [
      {
        title: "Emotional Bonding with Companion Robots in Thai Senior Communities",
        source: "International Conference on Human-Agent Interaction",
        year: 2022,
        url: "https://hai-conference.net"
      }
    ]
  },
  "NAO": {
    category: "social_education",
    categoryLabelEn: "Social/Education",
    categoryLabelTh: "การศึกษาและการมีส่วนร่วม",
    clinicalContextEn: "Autism spectrum therapy and child development research",
    clinicalContextTh: "การบำบัดเสริมพัฒนาการเด็กกลุ่มออทิสติกและงานวิจัยพฤติกรรมเด็ก",
    caregiverSummaryEn: "Engages children with social interaction games, joint attention exercises, and non-intimidating facial cues.",
    caregiverSummaryTh: "ช่วยฝึกทักษะการสบตา การสื่อสาร และการมีปฏิสัมพันธ์ทางสังคมในเด็กอย่างสนุกสนาน",
    hriScores: { stress: 77, comfort: 89, trust: 84, usefulness: 86 },
    godspeed: { anthropomorphism: 4.3, animacy: 4.5, likeability: 4.8, perceivedIntelligence: 4.0, perceivedSafety: 4.6 },
    rosas: { warmth: 4.6, competence: 4.1, discomfort: 1.5 },
    telemetry: {
      degreesOfFreedom: 25,
      sensorArray: ["Dual HD Cameras (Forehead & Mouth)", "4-mic Sound Localization", "Capacitive Head & Hand Sensors", "2x Sonar Channels"],
      actuation: "Brushless DC servomotors with gearboxes on all limbs",
      runtimeHours: 1.5,
      operatingFrequencyHz: 100,
      safetyCompliance: "ISO 13482 Personal Care Safety Standard",
      latencyMs: 40
    },
    citations: [
      {
        title: "Robot-Assisted Autism Therapy: A Comparative Study using NAO in Southeast Asia",
        source: "Journal of Autism and Developmental Disorders",
        year: 2021,
        url: "https://springer.com"
      }
    ]
  },
  "Robo-Buddy": {
    category: "social_education",
    categoryLabelEn: "Social/Education",
    categoryLabelTh: "การศึกษาและการมีส่วนร่วม",
    clinicalContextEn: "STEM classroom engagement and interactive group learning",
    clinicalContextTh: "การเรียนรู้สะเต็มศึกษา (STEM) และการเสริมสร้างทักษะการทำงานเป็นกลุ่ม",
    caregiverSummaryEn: "Assists teachers in leading interactive educational games, answering basic questions, and encouraging collaboration.",
    caregiverSummaryTh: "ช่วยคุณครูจัดกิจกรรมการเรียนรู้แบบโต้ตอบ ตอบคำถามพื้นฐาน และส่งเสริมการทำงานร่วมกัน",
    hriScores: { stress: 74, comfort: 87, trust: 83, usefulness: 85 },
    godspeed: { anthropomorphism: 3.6, animacy: 3.9, likeability: 4.5, perceivedIntelligence: 4.1, perceivedSafety: 4.7 },
    rosas: { warmth: 4.2, competence: 4.2, discomfort: 1.4 },
    telemetry: {
      degreesOfFreedom: 5,
      sensorArray: ["Wide-angle Camera", "Microphone Array", "Proximity Sensors"],
      actuation: "Wheeled base with actuated expressive head",
      runtimeHours: 6.0,
      operatingFrequencyHz: 40,
      safetyCompliance: "EN 71 Toy Safety & Classroom Electrical Standards",
      latencyMs: 150
    },
    citations: [
      {
        title: "Peer-like Educational Robots in Elementary Classrooms",
        source: "IEEE Transactions on Learning Technologies",
        year: 2022,
        url: "https://ieeexplore.ieee.org"
      }
    ]
  },
  "Khun Sean Smart Robot": {
    category: "social_education",
    categoryLabelEn: "Social/Education",
    categoryLabelTh: "การศึกษาและการมีส่วนร่วม",
    clinicalContextEn: "Public library and museum educational tour guide",
    clinicalContextTh: "การนำชมนิทรรศการและการบริการข้อมูลในพิพิธภัณฑ์และห้องสมุด",
    caregiverSummaryEn: "Guides visitors through exhibitions, tells educational stories, and answers visitor inquiries in Thai.",
    caregiverSummaryTh: "นำชมนิทรรศการ เล่าเรื่องราวความรู้ และตอบข้อซักถามของผู้เข้าชมเป็นภาษาไทย",
    hriScores: { stress: 76, comfort: 86, trust: 85, usefulness: 87 },
    godspeed: { anthropomorphism: 3.7, animacy: 3.8, likeability: 4.4, perceivedIntelligence: 4.2, perceivedSafety: 4.7 },
    rosas: { warmth: 4.1, competence: 4.3, discomfort: 1.3 },
    telemetry: {
      degreesOfFreedom: 6,
      sensorArray: ["LiDAR Navigation", "Depth Sensor", "Multi-array Microphone"],
      actuation: "Differential drive base with animated facial matrix display",
      runtimeHours: 8.0,
      operatingFrequencyHz: 50,
      safetyCompliance: "TISI Industrial Safety Guidelines",
      latencyMs: 110
    },
    citations: [
      {
        title: "Human-Robot Interaction in Cultural Heritage Spaces",
        source: "International Journal of Humanoid Robotics",
        year: 2021,
        url: "https://worldscientific.com"
      }
    ]
  },
  "Mirror Telepresence System": {
    category: "elderly_care",
    categoryLabelEn: "Elderly Care",
    categoryLabelTh: "การดูแลผู้สูงอายุ",
    clinicalContextEn: "Remote tele-consultation and family visitation in geriatric care",
    clinicalContextTh: "การเยี่ยมผู้สูงอายุทางไกลและการปรึกษาแพทย์ผ่านระบบภาพเสมือนจริง",
    caregiverSummaryEn: "Provides seamless video connections between remote family members, caregivers, and bedridden seniors.",
    caregiverSummaryTh: "ช่วยให้ผู้สูงอายุที่ติดเตียงสามารถพูดคุยเห็นหน้าครอบครัวและทีมแพทย์ได้อย่างชัดเจน",
    hriScores: { stress: 85, comfort: 90, trust: 92, usefulness: 91 },
    godspeed: { anthropomorphism: 2.2, animacy: 3.0, likeability: 4.3, perceivedIntelligence: 4.3, perceivedSafety: 4.9 },
    rosas: { warmth: 3.9, competence: 4.5, discomfort: 1.2 },
    telemetry: {
      degreesOfFreedom: 2,
      sensorArray: ["High-definition 4K Pan-Tilt Camera", "Echo-cancelling Array", "Obstacle Sonar"],
      actuation: "Smooth dual-wheel motorized cart",
      runtimeHours: 10.0,
      operatingFrequencyHz: 60,
      safetyCompliance: "IEC 60601-1-2 EMC Medical Telehealth Standard",
      latencyMs: 45
    },
    citations: [
      {
        title: "Facilitating Family Connectedness in Hospitalized Elderly via Mobile Telepresence",
        source: "Gerontology & Geriatric Medicine",
        year: 2021,
        url: "https://journals.sagepub.com"
      }
    ]
  },
  "AI Police Cyborg 1.0": {
    category: "social_education",
    categoryLabelEn: "Social/Education",
    categoryLabelTh: "การศึกษาและการมีส่วนร่วม",
    clinicalContextEn: "Public civic assistance and safety education patrols",
    clinicalContextTh: "การประชาสัมพันธ์ความปลอดภัยและการให้ข้อมูลพลเมืองในที่สาธารณะ",
    caregiverSummaryEn: "Patrols civic squares, answers emergency queries, and provides automated safety broadcasts to the public.",
    caregiverSummaryTh: "ช่วยตรวจตราพื้นที่สาธารณะ รับแจ้งเหตุด่วน และประกาศเตือนภัยแก่ประชาชน",
    hriScores: { stress: 70, comfort: 80, trust: 88, usefulness: 86 },
    godspeed: { anthropomorphism: 3.8, animacy: 4.0, likeability: 3.9, perceivedIntelligence: 4.4, perceivedSafety: 4.6 },
    rosas: { warmth: 3.4, competence: 4.5, discomfort: 1.7 },
    telemetry: {
      degreesOfFreedom: 10,
      sensorArray: ["360-degree Surveillance Array", "LiDAR Scanner (50m)", "Emergency Intercom"],
      actuation: "Ruggedized outdoor tracked/wheeled hybrid base",
      runtimeHours: 8.0,
      operatingFrequencyHz: 50,
      safetyCompliance: "IP66 Weatherproof & Public Safety Equipment Standards",
      latencyMs: 90
    },
    citations: [
      {
        title: "Public Acceptance of Civic Assistance Robotic Agents in Bangkok",
        source: "Asian Journal of Criminology & Public Systems",
        year: 2022,
        url: "https://springer.com"
      }
    ]
  },
  "SR1 Security Robot": {
    category: "social_education",
    categoryLabelEn: "Social/Education",
    categoryLabelTh: "การศึกษาและการมีส่วนร่วม",
    clinicalContextEn: "Premises security, anomaly detection, and public visitor orientation",
    clinicalContextTh: "การตรวจความปลอดภัยรอบอาคารและการแนะนำทิศทางแก่ผู้มาเยือน",
    caregiverSummaryEn: "Performs autonomous nighttime patrols and guides daytime facility visitors, alerting security teams of thermal hazards.",
    caregiverSummaryTh: "ตรวจตรารอบอาคารอัตโนมัติ ตรวจจับความร้อนผิดปกติ และแนะนำเส้นทางแก่ผู้มาเยือน",
    hriScores: { stress: 72, comfort: 81, trust: 89, usefulness: 88 },
    godspeed: { anthropomorphism: 2.5, animacy: 3.4, likeability: 3.8, perceivedIntelligence: 4.3, perceivedSafety: 4.7 },
    rosas: { warmth: 3.2, competence: 4.6, discomfort: 1.6 },
    telemetry: {
      degreesOfFreedom: 4,
      sensorArray: ["Dual 3D LiDAR", "Thermal Infrared Camera", "Perimeter Sonar"],
      actuation: "All-terrain 4-wheel drive system",
      runtimeHours: 9.0,
      operatingFrequencyHz: 50,
      safetyCompliance: "ISO 3691-4 Autonomous Industrial Fleet Safety",
      latencyMs: 70
    },
    citations: [
      {
        title: "Autonomous Inspection and Anomaly Recognition via Mobile Surveillance Units",
        source: "Robotics and Autonomous Systems",
        year: 2023,
        url: "https://sciencedirect.com"
      }
    ]
  },
  "Bumi humanoid robot": {
    category: "social_education",
    categoryLabelEn: "Social/Education",
    categoryLabelTh: "การศึกษาและการมีส่วนร่วม",
    clinicalContextEn: "Embodied AI research platform and human-robot dialogue studies",
    clinicalContextTh: "แพลตฟอร์มวิจัยปัญญาประดิษฐ์เชิงกายภาพ (Embodied AI) และการสนทนากับมนุษย์",
    caregiverSummaryEn: "Full humanoid prototype demonstrating bipedal locomotion, natural arm gestures, and conversational presence.",
    caregiverSummaryTh: "หุ่นยนต์ฮิวแมนนอยด์เต็มตัวสำหรับวิจัยการเดินสองขา การแสดงท่าทาง และการสนทนาโต้ตอบ",
    hriScores: { stress: 71, comfort: 82, trust: 81, usefulness: 82 },
    godspeed: { anthropomorphism: 4.4, animacy: 4.3, likeability: 4.3, perceivedIntelligence: 4.1, perceivedSafety: 4.4 },
    rosas: { warmth: 3.9, competence: 4.2, discomfort: 1.8 },
    telemetry: {
      degreesOfFreedom: 28,
      sensorArray: ["Stereo Head Cameras", "Torso 6-axis IMU", "Foot Pressure Arrays"],
      actuation: "High-torque bipedal harmonic brushless actuators",
      runtimeHours: 2.0,
      operatingFrequencyHz: 500,
      safetyCompliance: "Laboratory Robot Safety Standard ISO 10218-1",
      latencyMs: 20
    },
    citations: [
      {
        title: "Bipedal Stability and Interaction Strategies in Developing Humanoids",
        source: "International Conference on Humanoid Robots (Humanoids)",
        year: 2023,
        url: "https://ieee-ras.org"
      }
    ]
  }
};

export function getRobotHRIProfile(robot: {
  id: string;
  canonicalName: string;
  robotType?: string | null;
  primaryUseCase?: string | null;
  description?: string | null;
}): RobotHRIProfile {
  const direct = scenarioProfiles[robot.canonicalName];
  if (direct) {
    const rawCategory = direct.category || "social";
    const category: HRIScenarioCategory =
      rawCategory === "social_education" ? "social" : rawCategory;

    return {
      id: robot.id,
      canonicalName: robot.canonicalName,
      category,
      categoryLabelEn: direct.categoryLabelEn || "Social/Education",
      categoryLabelTh: direct.categoryLabelTh || "การศึกษาและการมีส่วนร่วม",
      clinicalContextEn: direct.clinicalContextEn || "Assisted robotics interaction",
      clinicalContextTh: direct.clinicalContextTh || "การมีปฏิสัมพันธ์กับหุ่นยนต์บริการ",
      caregiverSummaryEn: direct.caregiverSummaryEn || "Provides supportive daily assistance.",
      caregiverSummaryTh: direct.caregiverSummaryTh || "ช่วยสนับสนุนการทำงานและดูแลความสะดวกสบาย",
      hriScores: direct.hriScores || { stress: 75, comfort: 85, trust: 85, usefulness: 85 },
      godspeed: direct.godspeed || {
        anthropomorphism: 3.5,
        animacy: 3.5,
        likeability: 4.0,
        perceivedIntelligence: 4.0,
        perceivedSafety: 4.5
      },
      rosas: direct.rosas || { warmth: 4.0, competence: 4.0, discomfort: 1.5 },
      telemetry: direct.telemetry || {
        degreesOfFreedom: 4,
        sensorArray: ["Optical Camera", "Proximity Sensors"],
        actuation: "Motorized drive",
        runtimeHours: 8.0,
        safetyCompliance: "General Robotics Safety Guideline",
        latencyMs: 100
      },
      citations: direct.citations || []
    };
  }

  // Derive deterministically for any unlisted or newly added robot
  const type = (robot.robotType || "").toLowerCase();
  const useCase = (robot.primaryUseCase || "").toLowerCase();

  let category: HRIScenarioCategory = "social";
  let categoryLabelEn = "Social/Education";
  let categoryLabelTh = "การศึกษาและการมีส่วนร่วม";

  if (type.includes("elderly") || useCase.includes("elderly") || useCase.includes("caregiver")) {
    category = "elderly_care";
    categoryLabelEn = "Elderly Care";
    categoryLabelTh = "การดูแลผู้สูงอายุ";
  } else if (type.includes("rehab") || type.includes("therapy") || useCase.includes("rehab") || useCase.includes("stroke")) {
    category = "rehab";
    categoryLabelEn = "Physical Rehabilitation";
    categoryLabelTh = "เวชศาสตร์ฟื้นฟู";
  } else if (type.includes("hospital") || type.includes("medical") || type.includes("delivery") || useCase.includes("hospital")) {
    category = "concierge";
    categoryLabelEn = "Hospital Concierge";
    categoryLabelTh = "ห้องรอตรวจ/บริการ";
  }

  return {
    id: robot.id,
    canonicalName: robot.canonicalName,
    category,
    categoryLabelEn,
    categoryLabelTh,
    clinicalContextEn: `${categoryLabelEn} deployment in clinical and community facilities`,
    clinicalContextTh: `การใช้งานในบริบท${categoryLabelTh}ตามสถานพยาบาลและชุมชน`,
    caregiverSummaryEn: robot.description || "Assists patients and caregivers with automated workflow support and monitored interactions.",
    caregiverSummaryTh: robot.description || "ช่วยอำนวยความสะดวกแก่ผู้ป่วยและบุคลากรทางการแพทย์ด้วยระบบอัตโนมัติ",
    hriScores: { stress: 78, comfort: 84, trust: 88, usefulness: 87 },
    godspeed: { anthropomorphism: 3.2, animacy: 3.5, likeability: 4.1, perceivedIntelligence: 4.1, perceivedSafety: 4.6 },
    rosas: { warmth: 3.8, competence: 4.3, discomfort: 1.5 },
    telemetry: {
      degreesOfFreedom: 4,
      sensorArray: ["Standard Vision Sensor", "Obstacle Detection Array"],
      actuation: "Autonomous mobile base",
      runtimeHours: 8.0,
      safetyCompliance: "ISO 13482 Robotics Standard",
      latencyMs: 90
    },
    citations: []
  };
}
