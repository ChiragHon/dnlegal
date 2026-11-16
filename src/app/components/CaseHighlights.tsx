"use client";

import { useEffect, useState, useRef } from "react";
import { useContent } from "../context/ContentContext";
import styles from "./CaseHighlights.module.css";

export default function CaseHighlights() {
  const { caseHighlights } = useContent();
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

  const col1 = caseHighlights.filter((_, i) => i % 2 === 0);
  const col2 = caseHighlights.filter((_, i) => i % 2 !== 0);

  return (
    <section id="cases" ref={sectionRef} className={`${styles.section} ${isVisible ? styles.visible : ""}`}>
      <div className="container">
        <div className={styles.headerArea}>
          <span className={styles.subtitle}>CLIENT OUTCOMES</span>
          <h2 className="section-title text-center">Recent Case Highlights</h2>
          <p className={styles.sectionDesc}>
            A record of determined advocacy and successful outcomes across arbitration, civil courts,
            MahaRERA, and industrial tribunals in Maharashtra.
          </p>
        </div>

        <div className={styles.masonryGrid}>
          <div className={styles.column}>
            {col1.map((c, idx) => (
              <div key={c.id} className={styles.card} style={{ transitionDelay: `${idx * 0.2}s` }}>
                <span className={styles.cardCategory}>{c.category}</span>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardDesc}>{c.description}</p>
                <div className={styles.cardOutcome}>
                  <span className={styles.outcomeLabel}>OUTCOME:</span>
                  <span className={styles.outcomeVal}>{c.outcome}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.column}>
            {col2.map((c, idx) => (
              <div key={c.id} className={styles.card} style={{ transitionDelay: `${idx * 0.2 + 0.1}s` }}>
                <span className={styles.cardCategory}>{c.category}</span>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardDesc}>{c.description}</p>
                <div className={styles.cardOutcome}>
                  <span className={styles.outcomeLabel}>OUTCOME:</span>
                  <span className={styles.outcomeVal}>{c.outcome}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
