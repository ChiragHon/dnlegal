"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./WhyUs.module.css";

interface ValueItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  side: "left" | "right";
  delay: number;
}

const values: ValueItem[] = [
  {
    id: "trust",
    label: "Trust",
    side: "left",
    delay: 0,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14 21C15.5 23.5 17 25 20 26C23 25 24.5 23.5 26 21"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        />
        <path
          d="M13 17L16 19.5L20 15L24 19.5L27 17"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "purpose",
    label: "Purpose",
    side: "left",
    delay: 0.15,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="3" fill="currentColor" />
        <line x1="20" y1="2" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="33" x2="20" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="20" x2="7" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="33" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "eye",
    label: "Eye on a details",
    side: "left",
    delay: 0.3,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 20C8 20 12 13 20 13C28 13 32 20 32 20C32 20 28 27 20 27C12 27 8 20 8 20Z"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="21" cy="19" r="1.2" fill="currentColor" />
        <line x1="27" y1="27" x2="34" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "integrity",
    label: "Integrity",
    side: "right",
    delay: 0,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
        <line x1="20" y1="10" x2="20" y2="30" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M13 14H27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M10 19C10 19 13 23 17 23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M30 19C30 19 27 23 23 23" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="10" y1="19" x2="30" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    id: "confidence",
    label: "Confidence",
    side: "right",
    delay: 0.15,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 12C20 12 14 15 14 22C14 25 16.5 27.5 20 28C23.5 27.5 26 25 26 22C26 15 20 12 20 12Z"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M17 21L19 23L23 19"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "inclusiveness",
    label: "Inclusiveness",
    side: "right",
    delay: 0.3,
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 12V20M20 20L14 26M20 20L26 26"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
        <circle cx="20" cy="11" r="2" fill="currentColor" />
        <circle cx="14" cy="27" r="2" fill="currentColor" />
        <circle cx="26" cy="27" r="2" fill="currentColor" />
      </svg>
    ),
  },
];

export default function WhyUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const leftValues = values.filter((v) => v.side === "left");
  const rightValues = values.filter((v) => v.side === "right");

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
    >
      {/* Background Image with overlay */}
      <div className={styles.bgWrapper}>
        <Image
          src="/images/office_boardroom.png"
          alt="Mumbai skyline"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          quality={80}
          priority={false}
        />
        <div className={styles.bgOverlay} />
      </div>

      {/* Animated floating particles */}
      <div className={styles.particles} aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={styles.particle} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>

      <div className={styles.inner}>
        {/* HEADING */}
        <div className={styles.headingBlock}>
          <h2 className={styles.mainTitle}>WHY US</h2>
          <div className={styles.titleUnderline}>
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
              <path
                d="M16 30V20C16 17 18 15 24 15C30 15 32 17 32 20V30"
                stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round"
              />
              <rect x="18" y="25" width="12" height="8" rx="1" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" />
              <line x1="18" y1="25" x2="22" y2="25" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
              <line x1="26" y1="25" x2="30" y2="25" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* MAIN ORBITAL LAYOUT */}
        <div className={styles.orbitalLayout}>
          {/* LEFT VALUES */}
          <div className={styles.valueCol}>
            {leftValues.map((v, i) => (
              <ValueCard key={v.id} item={v} index={i} isVisible={isVisible} directionOffset={-60} />
            ))}
          </div>

          {/* CENTER LOGO */}
          <div className={styles.centerLogo}>
            <div className={styles.logoRing} />
            <div className={styles.logoRing2} />
            <div className={styles.logoInner}>
              <Image
                src="/images/logo.png"
                alt="D N Legal Associates"
                width={90}
                height={90}
                style={{ objectFit: "contain" }}
              />
              <p className={styles.logoFirmName}>D N Legal Associates</p>
              <p className={styles.logoTagline}>Advocates, Counsellors &amp; Arbitrators</p>
            </div>
          </div>

          {/* RIGHT VALUES */}
          <div className={styles.valueCol}>
            {rightValues.map((v, i) => (
              <ValueCard key={v.id} item={v} index={i} isVisible={isVisible} directionOffset={60} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Individual Value Card ─── */
function ValueCard({
  item,
  index,
  isVisible,
  directionOffset,
}: {
  item: ValueItem;
  index: number;
  isVisible: boolean;
  directionOffset: number;
}) {
  const isLeft = item.side === "left";

  return (
    <div
      className={`${styles.valueCard} ${isLeft ? styles.valueCardLeft : styles.valueCardRight} ${isVisible ? styles.valueCardVisible : ""}`}
      style={{
        transitionDelay: isVisible ? `${0.4 + index * 0.18}s` : "0s",
        "--dx": `${directionOffset}px`,
      } as React.CSSProperties}
    >
      {isLeft ? (
        <>
          <span className={styles.valueLabel}>{item.label}</span>
          <div className={styles.iconBubble}>
            {item.icon}
            <div className={styles.iconPulse} />
          </div>
        </>
      ) : (
        <>
          <div className={styles.iconBubble}>
            {item.icon}
            <div className={styles.iconPulse} />
          </div>
          <span className={styles.valueLabel}>{item.label}</span>
        </>
      )}
      {/* Connector line toward center */}
      <div className={`${styles.connector} ${isLeft ? styles.connectorLeft : styles.connectorRight}`} />
    </div>
  );
}
