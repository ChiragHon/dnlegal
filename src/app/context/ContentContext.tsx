"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import ContactModal from "../components/ContactModal";
import DisclaimerModal from "../components/DisclaimerModal";
import WhatsAppButton from "../components/WhatsAppButton";
import { createStore } from "../../lib/storageStore";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
  email: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image?: string;
}

export interface PracticeArea {
  id: string;
  title: string;
  description: string;
  iconKey: string;
  focusAreas: string[];
  strategy: string;
}

export interface CaseHighlight {
  id: string;
  category: string;
  title: string;
  description: string;
  outcome: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  company: string;
  caseType: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ContactInfo {
  address: string;
  phone1: string;
  phone2: string;
  email: string;
  hoursWeekday: string;
  hoursWeekend: string;
  mapEmbedUrl: string;
  whatsappNumber: string;
  instagramUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  twitterUrl: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  badge: string;
}

// ─── Context Type ─────────────────────────────────────────────────────────────
interface ContentContextType {
  // Team
  team: TeamMember[];
  addMember: (m: Omit<TeamMember, "id">) => void;
  editMember: (id: string, m: Omit<TeamMember, "id">) => void;
  deleteMember: (id: string) => void;
  // Blog
  blogs: BlogPost[];
  addBlog: (b: Omit<BlogPost, "id">) => void;
  editBlog: (id: string, b: Omit<BlogPost, "id">) => void;
  deleteBlog: (id: string) => void;
  // Practice Areas
  practiceAreas: PracticeArea[];
  addPracticeArea: (p: Omit<PracticeArea, "id">) => void;
  editPracticeArea: (id: string, p: Omit<PracticeArea, "id">) => void;
  deletePracticeArea: (id: string) => void;
  // Case Highlights
  caseHighlights: CaseHighlight[];
  addCaseHighlight: (c: Omit<CaseHighlight, "id">) => void;
  editCaseHighlight: (id: string, c: Omit<CaseHighlight, "id">) => void;
  deleteCaseHighlight: (id: string) => void;
  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (t: Omit<Testimonial, "id">) => void;
  editTestimonial: (id: string, t: Omit<Testimonial, "id">) => void;
  deleteTestimonial: (id: string) => void;
  // FAQs
  faqs: FaqItem[];
  addFaq: (f: Omit<FaqItem, "id">) => void;
  editFaq: (id: string, f: Omit<FaqItem, "id">) => void;
  deleteFaq: (id: string) => void;
  // Contact Info
  contactInfo: ContactInfo;
  updateContactInfo: (c: ContactInfo) => void;
  // Hero
  heroContent: HeroContent;
  updateHeroContent: (h: HeroContent) => void;
  // Modal
  isConsultationOpen: boolean;
  openConsultation: () => void;
  closeConsultation: () => void;
  // Disclaimer Modal
  isDisclaimerOpen: boolean;
  openDisclaimer: () => void;
  closeDisclaimer: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// ─── Default Data ─────────────────────────────────────────────────────────────

const defaultTeam: TeamMember[] = [
  { id: "member-1", name: "Mr. Hitesh B. Dashpute", role: "SENIOR PARTNER", bio: "B.A., LL.B — Mr. Hitesh Dashpute has pursued his Law course from NBT Law College, Nashik of Savitribai Phule Pune University. With years of extensive practice across various fields of law, he leads DNL with a deep commitment to high-quality legal advisory and client-first advocacy.", image: "/images/attorney1.png", linkedin: "https://www.dnlegal.in/mr-h-dashpute/", email: "mailto:support@dnlegal.in" },
  { id: "member-2", name: "Miss. R.C. Charulatha", role: "ADVOCATE – REAL ESTATE", bio: "Miss R.C. Charulatha has completed her Graduation in the field of Commerce and brings focused expertise in real estate law. She advises clients on property transactions, title verification, RERA compliance, and real estate dispute resolution across Maharashtra.", image: "/images/attorney2.png", linkedin: "https://www.dnlegal.in/miss-r-c-charulatha/", email: "mailto:support@dnlegal.in" },
  { id: "member-3", name: "Mr. Sachin M. Raut", role: "ADVOCATE – LITIGATION & LAND ACQUISITION", bio: "Graduate with B.A., LL.B — Mr. Sachin Raut has 4 years of focused expertise in Civil law, Land Reference and Acquisition matters. He represents clients in complex land acquisition disputes and civil litigation proceedings before courts in Maharashtra.", image: "/images/attorney3.png", linkedin: "https://www.dnlegal.in/mr-pradyumna-sharmaadvocate-litigation-arbitration-dispute-resolution/", email: "mailto:support@dnlegal.in" },
  { id: "member-4", name: "Mr. Nitin Nikam", role: "ADVOCATE – CIVIL & CORPORATE LAW", bio: "LL.B, M.C.M., M.Psy., ADIT C-DAC, ITL (IIT Kh) — Mr. Nitin Nikam pursued his LL.B from NBT Law College, Nashik. His unique blend of legal and technology expertise makes him effective in cyber law, corporate compliance, and civil matters.", image: "/images/attorney1.png", linkedin: "https://www.dnlegal.in/mr-nitin-nikam/", email: "mailto:support@dnlegal.in" },
];

const defaultBlogs: BlogPost[] = [
  { id: "blog-1", title: "Understanding Arbitration & Mediation in India: A Practical Guide", category: "ARBITRATION & DISPUTE RESOLUTION", excerpt: "With day-to-day concerns rising, arbitration and mediation have emerged as the most effective tools for swift, enforceable dispute resolution in India.", content: "Arbitration and mediation have become indispensable tools in India's legal landscape as court dockets grow increasingly congested. The Arbitration and Conciliation Act, 1996 — significantly amended in 2015 and 2019 — provides a robust framework for resolving commercial disputes outside the traditional court system.\n\nArbitration is a private, binding process where parties present their case before a neutral arbitrator or panel. The award passed is enforceable as a decree of the court.\n\nMediation is a non-binding process where a neutral mediator facilitates communication to help parties reach a mutually acceptable settlement.\n\nAt D N Legal Associates, we represent clients in domestic and international arbitrations, guide parties through mediation, and advise on drafting effective arbitration clauses in commercial agreements.", author: "Mr. Hitesh B. Dashpute", date: "March 15, 2024", readTime: "6 min read", image: "/images/office_boardroom.png" },
  { id: "blog-2", title: "Real Estate Law in Maharashtra: RERA Compliance & Your Rights", category: "REAL ESTATE LAW", excerpt: "The Real Estate (Regulation and Development) Act, 2016 (RERA) has transformed the real estate sector in Maharashtra. Understanding your rights as a buyer or developer is critical.", content: "The Maharashtra Real Estate Regulatory Authority (MahaRERA) has been one of the most active real estate regulators in the country since RERA's enactment.\n\nFor homebuyers, RERA mandates that every real estate project above a certain size must be registered before launch. Buyers now have enforceable rights to receive possession on the agreed date, demand refund with interest if the builder fails to deliver, and access all project documents.\n\nD N Legal Associates provides comprehensive legal support from pre-purchase due diligence to post-possession dispute resolution under RERA.", author: "Miss. R.C. Charulatha", date: "January 22, 2024", readTime: "5 min read", image: "/images/office_library.png" },
  { id: "blog-3", title: "Cyber Crime in India: Legal Remedies Under the IT Act", category: "CYBER CRIME & IT LAW", excerpt: "With growing technology adoption, crimes like phishing, cyber extortion, data breaches, identity theft, and online harassment have surged. Here is what the law provides.", content: "The Information Technology Act, 2000 (amended in 2008) remains the primary legislation governing cyber crimes in India.\n\nCommon cyber crimes include hacking and unauthorized access (Section 66), identity theft (Section 66C), online fraud and phishing (Section 66D), and cyber stalking.\n\nIf you have been a victim: preserve all digital evidence, file an FIR at cybercrime.gov.in, and engage a legal counsel experienced in IT law.\n\nD N Legal Associates handles cyber crime FIR registrations, represents victims before the Adjudicating Officer, and advises businesses on IT Act compliance.", author: "Mr. Nitin Nikam", date: "November 10, 2023", readTime: "7 min read", image: "/images/office_reception.png" },
  { id: "blog-4", title: "Land Acquisition in Maharashtra: Rights of Landowners", category: "CIVIL & LAND LAW", excerpt: "Land acquisition by the government is governed by the LARR Act 2013. Landowners have significant rights to contest compensation and protect their property.", content: "The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (LARR Act) replaced the century-old Land Acquisition Act of 1894.\n\nUnder the new law, compensation is calculated at 2x the market value in urban areas and 4x in rural areas. Landowners have the right to challenge inadequate compensation before the Land Acquisition Collector and appeal to the Reference Court under Section 18.\n\nAt D N Legal Associates, Mr. Sachin Raut specializes in representing landowners through the entire process — from SIA challenges to compensation enhancement proceedings.", author: "Mr. Sachin M. Raut", date: "September 5, 2023", readTime: "6 min read", image: "/images/office_boardroom.png" },
];

const defaultPracticeAreas: PracticeArea[] = [
  { id: "pa-1", title: "Arbitration, Mediation & Dispute Resolution", description: "With day-to-day concerns rising, DNL offers expert arbitration and mediation services as a faster, cost-effective alternative to court proceedings.", iconKey: "arbitration", focusAreas: ["Domestic & International Arbitration", "Court-Referred Mediation", "Commercial Dispute Conciliation", "Arbitral Award Enforcement", "Drafting Arbitration Clauses"], strategy: "DNL approaches alternative dispute resolution with the goal of achieving fair, enforceable outcomes swiftly and confidentially. We represent clients before arbitral tribunals under the Arbitration and Conciliation Act, 1996, guide parties through structured mediation, and advise on drafting watertight arbitration clauses in commercial contracts." },
  { id: "pa-2", title: "Banking, Insolvency & Financial Restructuring", description: "Bankruptcy and insolvency are crucial and trying circumstances for any individual or business. DNL provides strategic counsel through every stage of financial difficulty.", iconKey: "banking", focusAreas: ["NCLT / NCLAT Insolvency Proceedings (IBC)", "Debt Recovery & DRT Proceedings", "Corporate Financial Restructuring", "Bank Loan Recovery & NPA Resolution", "Creditor & Debtor Representation"], strategy: "DNL represents creditors and debtors before the National Company Law Tribunal (NCLT) under the Insolvency and Bankruptcy Code, 2016. We assist in filing and defending Corporate Insolvency Resolution Processes, advise on restructuring debt obligations, and negotiate with banks and financial institutions for resolution plans." },
  { id: "pa-3", title: "Compliance Counselling", description: "Our team provides practical and actionable advice to help you assess and mitigate any risks raised by everyday business practices across regulatory frameworks.", iconKey: "compliance", focusAreas: ["Regulatory Compliance Audits", "Corporate Governance Advisory", "Environmental & Factory Act Compliance", "GST & Tax Compliance Support", "Employment Law Compliance"], strategy: "DNL conducts comprehensive compliance audits across regulatory domains including Company Law, GST, Labour Laws, Environmental regulations, and sector-specific frameworks. We draft compliance policies, train management teams, and serve as ongoing compliance advisors for SMEs and corporates operating in Maharashtra." },
  { id: "pa-4", title: "Criminal: Cyber Crimes & Information Technology", description: "With growing technology, various crimes have emerged such as Phishing, Cyber Extortion, Data Breach, Identity Theft, and Online Harassment. DNL provides expert legal defence and remedies.", iconKey: "cyber", focusAreas: ["Cyber Crime FIR Registration & Defence", "IT Act, 2000 Violations", "Online Fraud & Phishing Cases", "Data Privacy & Security Breaches", "E-commerce Disputes & Digital Contracts"], strategy: "DNL assists both victims and the accused in cyber crime matters. For victims, we facilitate FIR registration with cyber crime cells, advise on evidence preservation, and represent clients before Adjudicating Officers under the IT Act. For businesses, we provide data protection compliance advisory and defend against wrongful cyber crime accusations." },
  { id: "pa-5", title: "Pharmaceutical, Hospitals & Health Care", description: "The Pharma law related to creation, sale, distribution and use of pharmaceutical drugs grants protection as per WHO norms, standards, and guidelines.", iconKey: "pharma", focusAreas: ["Drug Licensing & Regulatory Compliance", "Medical Negligence Claims", "Hospital & Patient Rights Disputes", "Pharmaceutical IP Protection", "Clinical Trial Legal Advisory"], strategy: "DNL advises pharmaceutical companies on drug licensing, regulatory submissions, and marketing approvals. We represent hospitals and healthcare providers in medical negligence cases before Consumer Forums and civil courts, covering the entire spectrum of healthcare law." },
  { id: "pa-6", title: "Manufacturing & Chemical Industry", description: "The Indian Factories Act, 1948 governs the manufacturing process. DNL provides comprehensive legal support to manufacturing and chemical sector businesses.", iconKey: "manufacturing", focusAreas: ["Factories Act & Labour Compliance", "Industrial Accident & Liability Claims", "Environmental & Pollution Law", "Manufacturing Contract Disputes", "MSME Legal Support"], strategy: "DNL provides ongoing legal counsel to manufacturers to ensure factory license compliance, worker safety norms, and environmental clearances. We represent businesses in industrial accident liability claims, labour tribunal proceedings, and assist MSMEs with contract structuring and commercial disputes." },
  { id: "pa-7", title: "Hospitality & Travel Industry", description: "Hospitality laws function at two prime levels — owners and operators. DNL helps navigate licensing, liability, and contractual frameworks for the hospitality sector.", iconKey: "hospitality", focusAreas: ["Hotel & Restaurant Licensing", "Owner-Operator Management Agreements", "Consumer Complaints & Dispute Resolution", "Travel Agent Regulatory Compliance", "Franchise & Licensing Agreements"], strategy: "DNL assists hotel owners, restaurant operators, and travel agencies with licence acquisition and renewals, management agreement structuring, and franchise arrangement reviews. We represent businesses in consumer court proceedings and advise on compliance with new regulatory requirements." },
  { id: "pa-8", title: "Litigation Practice", description: "It's the end result that matters. Our lawyers have a strong tradition of embracing our clients' businesses and fighting for the best possible outcome in every courtroom.", iconKey: "litigation", focusAreas: ["Civil Suits & Appeals", "Criminal Defence & Prosecution", "Writ Petitions (High Court & Supreme Court)", "Summary Suits & Injunctions", "Execution of Decrees"], strategy: "At DNL, litigation is approached as a strategic discipline. We appear before Civil Courts, Criminal Courts, Consumer Forums, and High Courts across Maharashtra. Our litigators handle complex multi-party commercial disputes, criminal defence matters, and constitutional writ petitions." },
  { id: "pa-9", title: "Labour Laws & Employee Relations", description: "DNL focuses on protecting rights in this area — covering various laws including Basic Conditions of Employment, ESIC, PF, and industrial dispute resolution.", iconKey: "labour", focusAreas: ["Industrial Dispute Act Matters", "Wrongful Termination & Retrenchment", "ESI, PF & Gratuity Disputes", "Labour Court & Industrial Tribunal", "Standing Orders & Employment Agreements"], strategy: "DNL represents both employers and employees in proceedings before Labour Courts, Industrial Tribunals, and ESIC Courts. We advise on standing orders, employment contract drafting, retrenchment procedures, and disciplinary proceedings for employers, and pursue wrongful termination claims for employees." },
  { id: "pa-10", title: "Real Estate, Construction & Slum Rehabilitation", description: "DNL offers comprehensive legal services, from high-stakes negotiations to project counselling for real estate transactions, construction contracts, and SRA projects.", iconKey: "realestate", focusAreas: ["Property Purchase & Sale Agreements", "RERA Compliance & MahaRERA Complaints", "Construction Contract Disputes", "Slum Rehabilitation Authority (SRA) Projects", "Title Verification & Due Diligence"], strategy: "DNL provides end-to-end legal support for property buyers, developers, landowners, and housing societies. We conduct thorough title searches, draft development agreements and sale deeds, advise developers on SRA project structuring, and represent clients in MahaRERA proceedings." },
];

const defaultCaseHighlights: CaseHighlight[] = [
  { id: "case-1", category: "ARBITRATION & DISPUTE RESOLUTION", title: "Commercial Partnership Dissolution", description: "Represented a Nashik-based manufacturing firm in a high-value partnership dispute. DNL secured a favourable arbitral award covering outstanding profit share, asset division, and exit compensation — avoiding a prolonged civil court battle.", outcome: "Result: Arbitral Award in Client's Favour" },
  { id: "case-2", category: "CYBER CRIME & IT LAW", title: "Online Financial Fraud — IT Act", description: "Assisted a Nashik entrepreneur defrauded of ₹28 lakhs through an online investment scam. DNL coordinated with the cyber crime cell for FIR registration, traced digital transaction trails, and pursued civil recovery proceedings simultaneously.", outcome: "Result: FIR Filed & Partial Recovery Achieved" },
  { id: "case-3", category: "REAL ESTATE & RERA", title: "Builder-Buyer Delay Complaint — MahaRERA", description: "Represented a group of 18 homebuyers against a Nashik developer for 3-year delay in possession. Filed a consolidated complaint before MahaRERA, successfully establishing liability and securing compensation with interest under RERA.", outcome: "Result: Full Compensation + Interest Ordered" },
  { id: "case-4", category: "CIVIL LITIGATION", title: "Land Acquisition Compensation Enhancement", description: "Represented landowners whose agricultural land was acquired for a state infrastructure project at grossly undervalued compensation. DNL filed a reference under Section 18 of the LARR Act, resulting in a 3× enhanced compensation award.", outcome: "Result: 3× Compensation Enhancement" },
  { id: "case-5", category: "LABOUR LAW", title: "Wrongful Termination — Industrial Tribunal", description: "Defended a group of 32 workers retrenched without following mandatory procedure under the Industrial Disputes Act. Secured reinstatement orders along with full back-wages from the Maharashtra Industrial Tribunal.", outcome: "Result: Reinstatement + Back-wages Secured" },
  { id: "case-6", category: "COMPLIANCE & CORPORATE", title: "MSME Regulatory Compliance Audit", description: "Conducted a comprehensive legal compliance audit for a Nashik-based pharmaceutical MSME, identifying 14 regulatory gaps across Factories Act, GST, and ESIC obligations. Implemented a full compliance framework preventing potential penalties.", outcome: "Result: Full Compliance Framework Implemented" },
];

const defaultTestimonials: Testimonial[] = [
  { id: "test-1", quote: "D N Legal Associates handled our property dispute with exceptional professionalism. Mr. Hitesh Dashpute understood every nuance of our case and guided us step by step through the MahaRERA process. We got our full compensation with interest — something we thought was impossible.", author: "Ramesh Kulkarni", company: "Homebuyer, Nashik", caseType: "Real Estate — MahaRERA Complaint", rating: 5 },
  { id: "test-2", quote: "When our company faced an insolvency threat from a creditor, DNL stepped in and restructured our entire legal defence strategy. Their grasp of the IBC proceedings and their negotiation skills saved our business. We are now operating profitably thanks to the resolution plan they helped design.", author: "Suresh Patil", company: "Director, Manufacturing SME, Nashik", caseType: "Banking & Insolvency — IBC Defence", rating: 5 },
  { id: "test-3", quote: "My land was acquired by the government at a rate far below market value. DNL filed a reference petition and fought the case brilliantly. The final compensation was nearly three times the original award. I am deeply grateful to Mr. Sachin Raut for his dedication throughout this journey.", author: "Sharad Nimbalkar", company: "Farmer & Landowner, Nashik District", caseType: "Land Acquisition — Compensation Enhancement", rating: 5 },
  { id: "test-4", quote: "We were victims of an online fraud involving a significant amount. DNL not only helped us register the cyber crime complaint but also assisted in coordinating with investigators and pursuing civil recovery. Mr. Nitin Nikam's expertise in IT law made a complex situation feel manageable.", author: "Priya Deshmukh", company: "Business Owner, Nashik", caseType: "Cyber Crime — IT Act & Recovery", rating: 5 },
];

const defaultFaqs: FaqItem[] = [
  { id: "faq-1", question: "Do I have a case?", answer: "Determining whether you have a viable legal claim depends on the facts, applicable law, and available evidence. During a free initial consultation with DNL, our advocates will review your situation — whether it involves a property dispute, arbitration matter, labour issue, cyber fraud, or any other concern — and give you an honest, practical assessment of your legal position and options under Indian law." },
  { id: "faq-2", question: "How much will legal services cost?", answer: "Our fees are structured transparently based on the nature and complexity of your matter. For most civil and commercial matters, we offer consultation-based retainers with clear written engagement letters before commencing work. We believe in honest, upfront discussions on legal costs and always ensure our clients understand the fee structure." },
  { id: "faq-3", question: "What is the typical timeline for a legal matter in Maharashtra?", answer: "Timelines vary significantly by matter type. MahaRERA complaints often resolve within 6–12 months. Arbitration proceedings can conclude in 3–18 months depending on complexity. Civil court matters may take longer due to docket volumes. DNL works diligently to pursue every available interim remedy to protect your interests while the main matter proceeds." },
  { id: "faq-4", question: "What is the difference between arbitration and going to court?", answer: "Arbitration is a private, binding dispute resolution process outside the court system. It offers confidentiality, flexible scheduling, choice of arbitrator, faster timelines, and awards enforceable as court decrees. DNL advises clients on the most strategic forum for their dispute and includes robust arbitration clauses in commercial agreements we draft." },
  { id: "faq-5", question: "What should I do if I am a victim of cyber fraud?", answer: "Act immediately: preserve all digital evidence (screenshots, transaction receipts, communication records). Report the crime on the National Cyber Crime Reporting Portal (cybercrime.gov.in) or visit your nearest cyber crime police cell. Contact DNL to assist with FIR registration, coordinate with investigators, and pursue civil recovery proceedings." },
  { id: "faq-6", question: "How does DNL serve clients across Maharashtra from Nashik?", answer: "DNL's head office is in Nashik with extensive practice across Maharashtra including appearances before the Nashik District Court, Bombay High Court, NCLT Mumbai, MahaRERA, Maharashtra Industrial Tribunal, and various consumer forums. Our team also coordinates with local advocates in other districts when required." },
];

const defaultContactInfo: ContactInfo = {
  address: "B-12, Keshav-Akshay, 3rd Floor, B-Wing, Near State Bank Of India (SBI Lekhanagar), Nashik, Maharashtra, India, Pin-422009",
  phone1: "+91 93254 62134",
  phone2: "+91 75887 39705",
  email: "support@dnlegal.in",
  hoursWeekday: "Monday – Saturday: 10:00 AM – 6:00 PM",
  hoursWeekend: "Sunday: By Appointment Only",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3748.3!2d73.7898!3d20.0059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sDN+Legal+Associates!5e0!3m2!1sen!2sin!4v1234567890",
  whatsappNumber: "9325462134",
  instagramUrl: "https://instagram.com/dnlegal",
  linkedinUrl: "https://linkedin.com/company/dnlegal",
  facebookUrl: "https://facebook.com/dnlegal",
  twitterUrl: "https://twitter.com/dnlegal",
};

const defaultHeroContent: HeroContent = {
  headline: "Your Justice, Our Purpose",
  subheadline: "Nashik's trusted legal advocates — serving Maharashtra with integrity, expertise, and dedication.",
  badge: "D N LEGAL ASSOCIATES — NASHIK, MAHARASHTRA",
};

// ─── Helper ───────────────────────────────────────────────────────────────────
// Storage keys (v3 to avoid stale cached data)
const KEYS = {
  team: "dnl_v3_team",
  blogs: "dnl_v3_blogs",
  practiceAreas: "dnl_v3_practice_areas",
  caseHighlights: "dnl_v3_case_highlights",
  testimonials: "dnl_v3_testimonials",
  faqs: "dnl_v3_faqs",
  contactInfo: "dnl_v3_contact_info",
  heroContent: "dnl_v3_hero_content",
} satisfies Record<keyof Content, string>;

interface Content {
  team: TeamMember[];
  blogs: BlogPost[];
  practiceAreas: PracticeArea[];
  caseHighlights: CaseHighlight[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  contactInfo: ContactInfo;
  heroContent: HeroContent;
}

const DEFAULT_CONTENT: Content = {
  team: defaultTeam,
  blogs: defaultBlogs,
  practiceAreas: defaultPracticeAreas,
  caseHighlights: defaultCaseHighlights,
  testimonials: defaultTestimonials,
  faqs: defaultFaqs,
  contactInfo: defaultContactInfo,
  heroContent: defaultHeroContent,
};

// getSnapshot must return a referentially stable value for as long as nothing has
// changed, so the parsed result is memoised against the raw serialised storage.
let cachedRaw: string | null = null;
let cachedContent: Content = DEFAULT_CONTENT;

function readContent(): Content {
  let raw = "";
  const next: Record<string, unknown> = { ...DEFAULT_CONTENT };
  for (const name of Object.keys(KEYS) as (keyof Content)[]) {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEYS[name]);
    } catch {
      stored = null;
    }
    raw += `${stored}\u0000`;
    if (stored !== null) {
      try {
        next[name] = JSON.parse(stored);
      } catch {
        // Corrupt entry: keep the default for this slice.
      }
    }
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedContent = next as unknown as Content;
  }
  return cachedContent;
}

const contentStore = createStore<Content>({
  eventName: "dnl:content",
  read: readContent,
  serverValue: DEFAULT_CONTENT,
});

function save<K extends keyof Content>(key: K, value: Content[K]) {
  try {
    localStorage.setItem(KEYS[key], JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota): the session keeps working in memory.
  }
  contentStore.emit();
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ContentProvider({ children }: { children: React.ReactNode }) {
  // localStorage is a real external store: the server snapshot is the shipped default
  // content, and React swaps in the admin-edited version straight after hydration.
  // Reading it this way keeps server HTML (good for SEO) and avoids both a hydration
  // error and the cascading render that a setState-in-effect would cause.
  const {
    team, blogs, practiceAreas, caseHighlights, testimonials, faqs, contactInfo, heroContent,
  } = useSyncExternalStore(
    contentStore.subscribe,
    contentStore.getSnapshot,
    contentStore.getServerSnapshot
  );

  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(true);

  // ── Team ──────────────────────────────────────────────────────────────────
  const addMember = (m: Omit<TeamMember, "id">) => {
    save("team", [...team, { ...m, id: `member-${Date.now()}` }]);
  };
  const editMember = (id: string, m: Omit<TeamMember, "id">) => {
    save("team", team.map(x => x.id === id ? { ...m, id } : x));
  };
  const deleteMember = (id: string) => {
    save("team", team.filter(x => x.id !== id));
  };

  // ── Blog ──────────────────────────────────────────────────────────────────
  const addBlog = (b: Omit<BlogPost, "id">) => {
    save("blogs", [...blogs, { ...b, id: `blog-${Date.now()}` }]);
  };
  const editBlog = (id: string, b: Omit<BlogPost, "id">) => {
    save("blogs", blogs.map(x => x.id === id ? { ...b, id } : x));
  };
  const deleteBlog = (id: string) => {
    save("blogs", blogs.filter(x => x.id !== id));
  };

  // ── Practice Areas ────────────────────────────────────────────────────────
  const addPracticeArea = (p: Omit<PracticeArea, "id">) => {
    save("practiceAreas", [...practiceAreas, { ...p, id: `pa-${Date.now()}` }]);
  };
  const editPracticeArea = (id: string, p: Omit<PracticeArea, "id">) => {
    save("practiceAreas", practiceAreas.map(x => x.id === id ? { ...p, id } : x));
  };
  const deletePracticeArea = (id: string) => {
    save("practiceAreas", practiceAreas.filter(x => x.id !== id));
  };

  // ── Case Highlights ───────────────────────────────────────────────────────
  const addCaseHighlight = (c: Omit<CaseHighlight, "id">) => {
    save("caseHighlights", [...caseHighlights, { ...c, id: `case-${Date.now()}` }]);
  };
  const editCaseHighlight = (id: string, c: Omit<CaseHighlight, "id">) => {
    save("caseHighlights", caseHighlights.map(x => x.id === id ? { ...c, id } : x));
  };
  const deleteCaseHighlight = (id: string) => {
    save("caseHighlights", caseHighlights.filter(x => x.id !== id));
  };

  // ── Testimonials ──────────────────────────────────────────────────────────
  const addTestimonial = (t: Omit<Testimonial, "id">) => {
    save("testimonials", [...testimonials, { ...t, id: `test-${Date.now()}` }]);
  };
  const editTestimonial = (id: string, t: Omit<Testimonial, "id">) => {
    save("testimonials", testimonials.map(x => x.id === id ? { ...t, id } : x));
  };
  const deleteTestimonial = (id: string) => {
    save("testimonials", testimonials.filter(x => x.id !== id));
  };

  // ── FAQs ──────────────────────────────────────────────────────────────────
  const addFaq = (f: Omit<FaqItem, "id">) => {
    save("faqs", [...faqs, { ...f, id: `faq-${Date.now()}` }]);
  };
  const editFaq = (id: string, f: Omit<FaqItem, "id">) => {
    save("faqs", faqs.map(x => x.id === id ? { ...f, id } : x));
  };
  const deleteFaq = (id: string) => {
    save("faqs", faqs.filter(x => x.id !== id));
  };

  // ── Contact Info & Hero ───────────────────────────────────────────────────
  const updateContactInfo = (c: ContactInfo) => {
    save("contactInfo", c);
  };
  const updateHeroContent = (h: HeroContent) => {
    save("heroContent", h);
  };

  return (
    <ContentContext.Provider value={{
      team, addMember, editMember, deleteMember,
      blogs, addBlog, editBlog, deleteBlog,
      practiceAreas, addPracticeArea, editPracticeArea, deletePracticeArea,
      caseHighlights, addCaseHighlight, editCaseHighlight, deleteCaseHighlight,
      testimonials, addTestimonial, editTestimonial, deleteTestimonial,
      faqs, addFaq, editFaq, deleteFaq,
      contactInfo, updateContactInfo,
      heroContent, updateHeroContent,
      isConsultationOpen,
      openConsultation: () => setIsConsultationOpen(true),
      closeConsultation: () => setIsConsultationOpen(false),
      isDisclaimerOpen,
      openDisclaimer: () => setIsDisclaimerOpen(true),
      closeDisclaimer: () => setIsDisclaimerOpen(false),
    }}>
      {children}
      <ContactModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
      <DisclaimerModal isOpen={isDisclaimerOpen} onAccept={() => setIsDisclaimerOpen(false)} />
      <WhatsAppButton />
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
