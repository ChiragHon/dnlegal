"use client";

import { useEffect, useRef, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import Team from "../components/Team";
import styles from "./about.module.css";

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [valuesVisible, setValuesVisible] = useState(false);

  useEffect(() => {
    const targets: [React.RefObject<HTMLElement | null>, (v: boolean) => void][] = [
      [heroRef, setHeroVisible],
      [storyRef, setStoryVisible],
      [valuesRef, setValuesVisible],
    ];
    const observers = targets.map(([ref, setVisible]) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
        { threshold: 0.1 }
      );
      if (ref.current) obs.observe(ref.current);
      return obs;
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <PageWrapper>
      {/* ── Page Hero ─────────────────────────────── */}
      <section
        ref={heroRef}
        className={`${styles.introSection} ${heroVisible ? styles.sectionVisible : ""}`}
      >
        <div className="container">
          <span className={styles.subtitle}>ABOUT OUR FIRM</span>
          <h1 className={styles.title}>D N Legal Associates</h1>
          <div className={styles.divider}></div>

          <div className={styles.grid}>
            <div className={styles.content}>
              <p>
                <strong>D N Legal Associates (DNL)</strong> is a Maharashtra (Nashik) based law firm with over
                6 years of experience across various fields of law. Over the years, DNL has grown to having
                offices located in Maharashtra and has succeeded in earning elite and respected clients with
                its deep-rooted culture to offer a unique blend of high-quality legal advisory.
              </p>
              <p>
                DNL has a dedicated panel of legal professionals with profound knowledge and enormous
                experience servicing the legal needs of our well-established client portfolios. DNL also
                handles arbitration and conciliation cases for fair negotiations and amicable closure between
                parties.
              </p>
              <p>
                DNL has been growing enormously and as a service to the society and in the larger interest
                of the public, DNL has represented prominent citizen groups and non-governmental
                organizations — setting various precedents with successful victories.
              </p>
              <p className={styles.affiliation}>
                Currently affiliated with the <strong>Bar Council of Maharashtra and Goa</strong>.
              </p>
            </div>

            <div className={styles.sidebar}>
              <div className={styles.statCard}>
                <span className={styles.statNum}>6+</span>
                <span className={styles.statLabel}>Years of Legal Practice</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>4</span>
                <span className={styles.statLabel}>Expert Legal Professionals</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>10+</span>
                <span className={styles.statLabel}>Practice Areas</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>MH</span>
                <span className={styles.statLabel}>Maharashtra Bar Affiliated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Story / Mission ───────────────────── */}
      <section
        ref={storyRef}
        className={`${styles.storySection} ${storyVisible ? styles.sectionVisible : ""}`}
      >
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyCard}>
              <div className={styles.storyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.5M4.5 21V10.5M12 3v3M3 21h18" />
                </svg>
              </div>
              <h3>Head Office</h3>
              <address>
                B-12, Keshav-Akshay, 3rd Floor, B-Wing,<br />
                Near State Bank of India (SBI Lekhanagar),<br />
                Nashik, Maharashtra, India — Pin 422009
              </address>
            </div>

            <div className={styles.storyCard}>
              <div className={styles.storyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <h3>Contact Us</h3>
              <p>
                <a href="tel:+919325462134">+91 93254 62134</a><br />
                <a href="tel:+917588739705">+91 75887 39705</a><br />
                <a href="mailto:support@dnlegal.in">support@dnlegal.in</a>
              </p>
            </div>

            <div className={styles.storyCard}>
              <div className={styles.storyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
                </svg>
              </div>
              <h3>Bar Affiliation</h3>
              <p>
                Affiliated with the <strong>Bar Council of Maharashtra and Goa</strong>. DNL upholds the
                highest standards of professional ethics and legal excellence across all practice areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Values ────────────────────────────── */}
      <section
        ref={valuesRef}
        className={`${styles.valuesSection} ${valuesVisible ? styles.sectionVisible : ""}`}
      >
        <div className="container">
          <span className={styles.subtitle}>OUR VALUES</span>
          <h2 className={styles.valuesTitle}>
            What Shapes Us
          </h2>
          <p className={styles.valuesDesc}>
            While we continue to shape the future of our firm and evolve long relationships with our
            clientele, we believe in creating value through our deepest strengths and an intense focus on
            understanding our clients&#39; needs.
          </p>

          <div className={styles.valuesGrid}>
            {[
              { label: "Integrity", desc: "We maintain unwavering honesty and ethical standards in every case, every conversation, and every decision." },
              { label: "Purpose", desc: "Every legal strategy we craft is driven by a clear purpose — to achieve the best possible outcome for our client." },
              { label: "Trust", desc: "Our clients trust us with their most sensitive matters. We honour that trust with confidentiality and dedication." },
              { label: "Eye for a Detail", desc: "Legal victories are often found in the details. We meticulously examine every document, clause, and precedent." },
              { label: "Confidence", desc: "We represent our clients with conviction and courage, both in negotiations and in courtrooms across Maharashtra." },
              { label: "Cultural Diversity", desc: "We embrace clients from all walks of life, bringing inclusive perspectives to deliver justice without boundaries." },
            ].map((v, i) => (
              <div
                key={v.label}
                className={styles.valueCard}
                style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
              >
                <span className={styles.valueLabel}>{v.label}</span>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Section ──────────────────────────── */}
      <Team />
    </PageWrapper>
  );
}
