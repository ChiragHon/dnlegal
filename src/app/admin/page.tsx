"use client";

// The <img> usages below are all previews of images the admin is editing: they are
// object/data URLs or arbitrary remote URLs chosen in this panel, so next/image
// cannot optimise them and would reject the remote ones without remotePatterns.
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useContent,
  TeamMember, BlogPost, PracticeArea,
  CaseHighlight, Testimonial, FaqItem
} from "../context/ContentContext";
import RichTextEditor from "./RichTextEditor";
import styles from "./admin.module.css";
import { createStore } from "../../lib/storageStore";

// ─── Icon Keys available for practice areas ────────────────────────────────
const ICON_KEYS = [
  "arbitration","banking","compliance","cyber","pharma",
  "manufacturing","hospitality","litigation","labour","realestate","default"
];

const AUTH_KEY = "dnl_admin_auth";

// The login flag lives in sessionStorage, so it is modelled as an external store.
// The server snapshot is always "logged out"; React re-renders with the real value
// immediately after hydration, which avoids a hydration mismatch.
const adminAuthStore = createStore<boolean>({
  eventName: "dnl:admin-auth",
  read: () => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "true";
    } catch {
      return false;
    }
  },
  serverValue: false,
});

type Tab = "dashboard"|"hero"|"team"|"blog"|"practice"|"cases"|"testimonials"|"faqs"|"contact";

// ─── Image Compression Helper ──────────────────────────────────────────────
function compressImage(file: File, maxWidth = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
    };
    reader.onerror = () => resolve("");
  });
}

export default function AdminDashboard() {
  const {
    team, addMember, editMember, deleteMember,
    blogs, addBlog, editBlog, deleteBlog,
    practiceAreas, addPracticeArea, editPracticeArea, deletePracticeArea,
    caseHighlights, addCaseHighlight, editCaseHighlight, deleteCaseHighlight,
    testimonials, addTestimonial, editTestimonial, deleteTestimonial,
    faqs, addFaq, editFaq, deleteFaq,
    contactInfo, updateContactInfo,
    heroContent, updateHeroContent,
  } = useContent();

  // ── Auth ──────────────────────────────────────────────────────────────────
  // sessionStorage is a real external store, so useSyncExternalStore lets React read
  // it after hydration without a setState-in-effect cascade or a hydration mismatch.
  const isLoggedIn = useSyncExternalStore(
    adminAuthStore.subscribe,
    adminAuthStore.getSnapshot,
    adminAuthStore.getServerSnapshot
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      sessionStorage.setItem(AUTH_KEY, "true");
      adminAuthStore.emit();
      setAuthError("");
    } else {
      setAuthError("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    adminAuthStore.emit();
  };

  // ── Active Tab ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  // ── Generic form state ────────────────────────────────────────────────────
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 2500);
  };

  // ── Hero Form ─────────────────────────────────────────────────────────────
  const [heroForm, setHeroForm] = useState(heroContent);
  // The form mirrors an external store, so it has to re-sync when the store changes
  // (after hydration, or when saved from another tab). This is the documented
  // "adjust state when a prop changes" case rather than a redundant render.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHeroForm(heroContent), [heroContent]);

  const saveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroContent(heroForm);
    flash("Hero content saved!");
  };

  // ── Contact Info Form ─────────────────────────────────────────────────────
  const [contactForm, setContactForm] = useState(contactInfo);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setContactForm(contactInfo), [contactInfo]);

  const saveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactInfo(contactForm);
    flash("Contact info saved!");
  };

  // ── Team ──────────────────────────────────────────────────────────────────
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string|null>(null);
  const [teamForm, setTeamForm] = useState({ name:"", role:"", bio:"", image:"/images/attorney1.png", linkedin:"", email:"" });
  const [imageType, setImageType] = useState<"default"|"url"|"upload">("default");
  const [customImage, setCustomImage] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.75);
      setCustomImage(compressed);
      setTeamForm(prev => ({ ...prev, image: compressed }));
      setFormError("");
    } catch {
      setFormError("Failed to process image.");
    }
  };

  const triggerEditTeam = (m: TeamMember) => {
    setEditingTeamId(m.id);
    const isDefault = ["/images/attorney1.png","/images/attorney2.png","/images/attorney3.png"].includes(m.image);
    setTeamForm({ name:m.name, role:m.role, bio:m.bio, image: isDefault ? m.image : "/images/attorney1.png", linkedin: m.linkedin==="0" ? "" : m.linkedin, email: m.email.replace("mailto:","") });
    if (isDefault) { setImageType("default"); setCustomImage(""); }
    else if (m.image?.startsWith("data:")) { setImageType("upload"); setCustomImage(m.image); }
    else { setImageType("url"); setCustomImage(m.image || ""); }
    setShowTeamForm(true);
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormError("");
    if (!teamForm.name.trim() || !teamForm.role.trim() || !teamForm.bio.trim()) {
      setFormError("Name, Role, and Bio are required."); return;
    }
    const finalImage = imageType === "default" ? teamForm.image : customImage;
    if (!finalImage) { setFormError("Please provide an image."); return; }
    const data = { ...teamForm, image: finalImage, linkedin: teamForm.linkedin || "#", email: teamForm.email.startsWith("mailto:") ? teamForm.email : `mailto:${teamForm.email}` };
    if (editingTeamId) { editMember(editingTeamId, data); } else { addMember(data); }
    setTeamForm({ name:"", role:"", bio:"", image:"/images/attorney1.png", linkedin:"", email:"" });
    setCustomImage(""); setImageType("default"); setShowTeamForm(false); setEditingTeamId(null);
    flash("Team member saved!");
  };

  // ── Blog ──────────────────────────────────────────────────────────────────
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string|null>(null);
  const [blogForm, setBlogForm] = useState({ title:"", category:"ARBITRATION & DISPUTE RESOLUTION", excerpt:"", content:"", author:"", date:"", readTime:"5 min read", image:"/images/office_boardroom.png" });
  const [blogImageType, setBlogImageType] = useState<"default"|"url"|"upload">("default");
  const [customBlogImage, setCustomBlogImage] = useState("");

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.75);
      setCustomBlogImage(compressed);
      setBlogForm(prev => ({ ...prev, image: compressed }));
      setFormError("");
    } catch {
      setFormError("Failed to process article image.");
    }
  };

  const triggerEditBlog = (b: BlogPost) => {
    setEditingBlogId(b.id);
    const isDefault = ["/images/office_boardroom.png","/images/office_library.png","/images/office_reception.png"].includes(b.image || "");
    setBlogForm({ title:b.title, category:b.category, excerpt:b.excerpt, content:b.content, author:b.author, date:b.date, readTime:b.readTime, image: isDefault ? (b.image || "/images/office_boardroom.png") : "/images/office_boardroom.png" });
    if (isDefault) { setBlogImageType("default"); setCustomBlogImage(""); }
    else if (b.image?.startsWith("data:")) { setBlogImageType("upload"); setCustomBlogImage(b.image); }
    else { setBlogImageType("url"); setCustomBlogImage(b.image || ""); }
    setShowBlogForm(true);
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormError("");
    if (!blogForm.title.trim() || !blogForm.excerpt.trim() || !blogForm.content.trim()) {
      setFormError("Title, Excerpt, and Content are required."); return;
    }
    const finalImage = blogImageType === "default" ? blogForm.image : customBlogImage;
    const dateVal = blogForm.date || new Date().toLocaleDateString("en-IN", { month:"long", day:"numeric", year:"numeric" });
    const data = { ...blogForm, image: finalImage || "/images/office_boardroom.png", date: dateVal, author: blogForm.author || team[0]?.name || "D N Legal Associates" };
    if (editingBlogId) { editBlog(editingBlogId, data); } else { addBlog(data); }
    setBlogForm({ title:"", category:"ARBITRATION & DISPUTE RESOLUTION", excerpt:"", content:"", author:"", date:"", readTime:"5 min read", image:"/images/office_boardroom.png" });
    setCustomBlogImage(""); setBlogImageType("default"); setShowBlogForm(false); setEditingBlogId(null);
    flash("Blog article saved!");
  };

  const handleDeleteBlogImage = (b: BlogPost) => {
    if (confirm(`Delete image for article "${b.title}"?`)) {
      editBlog(b.id, { ...b, image: "" });
      flash("Article image deleted!");
    }
  };

  const handleDeleteTeamImage = (m: TeamMember) => {
    if (confirm(`Delete photo for ${m.name}?`)) {
      editMember(m.id, { ...m, image: "" });
      flash("Advocate photo deleted!");
    }
  };

  const handleRowBlogImageUpload = async (b: BlogPost, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.75);
      editBlog(b.id, { ...b, image: compressed });
      flash(`Image uploaded and saved for "${b.title}"!`);
    } catch {
      setFormError("Failed to upload image.");
    }
  };

  const handleRowTeamImageUpload = async (m: TeamMember, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 800, 0.75);
      editMember(m.id, { ...m, image: compressed });
      flash(`Photo uploaded and saved for ${m.name}!`);
    } catch {
      setFormError("Failed to upload photo.");
    }
  };

  // ── Practice Areas ────────────────────────────────────────────────────────
  const [showPAForm, setShowPAForm] = useState(false);
  const [editingPAId, setEditingPAId] = useState<string|null>(null);
  const [paForm, setPAForm] = useState({ title:"", description:"", iconKey:"default", focusAreasRaw:"", strategy:"" });

  const triggerEditPA = (p: PracticeArea) => {
    setEditingPAId(p.id);
    setPAForm({ title:p.title, description:p.description, iconKey:p.iconKey, focusAreasRaw: p.focusAreas.join("\n"), strategy:p.strategy });
    setShowPAForm(true);
  };

  const handlePASubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormError("");
    if (!paForm.title.trim() || !paForm.description.trim()) { setFormError("Title and Description required."); return; }
    const focusAreas = paForm.focusAreasRaw.split("\n").map(s => s.trim()).filter(Boolean);
    const data = { title:paForm.title, description:paForm.description, iconKey:paForm.iconKey, focusAreas, strategy:paForm.strategy };
    if (editingPAId) { editPracticeArea(editingPAId, data); } else { addPracticeArea(data); }
    setPAForm({ title:"", description:"", iconKey:"default", focusAreasRaw:"", strategy:"" });
    setShowPAForm(false); setEditingPAId(null);
    flash("Practice area saved!");
  };

  // ── Case Highlights ───────────────────────────────────────────────────────
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [editingCaseId, setEditingCaseId] = useState<string|null>(null);
  const [caseForm, setCaseForm] = useState({ category:"", title:"", description:"", outcome:"" });

  const triggerEditCase = (c: CaseHighlight) => {
    setEditingCaseId(c.id);
    setCaseForm({ category:c.category, title:c.title, description:c.description, outcome:c.outcome });
    setShowCaseForm(true);
  };

  const handleCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormError("");
    if (!caseForm.title.trim() || !caseForm.description.trim()) { setFormError("Title and Description required."); return; }
    if (editingCaseId) { editCaseHighlight(editingCaseId, caseForm); } else { addCaseHighlight(caseForm); }
    setCaseForm({ category:"", title:"", description:"", outcome:"" });
    setShowCaseForm(false); setEditingCaseId(null);
    flash("Case highlight saved!");
  };

  // ── Testimonials ──────────────────────────────────────────────────────────
  const [showTestForm, setShowTestForm] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string|null>(null);
  const [testForm, setTestForm] = useState({ quote:"", author:"", company:"", caseType:"", rating:5 });

  const triggerEditTest = (t: Testimonial) => {
    setEditingTestId(t.id);
    setTestForm({ quote:t.quote, author:t.author, company:t.company, caseType:t.caseType, rating:t.rating });
    setShowTestForm(true);
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormError("");
    if (!testForm.quote.trim() || !testForm.author.trim()) { setFormError("Quote and Author are required."); return; }
    if (editingTestId) { editTestimonial(editingTestId, testForm); } else { addTestimonial(testForm); }
    setTestForm({ quote:"", author:"", company:"", caseType:"", rating:5 });
    setShowTestForm(false); setEditingTestId(null);
    flash("Testimonial saved!");
  };

  // ── FAQs ──────────────────────────────────────────────────────────────────
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string|null>(null);
  const [faqForm, setFaqForm] = useState({ question:"", answer:"" });

  const triggerEditFaq = (f: FaqItem) => {
    setEditingFaqId(f.id);
    setFaqForm({ question:f.question, answer:f.answer });
    setShowFaqForm(true);
  };

  const handleFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormError("");
    if (!faqForm.question.trim() || !faqForm.answer.trim()) { setFormError("Question and Answer required."); return; }
    if (editingFaqId) { editFaq(editingFaqId, faqForm); } else { addFaq(faqForm); }
    setFaqForm({ question:"", answer:"" });
    setShowFaqForm(false); setEditingFaqId(null);
    flash("FAQ saved!");
  };

  // ── Reset everything to defaults ──────────────────────────────────────────
  const resetAll = () => {
    if (!confirm("Reset ALL content to factory defaults? This cannot be undone.")) return;
    const keys = Object.keys(localStorage).filter(k => k.startsWith("dnl_v3"));
    keys.forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  // ═════════════════════════════════════════════════════════════════════════
  // LOGIN GATE
  // ═════════════════════════════════════════════════════════════════════════
  if (!isLoggedIn) {
    return (
      <div className={styles.loginOverlay}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <Image src="/images/logo.png" alt="DN Legal Logo" width={220} height={44} style={{ margin:"0 auto 12px", display:"block" }} priority />
            <p>Firm Administration Portal</p>
          </div>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            {authError && <div className={styles.authError}>{authError}</div>}
            <div className={styles.formGroup}>
              <label>Username</label>
              <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="admin" required />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" required />
            </div>
            <button type="submit" className={styles.loginBtn}>Sign In →</button>
          </form>
          <div className={styles.loginFooter}>
            <Link href="/" className={styles.backLink}>← Return to website</Link>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // ADMIN DASHBOARD
  // ═════════════════════════════════════════════════════════════════════════
  const NAV: { id: Tab; label: string; icon: string; count?: number }[] = [
    { id:"dashboard", label:"Dashboard", icon:"🏠" },
    { id:"hero",      label:"Hero & Banner", icon:"🖼️" },
    { id:"team",      label:"Team Members", icon:"👥", count: team.length },
    { id:"blog",      label:"Blog / Articles", icon:"📝", count: blogs.length },
    { id:"practice",  label:"Practice Areas", icon:"⚖️", count: practiceAreas.length },
    { id:"cases",     label:"Case Highlights", icon:"📊", count: caseHighlights.length },
    { id:"testimonials", label:"Testimonials", icon:"💬", count: testimonials.length },
    { id:"faqs",      label:"FAQs", icon:"❓", count: faqs.length },
    { id:"contact",   label:"Contact & Hours", icon:"📞" },
  ];

  return (
    <div className={styles.adminContainer}>
      {/* Top Header */}
      <header className={styles.adminHeader}>
        <div className={styles.headerTitleArea}>
          <Image src="/images/logo.png" alt="DN Legal Logo" width={140} height={28} priority style={{ display:"block" }} />
          <span className={styles.adminBadge}>ADMIN</span>
        </div>
        <div className={styles.headerActions}>
          <Link href="/" className={styles.viewSiteBtn} target="_blank">↗ View Site</Link>
          <button onClick={resetAll} className={styles.resetBtn}>Reset Defaults</button>
          <button onClick={handleLogout} className={styles.logoutBtn}>Log Out</button>
        </div>
      </header>

      <div className={styles.adminLayout}>
        {/* Sidebar Navigation */}
        <nav className={styles.sidebar}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => { setActiveTab(n.id); setFormError(""); setSuccessMsg(""); }}
              className={`${styles.navItem} ${activeTab === n.id ? styles.navItemActive : ""}`}
            >
              <span className={styles.navIcon}>{n.icon}</span>
              <span className={styles.navLabel}>{n.label}</span>
              {n.count !== undefined && <span className={styles.navBadge}>{n.count}</span>}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main className={styles.adminContent}>
          {successMsg && <div className={styles.successBanner}>✓ {successMsg}</div>}
          {formError && <div className={styles.errorBanner}>⚠ {formError}</div>}

          {/* ─── DASHBOARD ─────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Welcome to the Admin Panel</h2>
              <p className={styles.panelDesc}>Manage every piece of content on the D N Legal Associates website from this dashboard.</p>
              <div className={styles.statsGrid}>
                {NAV.filter(n => n.count !== undefined).map(n => (
                  <div key={n.id} className={styles.statCard} onClick={() => setActiveTab(n.id)}>
                    <span className={styles.statIcon}>{n.icon}</span>
                    <span className={styles.statCount}>{n.count}</span>
                    <span className={styles.statLabel}>{n.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.quickTips}>
                <h3>Quick Guide</h3>
                <ul>
                  <li>🖼️ <strong>Hero &amp; Banner</strong> — Edit the homepage headline, subheadline &amp; badge text</li>
                  <li>👥 <strong>Team</strong> — Add, edit or remove advocate profiles</li>
                  <li>📝 <strong>Blog</strong> — Publish and manage legal articles &amp; media</li>
                  <li>⚖️ <strong>Practice Areas</strong> — Manage all 10 legal service areas</li>
                  <li>📊 <strong>Case Highlights</strong> — Showcase notable client outcomes</li>
                  <li>💬 <strong>Testimonials</strong> — Add and manage client reviews</li>
                  <li>❓ <strong>FAQs</strong> — Edit frequently asked questions</li>
                  <li>📞 <strong>Contact &amp; Hours</strong> — Update address, phones, email &amp; hours</li>
                </ul>
              </div>
            </div>
          )}

          {/* ─── HERO ──────────────────────────────────────────────────── */}
          {activeTab === "hero" && (
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Hero &amp; Banner Settings</h2>
              <p className={styles.panelDesc}>Control the main banner text displayed on the homepage hero section.</p>
              <form onSubmit={saveHero} className={styles.adminForm}>
                <div className={styles.formGroup}>
                  <label>Main Headline *</label>
                  <input type="text" value={heroForm.headline} onChange={e => setHeroForm({...heroForm, headline: e.target.value})} placeholder="Your Justice, Our Purpose" required />
                  <span className={styles.hint}>The large animated text in the hero section</span>
                </div>
                <div className={styles.formGroup}>
                  <label>Subheadline / Tagline *</label>
                  <textarea rows={2} value={heroForm.subheadline} onChange={e => setHeroForm({...heroForm, subheadline: e.target.value})} placeholder="Nashik's trusted legal advocates..." required />
                  <span className={styles.hint}>Supporting text below the headline</span>
                </div>
                <div className={styles.formGroup}>
                  <label>Badge Text</label>
                  <input type="text" value={heroForm.badge} onChange={e => setHeroForm({...heroForm, badge: e.target.value})} placeholder="D N LEGAL ASSOCIATES — NASHIK, MAHARASHTRA" />
                  <span className={styles.hint}>Small label shown above the headline</span>
                </div>
                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitBtn}>Save Hero Content</button>
                </div>
              </form>
            </div>
          )}

          {/* ─── TEAM ──────────────────────────────────────────────────── */}
          {activeTab === "team" && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Team Members</h2>
                  <p className={styles.panelDesc}>Manage advocate profiles displayed on the website.</p>
                </div>
                {!showTeamForm && (
                  <button onClick={() => { setEditingTeamId(null); setTeamForm({ name:"", role:"", bio:"", image:"/images/attorney1.png", linkedin:"", email:"" }); setCustomImage(""); setImageType("default"); setShowTeamForm(true); }} className={styles.addBtn}>+ Add Member</button>
                )}
              </div>

              {showTeamForm && (
                <form onSubmit={handleTeamSubmit} className={styles.adminForm}>
                  <h3 className={styles.formTitle}>{editingTeamId ? "Edit Advocate Profile" : "Add New Advocate"}</h3>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>Full Name *</label>
                      <input type="text" name="name" value={teamForm.name} onChange={e=>setTeamForm({...teamForm, name:e.target.value})} placeholder="e.g. Mr. Hitesh B. Dashpute" required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Designation / Role *</label>
                      <input type="text" name="role" value={teamForm.role} onChange={e=>setTeamForm({...teamForm, role:e.target.value})} placeholder="e.g. SENIOR PARTNER" required />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Professional Bio *</label>
                    <textarea rows={3} name="bio" value={teamForm.bio} onChange={e=>setTeamForm({...teamForm, bio:e.target.value})} placeholder="Brief professional background and expertise..." required />
                  </div>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>Photo Source</label>
                      <select value={imageType} onChange={e=>{ const v = e.target.value as "default"|"url"|"upload"; setImageType(v); if(v==="default") setCustomImage(""); }}>
                        <option value="default">Default Portrait</option>
                        <option value="upload">Upload Image</option>
                        <option value="url">Custom URL / Path</option>
                      </select>
                    </div>
                    {imageType === "default" && (
                      <div className={styles.formGroup}>
                        <label>Choose Portrait</label>
                        <select name="image" value={teamForm.image} onChange={e=>setTeamForm({...teamForm, image:e.target.value})}>
                          <option value="/images/attorney1.png">Portrait 1</option>
                          <option value="/images/attorney2.png">Portrait 2</option>
                          <option value="/images/attorney3.png">Portrait 3</option>
                        </select>
                      </div>
                    )}
                    {imageType === "url" && (
                      <div className={styles.formGroup}>
                        <label>Image URL / Path</label>
                        <input type="text" value={customImage} onChange={e=>setCustomImage(e.target.value)} placeholder="https://... or /images/..." />
                      </div>
                    )}
                    {imageType === "upload" && (
                      <div className={styles.formGroup}>
                        <label>Upload Photo (max 2MB)</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className={styles.fileInput} />
                      </div>
                    )}
                  </div>
                  {(imageType === "upload" || imageType === "url") && customImage && (
                    <div className={styles.previewRow}>
                      <span className={styles.previewLabel}>Preview:</span>
                      <img src={customImage} alt="Preview" className={styles.previewImg} />
                      <button
                        type="button"
                        onClick={() => {
                          setCustomImage("");
                          setImageType("default");
                          setTeamForm({ ...teamForm, image: "/images/attorney1.png" });
                        }}
                        className={styles.deleteBtn}
                        style={{ padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        🗑️ Delete / Reset Photo
                      </button>
                    </div>
                  )}
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>LinkedIn URL</label>
                      <input type="url" value={teamForm.linkedin} onChange={e=>setTeamForm({...teamForm, linkedin:e.target.value})} placeholder="https://linkedin.com/in/..." />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email Address *</label>
                      <input type="text" value={teamForm.email} onChange={e=>setTeamForm({...teamForm, email:e.target.value})} placeholder="name@dnlegal.in" required />
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn}>{editingTeamId ? "Save Changes" : "Add Member"}</button>
                    <button type="button" onClick={() => { setShowTeamForm(false); setEditingTeamId(null); }} className={styles.cancelBtn}>Cancel</button>
                  </div>
                </form>
              )}

              <div className={styles.cardGrid}>
                {team.map(m => (
                  <div key={m.id} className={styles.memberCard}>
                    <img src={m.image} alt={m.name} className={styles.memberPhoto} />
                    <div className={styles.memberInfo}>
                      <strong>{m.name}</strong>
                      <span>{m.role}</span>
                      <p>{m.bio.substring(0, 80)}...</p>
                    </div>
                    <div className={styles.cardActions}>
                      <button onClick={() => triggerEditTeam(m)} className={styles.editBtn}>Edit Profile</button>
                      <label style={{ cursor: "pointer", background: "rgba(212, 175, 55, 0.15)", border: "1px solid #D4AF37", color: "#1a3a3a", borderRadius: "4px", padding: "4px 8px", fontSize: "0.78rem", fontWeight: 700, display: "inline-flex", alignItems: "center" }}>
                        📸 Upload Photo
                        <input type="file" accept="image/*" onChange={(e) => handleRowTeamImageUpload(m, e)} style={{ display: "none" }} />
                      </label>
                      {m.image && (
                        <button onClick={() => handleDeleteTeamImage(m)} className={styles.deleteBtn} title="Delete Photo">
                          🗑️ Delete Photo
                        </button>
                      )}
                      <button onClick={() => { if(confirm(`Delete ${m.name}?`)) deleteMember(m.id); }} className={styles.deleteBtn}>Delete Member</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── BLOG ──────────────────────────────────────────────────── */}
          {activeTab === "blog" && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Blog &amp; Articles</h2>
                  <p className={styles.panelDesc}>Publish and manage legal insights and media articles.</p>
                </div>
                {!showBlogForm && (
                  <button onClick={() => { setEditingBlogId(null); setBlogForm({ title:"", category:"ARBITRATION & DISPUTE RESOLUTION", excerpt:"", content:"", author:team[0]?.name||"", date:"", readTime:"5 min read", image:"/images/office_boardroom.png" }); setShowBlogForm(true); }} className={styles.addBtn}>+ Write Article</button>
                )}
              </div>

              {showBlogForm && (
                <form onSubmit={handleBlogSubmit} className={styles.adminForm}>
                  <h3 className={styles.formTitle}>{editingBlogId ? "Edit Article" : "New Article"}</h3>
                  <div className={styles.formGroup}>
                    <label>Article Title *</label>
                    <input type="text" value={blogForm.title} onChange={e=>setBlogForm({...blogForm,title:e.target.value})} placeholder="e.g. Understanding RERA Compliance in Maharashtra" required />
                  </div>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>Category *</label>
                      <select value={blogForm.category} onChange={e=>setBlogForm({...blogForm,category:e.target.value})}>
                        <option>ARBITRATION & DISPUTE RESOLUTION</option>
                        <option>REAL ESTATE LAW</option>
                        <option>CYBER CRIME & IT LAW</option>
                        <option>CIVIL & LAND LAW</option>
                        <option>LABOUR LAW</option>
                        <option>BANKING & INSOLVENCY</option>
                        <option>COMPLIANCE & CORPORATE</option>
                        <option>CRIMINAL LAW</option>
                        <option>GENERAL LEGAL</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Author *</label>
                      <select value={blogForm.author} onChange={e=>setBlogForm({...blogForm,author:e.target.value})}>
                        {team.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                        {!team.length && <option>D N Legal Associates</option>}
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>Read Time</label>
                      <input type="text" value={blogForm.readTime} onChange={e=>setBlogForm({...blogForm,readTime:e.target.value})} placeholder="5 min read" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Publish Date (leave blank for today)</label>
                      <input type="text" value={blogForm.date} onChange={e=>setBlogForm({...blogForm,date:e.target.value})} placeholder="June 27, 2026" />
                    </div>
                  </div>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>Article Cover Image Source</label>
                      <select
                        value={blogImageType}
                        onChange={(e) => {
                          const val = e.target.value as "default" | "url" | "upload";
                          setBlogImageType(val);
                          if (val === "default") setCustomBlogImage("");
                        }}
                      >
                        <option value="default">Stock Legal Images</option>
                        <option value="upload">Upload Custom Image</option>
                        <option value="url">Custom Image URL / Path</option>
                      </select>
                    </div>

                    {blogImageType === "default" && (
                      <div className={styles.formGroup}>
                        <label>Choose Stock Cover Image</label>
                        <select
                          value={blogForm.image}
                          onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                        >
                          <option value="/images/office_boardroom.png">Boardroom Conference</option>
                          <option value="/images/office_library.png">Law Library &amp; Books</option>
                          <option value="/images/office_reception.png">Firm Reception &amp; Office</option>
                        </select>
                      </div>
                    )}

                    {blogImageType === "url" && (
                      <div className={styles.formGroup}>
                        <label>Custom Image URL / Path</label>
                        <input
                          type="text"
                          value={customBlogImage}
                          onChange={(e) => setCustomBlogImage(e.target.value)}
                          placeholder="https://example.com/image.jpg or /images/..."
                        />
                      </div>
                    )}

                    {blogImageType === "upload" && (
                      <div className={styles.formGroup}>
                        <label>Upload Article Image (max 2.5MB)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBlogImageUpload}
                          className={styles.fileInput}
                        />
                      </div>
                    )}
                  </div>

                  <div className={styles.previewRow} style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                    <span className={styles.previewLabel}>Current Cover Image:</span>
                    <img
                      src={blogImageType === "default" ? blogForm.image : customBlogImage || blogForm.image}
                      alt="Article Cover Preview"
                      style={{ width: "120px", height: "70px", objectFit: "cover", borderRadius: "6px", border: "1.5px solid #D4AF37" }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCustomBlogImage("");
                        setBlogImageType("default");
                        setBlogForm({ ...blogForm, image: "/images/office_boardroom.png" });
                      }}
                      className={styles.deleteBtn}
                      style={{ padding: "6px 12px", fontSize: "0.8rem", cursor: "pointer" }}
                    >
                      🗑️ Delete / Reset Cover Image
                    </button>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Short Excerpt (shown on cards) *</label>
                    <textarea rows={2} value={blogForm.excerpt} onChange={e=>setBlogForm({...blogForm,excerpt:e.target.value})} placeholder="2-3 sentence summary..." required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Full Article Content (Word Rich Text Editor) *</label>
                    <RichTextEditor
                      value={blogForm.content}
                      onChange={(contentHtml) => setBlogForm({ ...blogForm, content: contentHtml })}
                      placeholder="Write or paste your article content here. Use the Word formatting tools above to apply Headings, Bold, Italic, Lists, Colors, Alignment, Links, and Blockquotes..."
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn}>{editingBlogId ? "Save Changes" : "Publish Article"}</button>
                    <button type="button" onClick={() => { setShowBlogForm(false); setEditingBlogId(null); }} className={styles.cancelBtn}>Cancel</button>
                  </div>
                </form>
              )}

              <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                  <thead><tr><th>Cover</th><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th>Actions</th></tr></thead>
                  <tbody>
                    {blogs.map(b => (
                      <tr key={b.id}>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                            {b.image ? (
                              <>
                                <img src={b.image} alt={b.title} style={{ width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px", border: "1.5px solid #D4AF37" }} />
                                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                  <label style={{ cursor: "pointer", background: "rgba(212, 175, 55, 0.15)", border: "1px solid #D4AF37", color: "#1a3a3a", borderRadius: "4px", padding: "2px 6px", fontSize: "0.68rem", fontWeight: 700 }}>
                                    📸 Upload / Edit
                                    <input type="file" accept="image/*" onChange={(e) => handleRowBlogImageUpload(b, e)} style={{ display: "none" }} />
                                  </label>
                                  <button
                                    onClick={() => handleDeleteBlogImage(b)}
                                    className={styles.deleteBtn}
                                    style={{ fontSize: "0.68rem", padding: "2px 6px" }}
                                    title="Delete Image"
                                  >
                                    🗑️ Delete
                                  </button>
                                </div>
                              </>
                            ) : (
                              <label style={{ cursor: "pointer", background: "#D4AF37", color: "#ffffff", borderRadius: "4px", padding: "4px 8px", fontSize: "0.72rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                ➕ Add Image
                                <input type="file" accept="image/*" onChange={(e) => handleRowBlogImageUpload(b, e)} style={{ display: "none" }} />
                              </label>
                            )}
                          </div>
                        </td>
                        <td className={styles.tableName}>{b.title}</td>
                        <td><span className={styles.categoryBadge}>{b.category}</span></td>
                        <td>{b.author}</td>
                        <td className={styles.tableDate}>{b.date}</td>
                        <td>
                          <div className={styles.actionBtns}>
                            <button onClick={() => triggerEditBlog(b)} className={styles.editBtn}>Edit</button>
                            <button onClick={() => { if(confirm(`Delete "${b.title}"?`)) deleteBlog(b.id); }} className={styles.deleteBtn}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── PRACTICE AREAS ────────────────────────────────────────── */}
          {activeTab === "practice" && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Practice Areas</h2>
                  <p className={styles.panelDesc}>Manage all legal service areas displayed on the website.</p>
                </div>
                {!showPAForm && (
                  <button onClick={() => { setEditingPAId(null); setPAForm({ title:"", description:"", iconKey:"default", focusAreasRaw:"", strategy:"" }); setShowPAForm(true); }} className={styles.addBtn}>+ Add Area</button>
                )}
              </div>

              {showPAForm && (
                <form onSubmit={handlePASubmit} className={styles.adminForm}>
                  <h3 className={styles.formTitle}>{editingPAId ? "Edit Practice Area" : "Add Practice Area"}</h3>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>Area Title *</label>
                      <input type="text" value={paForm.title} onChange={e=>setPAForm({...paForm,title:e.target.value})} placeholder="e.g. Arbitration & Mediation" required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Icon</label>
                      <select value={paForm.iconKey} onChange={e=>setPAForm({...paForm,iconKey:e.target.value})}>
                        {ICON_KEYS.map(k => <option key={k} value={k}>{k.charAt(0).toUpperCase()+k.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Short Description * (shown on card)</label>
                    <textarea rows={2} value={paForm.description} onChange={e=>setPAForm({...paForm,description:e.target.value})} placeholder="2-3 sentence overview..." required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Focus Areas (one per line)</label>
                    <textarea rows={5} value={paForm.focusAreasRaw} onChange={e=>setPAForm({...paForm,focusAreasRaw:e.target.value})} placeholder={"Domestic Arbitration\nMediation Services\nArbitral Award Enforcement"} />
                    <span className={styles.hint}>Each line becomes a bullet point in the detail modal</span>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Detailed Strategy / Approach (shown in modal)</label>
                    <textarea rows={5} value={paForm.strategy} onChange={e=>setPAForm({...paForm,strategy:e.target.value})} placeholder="Detailed description of your approach to this practice area..." />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn}>{editingPAId ? "Save Changes" : "Add Practice Area"}</button>
                    <button type="button" onClick={() => { setShowPAForm(false); setEditingPAId(null); }} className={styles.cancelBtn}>Cancel</button>
                  </div>
                </form>
              )}

              <div className={styles.tableWrapper}>
                <table className={styles.adminTable}>
                  <thead><tr><th>#</th><th>Practice Area</th><th>Icon</th><th>Focus Areas</th><th>Actions</th></tr></thead>
                  <tbody>
                    {practiceAreas.map((p, i) => (
                      <tr key={p.id}>
                        <td style={{ color: "var(--color-secondary)", fontWeight:700 }}>{i+1}</td>
                        <td className={styles.tableName}>{p.title}</td>
                        <td><span className={styles.categoryBadge}>{p.iconKey}</span></td>
                        <td className={styles.tableDate}>{p.focusAreas.length} areas</td>
                        <td>
                          <div className={styles.actionBtns}>
                            <button onClick={() => triggerEditPA(p)} className={styles.editBtn}>Edit</button>
                            <button onClick={() => { if(confirm(`Delete "${p.title}"?`)) deletePracticeArea(p.id); }} className={styles.deleteBtn}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── CASE HIGHLIGHTS ───────────────────────────────────────── */}
          {activeTab === "cases" && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Case Highlights</h2>
                  <p className={styles.panelDesc}>Showcase notable client outcomes and case results.</p>
                </div>
                {!showCaseForm && (
                  <button onClick={() => { setEditingCaseId(null); setCaseForm({ category:"", title:"", description:"", outcome:"" }); setShowCaseForm(true); }} className={styles.addBtn}>+ Add Case</button>
                )}
              </div>

              {showCaseForm && (
                <form onSubmit={handleCaseSubmit} className={styles.adminForm}>
                  <h3 className={styles.formTitle}>{editingCaseId ? "Edit Case" : "Add Case Highlight"}</h3>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>Category Label</label>
                      <input type="text" value={caseForm.category} onChange={e=>setCaseForm({...caseForm,category:e.target.value})} placeholder="e.g. REAL ESTATE & RERA" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Case Title *</label>
                      <input type="text" value={caseForm.title} onChange={e=>setCaseForm({...caseForm,title:e.target.value})} placeholder="e.g. Builder-Buyer Complaint — MahaRERA" required />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Case Description *</label>
                    <textarea rows={3} value={caseForm.description} onChange={e=>setCaseForm({...caseForm,description:e.target.value})} placeholder="Brief description of the case and DNL's role..." required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Outcome Statement</label>
                    <input type="text" value={caseForm.outcome} onChange={e=>setCaseForm({...caseForm,outcome:e.target.value})} placeholder="e.g. Result: Full Compensation + Interest Ordered" />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn}>{editingCaseId ? "Save Changes" : "Add Case"}</button>
                    <button type="button" onClick={() => { setShowCaseForm(false); setEditingCaseId(null); }} className={styles.cancelBtn}>Cancel</button>
                  </div>
                </form>
              )}

              <div className={styles.cardGrid}>
                {caseHighlights.map(c => (
                  <div key={c.id} className={styles.caseCard}>
                    <span className={styles.categoryBadge}>{c.category}</span>
                    <strong>{c.title}</strong>
                    <p>{c.description.substring(0, 100)}...</p>
                    <em className={styles.outcomeTag}>{c.outcome}</em>
                    <div className={styles.cardActions}>
                      <button onClick={() => triggerEditCase(c)} className={styles.editBtn}>Edit</button>
                      <button onClick={() => { if(confirm(`Delete "${c.title}"?`)) deleteCaseHighlight(c.id); }} className={styles.deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── TESTIMONIALS ──────────────────────────────────────────── */}
          {activeTab === "testimonials" && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Client Testimonials</h2>
                  <p className={styles.panelDesc}>Manage client reviews displayed in the testimonials carousel.</p>
                </div>
                {!showTestForm && (
                  <button onClick={() => { setEditingTestId(null); setTestForm({ quote:"", author:"", company:"", caseType:"", rating:5 }); setShowTestForm(true); }} className={styles.addBtn}>+ Add Testimonial</button>
                )}
              </div>

              {showTestForm && (
                <form onSubmit={handleTestSubmit} className={styles.adminForm}>
                  <h3 className={styles.formTitle}>{editingTestId ? "Edit Testimonial" : "Add Testimonial"}</h3>
                  <div className={styles.formGroup}>
                    <label>Client Quote *</label>
                    <textarea rows={4} value={testForm.quote} onChange={e=>setTestForm({...testForm,quote:e.target.value})} placeholder="What did the client say about working with DNL?" required />
                  </div>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>Client Name *</label>
                      <input type="text" value={testForm.author} onChange={e=>setTestForm({...testForm,author:e.target.value})} placeholder="e.g. Ramesh Kulkarni" required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Client Designation / Company</label>
                      <input type="text" value={testForm.company} onChange={e=>setTestForm({...testForm,company:e.target.value})} placeholder="e.g. Homebuyer, Nashik" />
                    </div>
                  </div>
                  <div className={styles.formGrid2}>
                    <div className={styles.formGroup}>
                      <label>Case Type / Service</label>
                      <input type="text" value={testForm.caseType} onChange={e=>setTestForm({...testForm,caseType:e.target.value})} placeholder="e.g. Real Estate — MahaRERA Complaint" />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Star Rating (1–5)</label>
                      <select value={testForm.rating} onChange={e=>setTestForm({...testForm,rating:Number(e.target.value)})}>
                        <option value={5}>★★★★★ (5)</option>
                        <option value={4}>★★★★☆ (4)</option>
                        <option value={3}>★★★☆☆ (3)</option>
                        <option value={2}>★★☆☆☆ (2)</option>
                        <option value={1}>★☆☆☆☆ (1)</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn}>{editingTestId ? "Save Changes" : "Add Testimonial"}</button>
                    <button type="button" onClick={() => { setShowTestForm(false); setEditingTestId(null); }} className={styles.cancelBtn}>Cancel</button>
                  </div>
                </form>
              )}

              <div className={styles.cardGrid}>
                {testimonials.map(t => (
                  <div key={t.id} className={styles.testimonialCard}>
                    <p className={styles.quotePreview}>&ldquo;{t.quote.substring(0, 120)}...&rdquo;</p>
                    <strong>{t.author}</strong>
                    <span>{t.company}</span>
                    <span className={styles.stars}>{"★".repeat(t.rating)}</span>
                    <div className={styles.cardActions}>
                      <button onClick={() => triggerEditTest(t)} className={styles.editBtn}>Edit</button>
                      <button onClick={() => { if(confirm(`Delete testimonial by ${t.author}?`)) deleteTestimonial(t.id); }} className={styles.deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── FAQS ──────────────────────────────────────────────────── */}
          {activeTab === "faqs" && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.panelTitle}>Frequently Asked Questions</h2>
                  <p className={styles.panelDesc}>Manage FAQ items shown on the homepage and contact page.</p>
                </div>
                {!showFaqForm && (
                  <button onClick={() => { setEditingFaqId(null); setFaqForm({ question:"", answer:"" }); setShowFaqForm(true); }} className={styles.addBtn}>+ Add FAQ</button>
                )}
              </div>

              {showFaqForm && (
                <form onSubmit={handleFaqSubmit} className={styles.adminForm}>
                  <h3 className={styles.formTitle}>{editingFaqId ? "Edit FAQ" : "Add FAQ"}</h3>
                  <div className={styles.formGroup}>
                    <label>Question *</label>
                    <input type="text" value={faqForm.question} onChange={e=>setFaqForm({...faqForm,question:e.target.value})} placeholder="e.g. What should I do if I am a victim of cyber fraud?" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Answer *</label>
                    <textarea rows={5} value={faqForm.answer} onChange={e=>setFaqForm({...faqForm,answer:e.target.value})} placeholder="Provide a clear, helpful answer..." required />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.submitBtn}>{editingFaqId ? "Save Changes" : "Add FAQ"}</button>
                    <button type="button" onClick={() => { setShowFaqForm(false); setEditingFaqId(null); }} className={styles.cancelBtn}>Cancel</button>
                  </div>
                </form>
              )}

              <div className={styles.faqList}>
                {faqs.map((f, i) => (
                  <div key={f.id} className={styles.faqItem}>
                    <div className={styles.faqContent}>
                      <span className={styles.faqNum}>Q{i+1}</span>
                      <div>
                        <strong>{f.question}</strong>
                        <p>{f.answer.substring(0, 120)}...</p>
                      </div>
                    </div>
                    <div className={styles.cardActions}>
                      <button onClick={() => triggerEditFaq(f)} className={styles.editBtn}>Edit</button>
                      <button onClick={() => { if(confirm(`Delete this FAQ?`)) deleteFaq(f.id); }} className={styles.deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── CONTACT & HOURS ───────────────────────────────────────── */}
          {activeTab === "contact" && (
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Contact Information &amp; Office Hours</h2>
              <p className={styles.panelDesc}>Update the contact details shown across the entire website — footer, contact page, and more.</p>
              <form onSubmit={saveContact} className={styles.adminForm}>
                <div className={styles.formGroup}>
                  <label>Office Address *</label>
                  <textarea rows={2} value={contactForm.address} onChange={e=>setContactForm({...contactForm,address:e.target.value})} required />
                </div>
                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label>Primary Phone *</label>
                    <input type="text" value={contactForm.phone1} onChange={e=>setContactForm({...contactForm,phone1:e.target.value})} placeholder="+91 93254 62134" required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Secondary Phone</label>
                    <input type="text" value={contactForm.phone2} onChange={e=>setContactForm({...contactForm,phone2:e.target.value})} placeholder="+91 75887 39705" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address *</label>
                  <input type="email" value={contactForm.email} onChange={e=>setContactForm({...contactForm,email:e.target.value})} placeholder="support@dnlegal.in" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Weekday Hours Label</label>
                  <input type="text" value={contactForm.hoursWeekday} onChange={e=>setContactForm({...contactForm,hoursWeekday:e.target.value})} placeholder="Monday – Saturday: 10:00 AM – 6:00 PM" />
                  <span className={styles.hint}>Format: &quot;Day Label: Time Range&quot;</span>
                </div>
                <div className={styles.formGroup}>
                  <label>Weekend / Holiday Hours Label</label>
                  <input type="text" value={contactForm.hoursWeekend} onChange={e=>setContactForm({...contactForm,hoursWeekend:e.target.value})} placeholder="Sunday: By Appointment Only" />
                </div>

                <h3 className={styles.formTitle} style={{ marginTop: "24px" }}>💬 WhatsApp &amp; Social Media Links</h3>
                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label>WhatsApp Number * (e.g. 9325462134)</label>
                    <input
                      type="text"
                      value={contactForm.whatsappNumber || ""}
                      onChange={e=>setContactForm({...contactForm, whatsappNumber: e.target.value})}
                      placeholder="9325462134"
                    />
                    <span className={styles.hint}>Floating WhatsApp chat button will connect to this number</span>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Instagram Profile Link</label>
                    <input
                      type="url"
                      value={contactForm.instagramUrl || ""}
                      onChange={e=>setContactForm({...contactForm, instagramUrl: e.target.value})}
                      placeholder="https://instagram.com/dnlegal"
                    />
                  </div>
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label>LinkedIn Page Link</label>
                    <input
                      type="url"
                      value={contactForm.linkedinUrl || ""}
                      onChange={e=>setContactForm({...contactForm, linkedinUrl: e.target.value})}
                      placeholder="https://linkedin.com/company/dnlegal"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Facebook Page Link</label>
                    <input
                      type="url"
                      value={contactForm.facebookUrl || ""}
                      onChange={e=>setContactForm({...contactForm, facebookUrl: e.target.value})}
                      placeholder="https://facebook.com/dnlegal"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Twitter / X Profile Link</label>
                  <input
                    type="url"
                    value={contactForm.twitterUrl || ""}
                    onChange={e=>setContactForm({...contactForm, twitterUrl: e.target.value})}
                    placeholder="https://twitter.com/dnlegal"
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitBtn}>Save Contact &amp; Social Info</button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
