/**
 * NextPath verified demo dataset (South Africa, MVP scope).
 *
 * Everything here is structured data used by the matching engine.
 * The AI never invents requirements — it only explains records from this file.
 * Requirements are illustrative EXAMPLE ranges captured from public university
 * admissions pages and must be re-verified with the institution.
 */

export const DATA_VERIFIED_ON = "August 2026";

export const SUBJECTS = [
  "Siswati HL",
  "English FAL",
  "Social Science",
  "Life Orientation",
  "Creative Arts",
  "Afrikaans FAL",
  "isiZulu HL",
  "EMS",
  "Technology",
  "Natural Sciences",
  "Mathematics",
] as const;

export const GRADE9_SUBJECTS = [
  "Home Language (English / isiZulu / other)",
  "First Additional Language (Afrikaans / isiXhosa / Sesotho / other)",
  "Mathematics",
  "Life Orientation",
  "Natural Sciences",
  "Technology",
  "Social Sciences (History and Geography)",
  "Economic and Management Sciences (EMS)",
  "Creative Arts",
] as const;

export const GRADE10_SUBJECTS = [
  "Mathematics",
  "Physical Sciences",
  "Tourism",
  "Agriculture",
  "Computer Applications Technology",
  "Mathematical Literacy",
  "Economics",
  "Business Studies",
  "Information Technology",
  "Life Sciences",
  "Geography",
  "Accounting",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

export const LANGUAGE_OPTIONS = [
  "English",
  "isiZulu",
  "Afrikaans",
  "Sesotho",
  "isiXhosa",
  "Setswana",
  "Sepedi",
  "Xitsonga",
  "Tshivenda",
  "Other",
] as const;

export const INTERESTS = [
  { id: "technology", label: "Technology", emoji: "💻" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "numbers", label: "Numbers", emoji: "📊" },
  { id: "creativity", label: "Creativity", emoji: "🎨" },
  { id: "business", label: "Business", emoji: "💰" },
  { id: "helping", label: "Helping people", emoji: "👥" },
  { id: "problem-solving", label: "Problem solving", emoji: "🧠" },
  { id: "building", label: "Building things", emoji: "🔧" },
  { id: "environment", label: "Environment", emoji: "🌍" },
  { id: "communication", label: "Communication", emoji: "🎤" },
  { id: "social-media", label: "Social media", emoji: "📱" },
  { id: "games", label: "Games", emoji: "🎮" },
];

export const STRENGTHS = [
  { id: "problem-solving", label: "Problem solving" },
  { id: "mathematics", label: "Mathematics" },
  { id: "creativity", label: "Creativity" },
  { id: "communication", label: "Communication" },
  { id: "leadership", label: "Leadership" },
  { id: "people", label: "Working with people" },
  { id: "independent", label: "Working independently" },
  { id: "analysis", label: "Analysing information" },
  { id: "building", label: "Building things" },
  { id: "writing", label: "Writing" },
  { id: "technology", label: "Technology" },
];

export type Level = "Beginner" | "Intermediate" | "Advanced";

export type Programme = {
  id: string;
  university: string;
  programme: string;
  degree: string;
  duration: string;
  faculty: string;
  requiredSubjects: { subject: string; min: number }[];
  aps: number;
  url: string;
  verified: string;
};

export type Project = {
  id: string;
  title: string;
  level: Level;
  time: string;
  description: string;
  skills: string[];
  careers: string[];
};

export type Career = {
  id: string;
  title: string;
  emoji: string;
  category: string;
  blurb: string;
  description: string;
  dayToDay: string[];
  requiredSubjects: string[];
  recommendedSubjects: string[];
  /** Example marks a Grade 9 learner should aim toward by Grade 12. */
  markTargets: { subject: string; target: number }[];
  interests: string[];
  strengths: string[];
  skills: Record<Level, string[]>;
  programmes: string[];
  related: string[];
  opportunityAreas: string[];
};

export const CAREERS: Career[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    emoji: "💻",
    category: "Technology",
    blurb: "Design and build the apps, systems and websites people use every day.",
    description:
      "Software engineers write and maintain the code behind websites, mobile apps, banking systems and more. They break large problems into small ones and solve them step by step, usually as part of a team.",
    dayToDay: [
      "Writing and reviewing code",
      "Fixing bugs and testing features",
      "Planning solutions with a team",
    ],
    requiredSubjects: ["Mathematics"],
    recommendedSubjects: ["Information Technology", "Physical Sciences", "English"],
    markTargets: [
      { subject: "Mathematics", target: 65 },
      { subject: "English", target: 60 },
    ],
    interests: ["technology", "problem-solving", "building", "games"],
    strengths: ["problem-solving", "mathematics", "technology", "independent", "building"],
    skills: {
      Beginner: ["Python basics", "Problem solving", "Typing & computer literacy", "HTML & CSS"],
      Intermediate: ["Git & GitHub", "SQL databases", "JavaScript", "Working with APIs"],
      Advanced: ["Data structures & algorithms", "System design", "Cloud deployment", "Testing"],
    },
    programmes: ["wits-bsc-cs", "uct-bsc-cs", "up-bsc-it", "tut-dip-ict", "uj-bsc-cs"],
    related: ["data-analyst", "cybersecurity-analyst", "ux-designer", "ai-engineer"],
    opportunityAreas: ["Technology", "STEM"],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    emoji: "📈",
    category: "Technology",
    blurb: "Find patterns in data and turn them into decisions organisations can act on.",
    description:
      "Data scientists combine statistics, programming and curiosity to answer questions with data — from predicting demand to spotting fraud.",
    dayToDay: ["Cleaning and exploring data", "Building models", "Presenting findings"],
    requiredSubjects: ["Mathematics"],
    recommendedSubjects: ["Information Technology", "Physical Sciences", "Economics"],
    markTargets: [
      { subject: "Mathematics", target: 70 },
      { subject: "English", target: 60 },
    ],
    interests: ["numbers", "technology", "problem-solving", "science"],
    strengths: ["mathematics", "analysis", "problem-solving", "technology"],
    skills: {
      Beginner: ["Spreadsheets", "Statistics basics", "Python basics"],
      Intermediate: ["Pandas & NumPy", "SQL", "Data visualisation"],
      Advanced: ["Machine learning", "Experiment design", "Big data tools"],
    },
    programmes: ["wits-bsc-cs", "uct-bsc-cs", "up-bsc-it", "uj-bsc-cs"],
    related: ["data-analyst", "ai-engineer", "actuary", "software-engineer"],
    opportunityAreas: ["Technology", "STEM"],
  },
  {
    id: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    emoji: "🛡️",
    category: "Technology",
    blurb: "Protect people, money and information from online attacks.",
    description:
      "Cybersecurity analysts monitor systems, investigate suspicious activity and help organisations stay safe from hackers and data breaches.",
    dayToDay: ["Monitoring systems", "Investigating incidents", "Teaching safer habits"],
    requiredSubjects: ["Mathematics"],
    recommendedSubjects: ["Information Technology", "English"],
    markTargets: [
      { subject: "Mathematics", target: 60 },
      { subject: "English", target: 60 },
    ],
    interests: ["technology", "problem-solving", "games"],
    strengths: ["problem-solving", "analysis", "technology", "independent"],
    skills: {
      Beginner: ["Computer networks basics", "Online safety", "Linux basics"],
      Intermediate: ["Scripting", "Network security", "Incident response"],
      Advanced: ["Penetration testing", "Threat intelligence", "Security architecture"],
    },
    programmes: ["up-bsc-it", "tut-dip-ict", "uj-bsc-cs"],
    related: ["software-engineer", "it-support", "data-analyst"],
    opportunityAreas: ["Technology", "STEM"],
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    emoji: "📊",
    category: "Technology",
    blurb: "Turn numbers into clear stories that help teams make better choices.",
    description:
      "Data analysts collect, clean and interpret data, then build dashboards and reports so that decision-makers can understand what is happening.",
    dayToDay: ["Building dashboards", "Answering business questions", "Reporting insights"],
    requiredSubjects: ["Mathematics"],
    recommendedSubjects: ["Information Technology", "Economics", "Business Studies"],
    markTargets: [
      { subject: "Mathematics", target: 60 },
      { subject: "English", target: 60 },
    ],
    interests: ["numbers", "technology", "business", "problem-solving"],
    strengths: ["analysis", "mathematics", "communication", "technology"],
    skills: {
      Beginner: ["Excel / Google Sheets", "Charts and graphs", "Statistics basics"],
      Intermediate: ["SQL", "Power BI", "Python for data"],
      Advanced: ["Data modelling", "Forecasting", "Storytelling with data"],
    },
    programmes: ["up-bsc-it", "uj-bsc-cs", "tut-dip-ict"],
    related: ["data-scientist", "business-analyst", "accountant", "software-engineer"],
    opportunityAreas: ["Technology", "Business"],
  },
  {
    id: "ai-engineer",
    title: "AI Engineer",
    emoji: "🤖",
    category: "Technology",
    blurb: "Build systems that learn from data — from chatbots to medical imaging tools.",
    description:
      "AI engineers apply machine learning to real products, making sure models are useful, fair and reliable.",
    dayToDay: ["Training and testing models", "Building AI features", "Measuring accuracy"],
    requiredSubjects: ["Mathematics"],
    recommendedSubjects: ["Information Technology", "Physical Sciences"],
    markTargets: [
      { subject: "Mathematics", target: 70 },
      { subject: "Physical Sciences", target: 60 },
    ],
    interests: ["technology", "science", "problem-solving", "numbers"],
    strengths: ["mathematics", "problem-solving", "analysis", "technology"],
    skills: {
      Beginner: ["Python basics", "Maths for AI", "How AI works"],
      Intermediate: ["Machine learning basics", "Data preparation", "APIs"],
      Advanced: ["Deep learning", "Model evaluation", "Responsible AI"],
    },
    programmes: ["wits-bsc-cs", "uct-bsc-cs", "up-bsc-it"],
    related: ["data-scientist", "software-engineer", "data-analyst"],
    opportunityAreas: ["Technology", "STEM"],
  },
  {
    id: "actuary",
    title: "Actuary",
    emoji: "🧮",
    category: "Business & Finance",
    blurb: "Use mathematics to measure risk for insurance, pensions and investments.",
    description:
      "Actuaries model uncertain future events and price risk. It is one of the most mathematics-heavy careers in South Africa.",
    dayToDay: ["Building risk models", "Analysing statistics", "Advising on pricing"],
    requiredSubjects: ["Mathematics"],
    recommendedSubjects: ["Accounting", "Economics", "Physical Sciences"],
    markTargets: [
      { subject: "Mathematics", target: 80 },
      { subject: "English", target: 65 },
    ],
    interests: ["numbers", "business", "problem-solving"],
    strengths: ["mathematics", "analysis", "independent"],
    skills: {
      Beginner: ["Advanced algebra", "Statistics basics", "Spreadsheets"],
      Intermediate: ["Probability", "Financial mathematics", "R or Python"],
      Advanced: ["Risk modelling", "Actuarial exams", "Investment analysis"],
    },
    programmes: ["wits-bsc-actuarial", "uct-bcom-actuarial"],
    related: ["data-scientist", "accountant", "data-analyst"],
    opportunityAreas: ["Business", "STEM"],
  },
  {
    id: "doctor",
    title: "Medical Doctor",
    emoji: "🩺",
    category: "Health",
    blurb: "Diagnose, treat and care for patients in clinics, hospitals and communities.",
    description:
      "Doctors study medicine for six years and then complete internship and community service before practising independently in South Africa.",
    dayToDay: ["Examining patients", "Diagnosing illness", "Working with health teams"],
    requiredSubjects: ["Mathematics", "Physical Sciences", "Life Sciences"],
    recommendedSubjects: ["English"],
    markTargets: [
      { subject: "Mathematics", target: 70 },
      { subject: "Physical Sciences", target: 70 },
      { subject: "Life Sciences", target: 70 },
    ],
    interests: ["science", "helping", "problem-solving"],
    strengths: ["analysis", "people", "communication", "problem-solving"],
    skills: {
      Beginner: ["Biology fundamentals", "Study discipline", "Communication"],
      Intermediate: ["Chemistry", "First aid", "Community volunteering"],
      Advanced: ["Clinical reasoning", "Research literacy", "Patient care"],
    },
    programmes: ["uct-mbchb", "wits-mbbch", "ukzn-mbchb"],
    related: ["biomedical", "data-analyst"],
    opportunityAreas: ["Health", "STEM"],
  },
  {
    id: "civil-engineer",
    title: "Civil Engineer",
    emoji: "🏗️",
    category: "Engineering",
    blurb: "Design and build roads, bridges, water systems and buildings.",
    description:
      "Civil engineers plan and supervise infrastructure that communities depend on, balancing safety, cost and the environment.",
    dayToDay: ["Designing structures", "Site visits", "Checking safety standards"],
    requiredSubjects: ["Mathematics", "Physical Sciences"],
    recommendedSubjects: ["Geography", "English"],
    markTargets: [
      { subject: "Mathematics", target: 70 },
      { subject: "Physical Sciences", target: 65 },
    ],
    interests: ["building", "environment", "problem-solving", "science"],
    strengths: ["mathematics", "building", "problem-solving", "leadership"],
    skills: {
      Beginner: ["Technical drawing", "Physics fundamentals", "Measurement"],
      Intermediate: ["CAD software", "Materials science", "Project basics"],
      Advanced: ["Structural analysis", "Project management", "Environmental impact"],
    },
    programmes: ["up-beng-civil", "uct-beng-civil", "tut-dip-ict"],
    related: ["software-engineer", "data-analyst"],
    opportunityAreas: ["Engineering", "STEM"],
  },
  {
    id: "accountant",
    title: "Chartered Accountant",
    emoji: "📒",
    category: "Business & Finance",
    blurb: "Manage, audit and explain the money side of organisations.",
    description:
      "Chartered accountants complete a degree, postgraduate study and articles before qualifying. They audit, advise and lead finance teams.",
    dayToDay: ["Preparing financial reports", "Auditing records", "Advising businesses"],
    requiredSubjects: ["Mathematics"],
    recommendedSubjects: ["Accounting", "Business Studies", "Economics"],
    markTargets: [
      { subject: "Mathematics", target: 60 },
      { subject: "Accounting", target: 60 },
    ],
    interests: ["numbers", "business", "problem-solving"],
    strengths: ["mathematics", "analysis", "communication", "independent"],
    skills: {
      Beginner: ["Bookkeeping basics", "Spreadsheets", "Budgeting"],
      Intermediate: ["Financial statements", "Tax basics", "Accounting software"],
      Advanced: ["Auditing", "Financial management", "Corporate governance"],
    },
    programmes: ["uj-bcom-accounting", "up-bcom-accounting"],
    related: ["business-analyst", "actuary", "data-analyst"],
    opportunityAreas: ["Business"],
  },
  {
    id: "ux-designer",
    title: "UX/UI Designer",
    emoji: "🎨",
    category: "Technology & Design",
    blurb: "Make technology easy, useful and beautiful for real people.",
    description:
      "UX/UI designers research how people use products, then design screens and flows that feel obvious. It blends creativity with problem solving.",
    dayToDay: ["Sketching screens", "Interviewing users", "Testing prototypes"],
    requiredSubjects: [],
    recommendedSubjects: ["Information Technology", "Visual Arts", "English"],
    markTargets: [{ subject: "English", target: 60 }],
    interests: ["creativity", "technology", "helping", "social-media"],
    strengths: ["creativity", "communication", "people", "technology"],
    skills: {
      Beginner: ["Design basics", "Figma", "Sketching"],
      Intermediate: ["Wireframing", "User research", "Prototyping"],
      Advanced: ["Design systems", "Usability testing", "Accessibility"],
    },
    programmes: ["tut-dip-ict", "uj-bcom-accounting"],
    related: ["software-engineer", "business-analyst", "data-analyst"],
    opportunityAreas: ["Technology", "Design"],
  },
  {
    id: "it-support",
    title: "IT Support Technician",
    emoji: "🔌",
    category: "Technology",
    blurb: "Keep computers, networks and users working — a strong entry into tech.",
    description:
      "IT support technicians install, maintain and troubleshoot hardware, software and networks. Many start here and grow into engineering or security roles.",
    dayToDay: ["Fixing devices", "Helping users", "Maintaining networks"],
    requiredSubjects: [],
    recommendedSubjects: [
      "Computer Applications Technology",
      "Information Technology",
      "Mathematical Literacy",
    ],
    markTargets: [{ subject: "English", target: 50 }],
    interests: ["technology", "helping", "building"],
    strengths: ["technology", "people", "problem-solving", "building"],
    skills: {
      Beginner: ["Computer hardware", "Operating systems", "Customer service"],
      Intermediate: ["Networking (CompTIA basics)", "Troubleshooting", "Cloud basics"],
      Advanced: ["System administration", "Security basics", "Automation scripting"],
    },
    programmes: ["tut-dip-ict"],
    related: ["cybersecurity-analyst", "software-engineer", "data-analyst"],
    opportunityAreas: ["Technology"],
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    emoji: "🧭",
    category: "Business & Technology",
    blurb: "Bridge people and technology by turning business needs into clear plans.",
    description:
      "Business analysts study how an organisation works, find problems and describe the solution that developers should build.",
    dayToDay: ["Interviewing teams", "Mapping processes", "Writing requirements"],
    requiredSubjects: [],
    recommendedSubjects: ["Mathematics", "Business Studies", "English", "Economics"],
    markTargets: [
      { subject: "English", target: 60 },
      { subject: "Mathematics", target: 55 },
    ],
    interests: ["business", "problem-solving", "communication", "technology"],
    strengths: ["communication", "analysis", "people", "leadership"],
    skills: {
      Beginner: ["Communication", "Process mapping", "Spreadsheets"],
      Intermediate: ["Requirements writing", "SQL basics", "Stakeholder workshops"],
      Advanced: ["Data analysis", "Agile delivery", "Change management"],
    },
    programmes: ["uj-bcom-accounting", "up-bcom-accounting", "up-bsc-it"],
    related: ["data-analyst", "accountant", "ux-designer", "software-engineer"],
    opportunityAreas: ["Business", "Technology"],
  },
  {
    id: "biomedical",
    title: "Biomedical Scientist",
    emoji: "🧬",
    category: "Health & Science",
    blurb: "Work in laboratories to understand disease and improve treatment.",
    description:
      "Biomedical scientists run tests and research that support diagnosis, vaccines and new medicines.",
    dayToDay: ["Laboratory testing", "Recording results", "Research"],
    requiredSubjects: ["Mathematics", "Life Sciences"],
    recommendedSubjects: ["Physical Sciences"],
    markTargets: [
      { subject: "Life Sciences", target: 65 },
      { subject: "Mathematics", target: 60 },
    ],
    interests: ["science", "helping", "problem-solving", "environment"],
    strengths: ["analysis", "independent", "problem-solving"],
    skills: {
      Beginner: ["Biology fundamentals", "Laboratory safety", "Note taking"],
      Intermediate: ["Chemistry", "Microscopy", "Data recording"],
      Advanced: ["Research methods", "Statistics", "Laboratory instrumentation"],
    },
    programmes: ["ukzn-mbchb", "wits-mbbch", "up-bsc-it"],
    related: ["doctor", "data-scientist"],
    opportunityAreas: ["Health", "STEM"],
  },
];

export const PROGRAMMES: Programme[] = [
  {
    id: "wits-bsc-cs",
    university: "University of the Witwatersrand",
    programme: "BSc in Computer Science",
    degree: "Bachelor of Science",
    duration: "3 years",
    faculty: "Science",
    requiredSubjects: [
      { subject: "Mathematics", min: 70 },
      { subject: "English", min: 60 },
    ],
    aps: 42,
    url: "https://www.wits.ac.za/science/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "uct-bsc-cs",
    university: "University of Cape Town",
    programme: "BSc in Computer Science",
    degree: "Bachelor of Science",
    duration: "3 years",
    faculty: "Science",
    requiredSubjects: [
      { subject: "Mathematics", min: 70 },
      { subject: "English", min: 65 },
    ],
    aps: 43,
    url: "https://science.uct.ac.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "up-bsc-it",
    university: "University of Pretoria",
    programme: "BSc Information Technology (Information Systems)",
    degree: "Bachelor of Science",
    duration: "3 years",
    faculty: "Engineering, Built Environment and IT",
    requiredSubjects: [
      { subject: "Mathematics", min: 60 },
      { subject: "English", min: 60 },
    ],
    aps: 30,
    url: "https://www.up.ac.za/faculty-of-engineering-built-environment-it",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "uj-bsc-cs",
    university: "University of Johannesburg",
    programme: "BSc Computer Science and Informatics",
    degree: "Bachelor of Science",
    duration: "3 years",
    faculty: "Science",
    requiredSubjects: [
      { subject: "Mathematics", min: 60 },
      { subject: "English", min: 55 },
    ],
    aps: 31,
    url: "https://www.uj.ac.za/faculties/science/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "tut-dip-ict",
    university: "Tshwane University of Technology",
    programme: "Diploma in ICT (Applications Development)",
    degree: "Diploma",
    duration: "3 years",
    faculty: "ICT",
    requiredSubjects: [
      { subject: "Mathematics", min: 40 },
      { subject: "English", min: 50 },
    ],
    aps: 24,
    url: "https://www.tut.ac.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "wits-bsc-actuarial",
    university: "University of the Witwatersrand",
    programme: "BSc Actuarial Science",
    degree: "Bachelor of Science",
    duration: "3 years",
    faculty: "Commerce, Law and Management",
    requiredSubjects: [
      { subject: "Mathematics", min: 80 },
      { subject: "English", min: 65 },
    ],
    aps: 44,
    url: "https://www.wits.ac.za/clm/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "uct-bcom-actuarial",
    university: "University of Cape Town",
    programme: "BCom Actuarial Science",
    degree: "Bachelor of Commerce",
    duration: "3 years",
    faculty: "Commerce",
    requiredSubjects: [
      { subject: "Mathematics", min: 80 },
      { subject: "English", min: 65 },
    ],
    aps: 45,
    url: "https://commerce.uct.ac.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "uct-mbchb",
    university: "University of Cape Town",
    programme: "MBChB (Medicine and Surgery)",
    degree: "MBChB",
    duration: "6 years",
    faculty: "Health Sciences",
    requiredSubjects: [
      { subject: "Mathematics", min: 70 },
      { subject: "Physical Sciences", min: 70 },
      { subject: "Life Sciences", min: 70 },
      { subject: "English", min: 70 },
    ],
    aps: 45,
    url: "https://health.uct.ac.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "wits-mbbch",
    university: "University of the Witwatersrand",
    programme: "MBBCh (Medicine)",
    degree: "MBBCh",
    duration: "6 years",
    faculty: "Health Sciences",
    requiredSubjects: [
      { subject: "Mathematics", min: 70 },
      { subject: "Physical Sciences", min: 70 },
      { subject: "Life Sciences", min: 70 },
      { subject: "English", min: 70 },
    ],
    aps: 44,
    url: "https://www.wits.ac.za/health/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "ukzn-mbchb",
    university: "University of KwaZulu-Natal",
    programme: "MBChB (Medicine)",
    degree: "MBChB",
    duration: "6 years",
    faculty: "Health Sciences",
    requiredSubjects: [
      { subject: "Mathematics", min: 65 },
      { subject: "Physical Sciences", min: 65 },
      { subject: "Life Sciences", min: 65 },
      { subject: "English", min: 60 },
    ],
    aps: 40,
    url: "https://clms.ukzn.ac.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "up-beng-civil",
    university: "University of Pretoria",
    programme: "BEng Civil Engineering",
    degree: "Bachelor of Engineering",
    duration: "4 years",
    faculty: "Engineering, Built Environment and IT",
    requiredSubjects: [
      { subject: "Mathematics", min: 70 },
      { subject: "Physical Sciences", min: 70 },
      { subject: "English", min: 60 },
    ],
    aps: 35,
    url: "https://www.up.ac.za/civil-engineering",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "uct-beng-civil",
    university: "University of Cape Town",
    programme: "BSc Eng Civil Engineering",
    degree: "Bachelor of Science in Engineering",
    duration: "4 years",
    faculty: "Engineering & the Built Environment",
    requiredSubjects: [
      { subject: "Mathematics", min: 70 },
      { subject: "Physical Sciences", min: 70 },
      { subject: "English", min: 60 },
    ],
    aps: 43,
    url: "https://ebe.uct.ac.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "uj-bcom-accounting",
    university: "University of Johannesburg",
    programme: "BCom Accounting",
    degree: "Bachelor of Commerce",
    duration: "3 years",
    faculty: "College of Business and Economics",
    requiredSubjects: [
      { subject: "Mathematics", min: 60 },
      { subject: "English", min: 55 },
    ],
    aps: 30,
    url: "https://www.uj.ac.za/faculties/cbe/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "up-bcom-accounting",
    university: "University of Pretoria",
    programme: "BCom Accounting Sciences",
    degree: "Bachelor of Commerce",
    duration: "3 years",
    faculty: "Economic and Management Sciences",
    requiredSubjects: [
      { subject: "Mathematics", min: 70 },
      { subject: "English", min: 60 },
    ],
    aps: 34,
    url: "https://www.up.ac.za/faculty-of-economic-and-management-sciences",
    verified: DATA_VERIFIED_ON,
  },
];

export const PROJECTS: Project[] = [
  {
    id: "calculator",
    title: "Build a calculator",
    level: "Beginner",
    time: "2–3 hours",
    description:
      "A simple program that adds, subtracts, multiplies and divides — your first real code.",
    skills: ["Python basics", "Problem solving"],
    careers: ["software-engineer", "ai-engineer", "it-support"],
  },
  {
    id: "quiz-app",
    title: "Build a quiz application",
    level: "Intermediate",
    time: "1 weekend",
    description: "A quiz that asks questions, keeps score and saves the highest score.",
    skills: ["JavaScript", "Problem solving", "Git & GitHub"],
    careers: ["software-engineer", "ux-designer", "ai-engineer"],
  },
  {
    id: "personal-site",
    title: "Build your personal website",
    level: "Beginner",
    time: "3–4 hours",
    description:
      "A one-page site about you, your subjects and your goals. Great for showing teachers.",
    skills: ["HTML & CSS", "Design basics"],
    careers: ["software-engineer", "ux-designer", "business-analyst"],
  },
  {
    id: "student-system",
    title: "Student management system",
    level: "Intermediate",
    time: "2 weekends",
    description: "Store learners, subjects and marks in a database and calculate averages.",
    skills: ["SQL databases", "Python basics", "Git & GitHub"],
    careers: ["software-engineer", "data-analyst", "it-support"],
  },
  {
    id: "fullstack-app",
    title: "Full-stack web application",
    level: "Advanced",
    time: "1 month",
    description: "A site with login, a database and a real feature people can use.",
    skills: ["JavaScript", "Cloud deployment", "System design"],
    careers: ["software-engineer", "ai-engineer"],
  },
  {
    id: "marks-dashboard",
    title: "My marks dashboard",
    level: "Beginner",
    time: "2 hours",
    description: "Track your own term marks in a spreadsheet and chart your improvement.",
    skills: ["Excel / Google Sheets", "Charts and graphs"],
    careers: ["data-analyst", "data-scientist", "accountant", "business-analyst"],
  },
  {
    id: "survey-analysis",
    title: "School survey analysis",
    level: "Intermediate",
    time: "1 week",
    description: "Survey 50 learners, clean the data and present three findings to your class.",
    skills: ["Statistics basics", "Data visualisation", "Communication"],
    careers: ["data-analyst", "data-scientist", "business-analyst"],
  },
  {
    id: "ml-predictor",
    title: "Simple prediction model",
    level: "Advanced",
    time: "2 weeks",
    description: "Train a small model that predicts marks or weather from a public dataset.",
    skills: ["Machine learning basics", "Pandas & NumPy"],
    careers: ["data-scientist", "ai-engineer"],
  },
  {
    id: "safe-passwords",
    title: "Password strength checker",
    level: "Beginner",
    time: "2 hours",
    description: "A tool that scores passwords and teaches classmates about online safety.",
    skills: ["Python basics", "Online safety"],
    careers: ["cybersecurity-analyst", "software-engineer", "it-support"],
  },
  {
    id: "home-network",
    title: "Map a home or school network",
    level: "Intermediate",
    time: "1 week",
    description: "Draw how devices connect, find weak points and suggest safer settings.",
    skills: ["Computer networks basics", "Troubleshooting"],
    careers: ["cybersecurity-analyst", "it-support"],
  },
  {
    id: "app-redesign",
    title: "Redesign an app screen",
    level: "Beginner",
    time: "3 hours",
    description: "Pick an app you find confusing and redraw one screen so it is easier to use.",
    skills: ["Figma", "Sketching", "Design basics"],
    careers: ["ux-designer", "software-engineer"],
  },
  {
    id: "user-testing",
    title: "Test your design with 5 people",
    level: "Intermediate",
    time: "1 week",
    description: "Watch five classmates use your design and write down every place they get stuck.",
    skills: ["User research", "Usability testing", "Communication"],
    careers: ["ux-designer", "business-analyst"],
  },
  {
    id: "tuckshop-books",
    title: "Run the books for a small tuckshop",
    level: "Beginner",
    time: "1 month, part-time",
    description:
      "Record income and expenses for a real or imagined tuckshop and produce a monthly statement.",
    skills: ["Bookkeeping basics", "Budgeting", "Spreadsheets"],
    careers: ["accountant", "business-analyst", "actuary"],
  },
  {
    id: "bridge-model",
    title: "Build a model bridge",
    level: "Beginner",
    time: "1 weekend",
    description:
      "Design and test a bridge from cheap materials and measure how much weight it holds.",
    skills: ["Technical drawing", "Physics fundamentals", "Measurement"],
    careers: ["civil-engineer"],
  },
  {
    id: "health-journal",
    title: "Community health journal",
    level: "Beginner",
    time: "1 month",
    description:
      "Research a common health issue in your community and write a short, sourced report.",
    skills: ["Biology fundamentals", "Research methods", "Communication"],
    careers: ["doctor", "biomedical"],
  },
];

export type Opportunity = {
  id: string;
  name: string;
  organisation: string;
  type: string;
  description: string;
  eligibility: string;
  closing: string;
  location: string;
  areas: string[];
  url: string;
  verified: string;
};

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "nsfas",
    name: "NSFAS Bursary",
    organisation: "National Student Financial Aid Scheme",
    type: "Bursary",
    description:
      "Government funding covering tuition, accommodation and allowances for qualifying students at public universities and TVET colleges.",
    eligibility:
      "South African citizen; combined household income within the NSFAS threshold; Grade 12 in final year.",
    closing:
      "Applications usually open in the second half of the year — confirm dates on the official site.",
    location: "National",
    areas: ["Technology", "STEM", "Business", "Health", "Engineering", "Design"],
    url: "https://www.nsfas.org.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "funza",
    name: "Funza Lushaka Bursary",
    organisation: "Department of Basic Education",
    type: "Bursary",
    description:
      "Full-cost bursary for students studying to become teachers in priority subject areas.",
    eligibility:
      "South African citizen studying an approved initial teacher education qualification.",
    closing: "Annual cycle — confirm on the official site.",
    location: "National",
    areas: ["Education", "STEM"],
    url: "https://www.funzalushaka.doe.gov.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "sasol",
    name: "Sasol Bursary Programme",
    organisation: "Sasol",
    type: "Bursary",
    description:
      "Bursaries for engineering, science and technology studies, including vacation work.",
    eligibility: "Strong Mathematics and Physical Sciences results; South African citizen.",
    closing: "Annual cycle — confirm on the official site.",
    location: "National",
    areas: ["Engineering", "STEM", "Technology"],
    url: "https://www.sasolbursaries.com/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "wethinkcode",
    name: "WeThinkCode_",
    organisation: "WeThinkCode_",
    type: "Coding programme",
    description:
      "Tuition-free two-year software engineering programme with no prior coding experience required.",
    eligibility: "Ages 17–35; selection is through online aptitude tests, not marks.",
    closing: "Applications open annually — confirm on the official site.",
    location: "Johannesburg, Cape Town, Durban",
    areas: ["Technology"],
    url: "https://www.wethinkcode.co.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "codespace",
    name: "CodeSpace Academy Courses",
    organisation: "CodeSpace Academy",
    type: "Coding programme",
    description: "Short and full-time coding bootcamps in software development and data analysis.",
    eligibility: "School leavers and older; some free introductory content available.",
    closing: "Rolling intakes.",
    location: "Cape Town / online",
    areas: ["Technology"],
    url: "https://www.codespace.co.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "sa-maths-olympiad",
    name: "South African Mathematics Olympiad",
    organisation: "SA Mathematics Foundation",
    type: "Competition",
    description:
      "National mathematics competition open to school learners, with a junior round for Grades 8 and 9.",
    eligibility: "Learners in Grades 8–12 entered through their school.",
    closing: "Round 1 is written in the first school term.",
    location: "National",
    areas: ["STEM", "Technology", "Business"],
    url: "https://www.samf.ac.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "eskom-expo",
    name: "Eskom Expo for Young Scientists",
    organisation: "Eskom Development Foundation",
    type: "Competition",
    description:
      "Science fair where learners present research projects at regional and international level.",
    eligibility: "Learners in Grades 4–12.",
    closing: "Regional expos run mid-year.",
    location: "National",
    areas: ["STEM", "Health", "Engineering", "Technology"],
    url: "https://www.exposcience.co.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "coursera-free",
    name: "Free beginner courses",
    organisation: "Coursera / freeCodeCamp",
    type: "Online course",
    description:
      "Free introductory courses in programming, data and design that you can start in Grade 9.",
    eligibility: "Open to anyone with internet access.",
    closing: "Always open.",
    location: "Online",
    areas: ["Technology", "Design", "Business", "STEM"],
    url: "https://www.freecodecamp.org/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "saica-thuthuka",
    name: "Thuthuka Bursary Fund",
    organisation: "SAICA",
    type: "Bursary",
    description:
      "Bursary and support programme for African and Coloured students studying towards becoming CAs(SA).",
    eligibility:
      "South African citizen; strong Mathematics; studying accounting at an accredited university.",
    closing: "Annual cycle — confirm on the official site.",
    location: "National",
    areas: ["Business"],
    url: "https://www.saica.org.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "dell-young-leaders",
    name: "Dell Young Leaders Programme",
    organisation: "Michael & Susan Dell Foundation",
    type: "Scholarship",
    description:
      "Financial and personal support for students at partner South African universities.",
    eligibility: "Financially disadvantaged students at partner universities.",
    closing: "Annual cycle — confirm on the official site.",
    location: "Partner universities",
    areas: ["Business", "STEM", "Technology", "Health"],
    url: "https://www.dellyoungleaders.org/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "nyda-grant",
    name: "NYDA Youth Programmes",
    organisation: "National Youth Development Agency",
    type: "Youth programme",
    description: "Skills development, mentorship and grant programmes for South African youth.",
    eligibility: "South African youth aged 18–35.",
    closing: "Rolling.",
    location: "National",
    areas: ["Business", "Technology", "Design"],
    url: "https://www.nyda.gov.za/",
    verified: DATA_VERIFIED_ON,
  },
  {
    id: "seta-learnerships",
    name: "SETA Learnerships",
    organisation: "Sector Education and Training Authorities",
    type: "Holiday / skills programme",
    description:
      "Workplace learnerships and skills programmes across ICT, engineering, finance and health sectors.",
    eligibility: "Varies per SETA and programme.",
    closing: "Varies.",
    location: "National",
    areas: ["Technology", "Engineering", "Business", "Health"],
    url: "https://www.dhet.gov.za/",
    verified: DATA_VERIFIED_ON,
  },
];

export const careerById = (id: string) => CAREERS.find((c) => c.id === id);
export const programmeById = (id: string) => PROGRAMMES.find((p) => p.id === id);
export const projectsForCareer = (id: string) => PROJECTS.filter((p) => p.careers.includes(id));
