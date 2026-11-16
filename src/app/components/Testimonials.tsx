"use client";

import { useState, useEffect, useRef } from "react";
import { useContent } from "../context/ContentContext";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const { testimonials } = useContent();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const handleNext = () => {
    setIsFading(true);
    setTimeout(() => { setActiveIndex(p => (p + 1) % testimonials.length); setIsFading(false); }, 305);
  };
  const handlePrev = () => {
    setIsFading(true);
    setTimeout(() => { setActiveIndex(p => (p - 1 + testimonials.length) % testimonials.length); setIsFading(false); }, 305);
  };
  const handleDotClick = (idx: number) => {
    if (idx === activeIndex) return;
    setIsFading(true);
    setTimeout(() => { setActiveIndex(idx); setIsFading(false); }, 305);
  };

  useEffect(() => {
    stopTimer();
    timerRef.current = setInterval(handleNext, 6000);
    return () => stopTimer();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, testimonials.length]);

  if (!testimonials.length) return null;
  const current = testimonials[activeIndex] ?? testimonials[0];

  return (
    <section id="testimonials" ref={sectionRef} className={`${styles.section} ${isVisible ? styles.visible : ""}`}>
      <div className="container">
        <div className={styles.headerArea}>
          <span className={styles.subtitle}>CLIENT TESTIMONIALS</span>
          <h2 className="section-title text-center">What Our Clients Say</h2>
        </div>

        <div className={styles.carouselContainer}>
          <div className={styles.quoteMark} aria-hidden="true">&ldquo;</div>

          <div className={`${styles.slider} ${isFading ? styles.fadeOut : styles.fadeIn}`}>
            <div className={styles.stars}>
              {[...Array(current.rating)].map((_, i) => (
                <span key={i} className={styles.star}>★</span>
              ))}
            </div>
            <blockquote className={styles.quote}>&ldquo;{current.quote}&rdquo;</blockquote>
            <div className={styles.authorArea}>
              <cite className={styles.author}>{current.author}</cite>
              <span className={styles.company}>{current.company}</span>
              <span className={styles.caseType}>{current.caseType}</span>
            </div>
          </div>

          <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={() => { stopTimer(); handlePrev(); }} aria-label="Previous">←</button>
          <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={() => { stopTimer(); handleNext(); }} aria-label="Next">→</button>

          <div className={styles.dots}>
            {testimonials.map((_, idx) => (
              <button key={idx} className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ""}`} onClick={() => { stopTimer(); handleDotClick(idx); }} aria-label={`Slide ${idx + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
