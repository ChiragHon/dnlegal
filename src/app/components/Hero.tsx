"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContent } from "../context/ContentContext";
import styles from "./Hero.module.css";

const BACKGROUND_IMAGES = [
  "/images/office_boardroom.png",
  "/images/office_library.png",
  "/images/office_reception.png",
];

// useSyncExternalStore gives a hydration-safe "is client" flag: the server and the
// first client render both see false, then React re-renders with true after hydration.
const noopSubscribe = () => () => {};
const isClientSnapshot = () => true;
const isServerSnapshot = () => false;

export default function Hero() {
  const { openConsultation, heroContent } = useContent();
  const mounted = useSyncExternalStore(noopSubscribe, isClientSnapshot, isServerSnapshot);
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    // Background cross-fade interval (6 seconds per slide)
    const bgTimer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000);

    return () => clearInterval(bgTimer);
  }, []);

  const headline = heroContent.headline;
  const subheadline = heroContent.subheadline;

  return (
    <section id="hero" className={styles.hero}>
      {/* Background Image Slider (Cross-Fader) */}
      <div className={styles.bgSlider}>
        {BACKGROUND_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`${styles.bgSlide} ${index === bgIndex ? styles.bgActive : ""}`}
            aria-hidden="true"
          >
            <Image
              src={src}
              alt="Apex Legal office background"
              fill
              priority={index === 0}
              className={styles.bgImage}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Floating Scales Background Vector Elements */}
      <div className={`${styles.floatingScale} ${styles.scale1}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 3v17M12 20h6m-6 0H6M4 8l4-2 4 2M4 8c0 3 2 5 4 5s4-2 4-5m8 0l-4-2-4 2m4 0c0 3 2 5 4 5s4-2 4-5" />
        </svg>
      </div>
      <div className={`${styles.floatingScale} ${styles.scale2}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 3v17M12 20h6m-6 0H6M4 8l4-2 4 2M4 8c0 3 2 5 4 5s4-2 4-5m8 0l-4-2-4 2m4 0c0 3 2 5 4 5s4-2 4-5" />
        </svg>
      </div>
      <div className={`${styles.floatingScale} ${styles.scale3}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 3v17M12 20h6m-6 0H6M4 8l4-2 4 2M4 8c0 3 2 5 4 5s4-2 4-5m8 0l-4-2-4 2m4 0c0 3 2 5 4 5s4-2 4-5" />
        </svg>
      </div>
      <div className={`${styles.floatingScale} ${styles.scale4}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 3v17M12 20h6m-6 0H6M4 8l4-2 4 2M4 8c0 3 2 5 4 5s4-2 4-5m8 0l-4-2-4 2m4 0c0 3 2 5 4 5s4-2 4-5" />
        </svg>
      </div>

      {/* Radial Gradient overlay to ensure text contrast */}
      <div className={styles.heroOverlay}></div>

      <div className="container">
        <div className={styles.heroContent}>
          {/* Badge */}
          <div className={`${styles.badge} ${mounted ? styles.animateFade : ""}`}>
            <span className={styles.badgeLine}></span>
            <span className={styles.badgeText}>{heroContent.badge}</span>
            <span className={styles.badgeLine}></span>
          </div>

          {/* Letter-by-letter Headline Reveal */}
          <h1 className={styles.headline}>
            {mounted ? (
              (() => {
                let charCount = 0;
                return headline.split(" ").map((word, wordIndex, arr) => (
                  <span key={wordIndex} className={styles.wordWrapper}>
                    {word.split("").map((char, charIndex) => {
                      const globalIndex = charCount++;
                      return (
                        <span
                          key={charIndex}
                          className={styles.char}
                          style={{ animationDelay: `${globalIndex * 0.04}s` }}
                        >
                          {char}
                        </span>
                      );
                    })}
                    {wordIndex < arr.length - 1 && (
                      <span
                        className={styles.char}
                        style={{ animationDelay: `${(charCount++) * 0.04}s` }}
                      >
                        &nbsp;
                      </span>
                    )}
                  </span>
                ));
              })()
            ) : (
              <span>{headline}</span>
            )}
          </h1>

          {/* Word-by-word Subheadline Reveal */}
          <p className={styles.subheadline}>
            {mounted ? (
              subheadline.split(" ").map((word, index) => (
                <span
                  key={index}
                  className={styles.word}
                  style={{ animationDelay: `${index * 0.15 + 1.2}s` }}
                >
                  {word}&nbsp;
                </span>
              ))
            ) : (
              <span>{subheadline}</span>
            )}
          </p>

          {/* CTA Buttons */}
          <div className={`${styles.buttonContainer} ${mounted ? styles.animateButtons : ""}`}>
            <button onClick={openConsultation} className={styles.primaryButton}>
              Schedule Free Consultation
              <span className={styles.arrowIcon}>→</span>
            </button>
            <Link href="/practice-areas" className={styles.secondaryButton}>
              Our Practice Areas
            </Link>
          </div>
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <div className={`${styles.scrollIndicator} ${mounted ? styles.animateFade : ""}`}>
        <span className={styles.scrollText}>SCROLL TO EXPLORE</span>
        <div className={styles.scrollLine}>
          <div className={styles.scrollDot}></div>
        </div>
      </div>
    </section>
  );
}
