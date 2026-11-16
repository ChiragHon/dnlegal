"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./Team.module.css";

import { useContent } from "../context/ContentContext";

export default function Team() {
  const { team } = useContent();
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
      id="team" 
      ref={sectionRef} 
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
    >
      <div className="container">
        <div className={styles.headerArea}>
          <span className={styles.subtitle}>OUR EXPERTS</span>
          <h2 className="section-title text-center">Dedicated Legal Minds</h2>
          <p className={styles.sectionDesc}>
            Our partners bring deep specialization, trial experience, and unwavering dedication to every client&rsquo;s case.
          </p>
        </div>

        <div className={styles.grid}>
          {team.map((member, idx) => (
            <div 
              key={member.id} 
              className={styles.card}
              style={{ transitionDelay: `${idx * 0.15}s` }}
            >
              {/* Portrait Image Container */}
              <div className={styles.imageContainer}>
                <Image
                  src={member.image}
                  alt={`Portrait of Attorney ${member.name}`}
                  width={400}
                  height={400}
                  className={styles.image}
                  priority={idx === 0}
                  unoptimized
                />
                {/* Hover Overlay containing Social Info */}
                <div className={styles.overlay}>
                  <div className={styles.overlayContent}>
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.socialBtn}
                      aria-label={`${member.name} LinkedIn Profile`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                    <a 
                      href={member.email} 
                      className={styles.socialBtn}
                      aria-label={`Email ${member.name}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <path d="M22 6l-10 7L2 6" />
                      </svg>
                      <span>Contact</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Text Info */}
              <div className={styles.infoContainer}>
                <h3 className={styles.name}>{member.name}</h3>
                <span className={styles.role}>{member.role}</span>
                <p className={styles.bio}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
