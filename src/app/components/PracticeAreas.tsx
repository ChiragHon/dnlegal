"use client";

import { useEffect, useState, useRef } from "react";
import { useContent } from "../context/ContentContext";
import styles from "./PracticeAreas.module.css";

// Icon map — keeps SVGs in component, not localStorage
const ICONS: Record<string, React.ReactNode> = {
  arbitration: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17M12 20h6m-6 0H6M4 8l4-2 4 2M4 8c0 3 2 5 4 5s4-2 4-5m8 0l-4-2-4 2m4 0c0 3 2 5 4 5s4-2 4-5" />
    </svg>
  ),
  banking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  ),
  compliance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
    </svg>
  ),
  cyber: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
    </svg>
  ),
  pharma: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  manufacturing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
    </svg>
  ),
  hospitality: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
    </svg>
  ),
  litigation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5M12 3v3M3 21h18" />
    </svg>
  ),
  labour: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  realestate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
};

export default function PracticeAreas() {
  const { practiceAreas } = useContent();
  const [activeArea, setActiveArea] = useState<typeof practiceAreas[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeArea) setActiveArea(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeArea]);

  useEffect(() => {
    document.body.style.overflow = activeArea ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [activeArea]);

  return (
    <section id="practice-areas" ref={sectionRef} className={`${styles.section} ${isVisible ? styles.visible : ""}`}>
      <div className="container">
        <div className={styles.headerArea}>
          <span className={styles.subtitle}>AREAS OF PRACTICE</span>
          <h2 className="section-title text-center">Comprehensive Legal Solutions</h2>
          <p className={styles.sectionDesc}>
            D N Legal Associates provides highly specialised legal services across {practiceAreas.length} core practice areas —
            serving individuals, businesses, and institutions across Maharashtra with expertise and integrity.
          </p>
        </div>

        <div className={styles.grid}>
          {practiceAreas.map((area, idx) => (
            <div
              key={area.id}
              className={styles.card}
              style={{ transitionDelay: `${idx * 0.08 + 0.3}s` }}
              onClick={() => setActiveArea(area)}
            >
              <div className={styles.cardHeader}>
                <div className={styles.icon}>{ICONS[area.iconKey] ?? ICONS.default}</div>
                <h3 className={styles.cardTitle}>{area.title}</h3>
              </div>
              <p className={styles.cardDesc}>{area.description}</p>
              <div className={styles.cardLink}>
                <span>Learn More</span>
                <span className={styles.arrow}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeArea && (
        <div className={styles.modalOverlay} onClick={() => setActiveArea(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setActiveArea(null)} aria-label="Close">×</button>
            <div className={styles.modalHeader}>
              <div className={styles.modalIconContainer}>{ICONS[activeArea.iconKey] ?? ICONS.default}</div>
              <div>
                <span className={styles.modalSubtitle}>LEGAL PRACTICE</span>
                <h1 className={styles.modalTitle}>{activeArea.title}</h1>
              </div>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.strategyBlock}>
                <h3>Our Approach</h3>
                <p>{activeArea.strategy}</p>
              </div>
              <div className={styles.focusBlock}>
                <h3>Key Focus Areas</h3>
                <ul className={styles.focusList}>
                  {activeArea.focusAreas.map((item, i) => (
                    <li key={i}>
                      <span className={styles.bulletCheck}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setActiveArea(null)} className={styles.backBtn}>Close Overview</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
