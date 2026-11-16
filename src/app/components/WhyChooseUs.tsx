"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./WhyChooseUs.module.css";

interface CounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

function Counter({ target, suffix = "", duration = 1500 }: CounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    // Check if reduced motion is enabled
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (mediaQuery.matches) {
        setCount(target);
        return;
      }
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      }
    };
    frame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frame);
  }, [hasStarted, target, duration]);

  return <span ref={ref} className={styles.counterNum}>{count}{suffix}</span>;
}

export default function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="why-us" 
      ref={sectionRef} 
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
    >
      <div className="container">
        <div className={styles.headerArea}>
          <span className={styles.subtitle}>OUR ADVOCACY</span>
          <h2 className="section-title text-center">Why Choose DNL</h2>
          <p className={styles.sectionDesc}>
            Our reputation is built on deep legal knowledge, client-first approach, and an unwavering commitment to achieving the best outcomes across every practice area.
          </p>
        </div>

        <div className={styles.cardsGrid}>
          {/* Card 1 */}
          <div className={styles.card}>
            <div className={styles.iconContainer}>
              {/* Gavel SVG Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3M3 12l3-3m-3 3l3 3M19.5 12a48.654 48.654 0 010 3M3 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M3 12c0-1.232.046-2.453.138-3.662M9 5.25v13.5m6-13.5v13.5" />
              </svg>
            </div>
            <div className={styles.goldLine}></div>
            <h3 className={styles.statTitle}>
              <Counter target={6} suffix="+" /> Years Experience
            </h3>
            <p className={styles.cardText}>
              Over 6 years of dedicated legal counsel in Maharashtra — navigating complex civil, criminal, arbitration, and real estate matters with precision and expertise.
            </p>
          </div>

          {/* Card 2 */}
          <div className={styles.card}>
            <div className={styles.iconContainer}>
              {/* Chart SVG Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 18.375v-5.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-9.75zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <div className={styles.goldLine}></div>
            <h3 className={styles.statTitle}>
              <Counter target={10} suffix="+" /> Practice Areas
            </h3>
            <p className={styles.cardText}>
              From arbitration and real estate to cyber law and insolvency — DNL offers specialized, in-depth legal support across 10+ distinct areas of Indian law.
            </p>
          </div>

          {/* Card 3 */}
          <div className={styles.card}>
            <div className={styles.iconContainer}>
              {/* Shield SVG Icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714z" />
              </svg>
            </div>
            <div className={styles.goldLine}></div>
            <h3 className={styles.statTitle}>
              <Counter target={100} suffix="%" /> Client Focused
            </h3>
            <p className={styles.cardText}>
              Every client receives undivided attention. DNL selectively limits its caseload to ensure your matter is handled with complete dedication by our legal team.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
