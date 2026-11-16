"use client";

import { useState, useEffect, useRef } from "react";
import { useContent } from "../context/ContentContext";
import styles from "./Faq.module.css";

export default function Faq() {
  const { faqs } = useContent();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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

  return (
    <section id="faq" ref={sectionRef} className={`${styles.section} ${isVisible ? styles.visible : ""}`}>
      <div className="container">
        <div className={styles.headerArea}>
          <span className={styles.subtitle}>COMMON QUESTIONS</span>
          <h2 className="section-title text-center">Frequently Asked Questions</h2>
          <p className={styles.sectionDesc}>
            Clear answers to the questions clients most commonly ask when facing legal challenges in Maharashtra.
          </p>
        </div>

        <div className={styles.accordionContainer}>
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div key={faq.id} className={`${styles.accordionItem} ${isOpen ? styles.itemOpen : ""}`} style={{ transitionDelay: `${idx * 0.1}s` }}>
                <button
                  className={styles.accordionHeader}
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <span className={styles.questionText}>{faq.question}</span>
                  <span className={styles.accordionIcon}>{isOpen ? "−" : "+"}</span>
                </button>
                <div id={`faq-answer-${faq.id}`} className={`${styles.contentWrapper} ${isOpen ? styles.contentWrapperOpen : ""}`}>
                  <div className={styles.content}>
                    <p className={styles.answerText}>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
