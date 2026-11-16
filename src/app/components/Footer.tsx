"use client";

import Image from "next/image";
import Link from "next/link";
import { useContent } from "../context/ContentContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { openConsultation, openDisclaimer, contactInfo, practiceAreas } = useContent();

  const phone1Clean = contactInfo.phone1.replace(/\s/g, "");
  const phone2Clean = contactInfo.phone2.replace(/\s/g, "");

  return (
    <footer className={styles.footerContainer}>
      {/* 1. Pre-Footer Closing CTA Section */}
      <div className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <span className={styles.ctaSubtitle}>TAKE THE FIRST STEP</span>
            <h2 className={styles.ctaTitle}>Need Expert Legal Guidance?</h2>
            <p className={styles.ctaText}>
              Don&apos;t navigate complex legal challenges alone. Schedule a free consultation with
              D N Legal Associates — Nashik&apos;s trusted advocates for arbitration, real estate,
              civil litigation, cyber law &amp; more.
            </p>
            <button onClick={openConsultation} className={styles.ctaBtn}>
              Get Started Now
              <span className={styles.ctaArrow}>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Directory Footer */}
      <div className={styles.mainFooter}>
        <div className="container">
          <div className={styles.directoryGrid}>
            {/* Info Column */}
            <div className={styles.columnInfo}>
              <Link href="/" className={styles.logo} aria-label="D N Legal Associates Home">
                <Image
                  src="/images/logo.png"
                  alt="D N Legal Associates Logo"
                  width={180}
                  height={36}
                  className={styles.logoImage}
                />
              </Link>
              <p className={styles.companyBio}>
                D N Legal Associates (DNL) is a Nashik, Maharashtra-based law firm offering expert legal
                advisory, litigation, arbitration, and compliance services across 10+ practice areas.
              </p>
              <address className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📍</span>
                  <span>{contactInfo.address}</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📞</span>
                  <span>
                    <a href={`tel:${phone1Clean}`}>{contactInfo.phone1}</a>
                    <br />
                    <a href={`tel:${phone2Clean}`}>{contactInfo.phone2}</a>
                  </span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>✉</span>
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                </div>
              </address>

              <div className={styles.socialRow}>
                {contactInfo.whatsappNumber && (
                  <a
                    href={`https://wa.me/${contactInfo.whatsappNumber.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconBtn}
                    title="Chat on WhatsApp"
                    aria-label="WhatsApp"
                  >
                    💬
                  </a>
                )}
                {contactInfo.instagramUrl && (
                  <a
                    href={contactInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconBtn}
                    title="Follow on Instagram"
                    aria-label="Instagram"
                  >
                    📸
                  </a>
                )}
                {contactInfo.linkedinUrl && (
                  <a
                    href={contactInfo.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconBtn}
                    title="Connect on LinkedIn"
                    aria-label="LinkedIn"
                  >
                    💼
                  </a>
                )}
                {contactInfo.facebookUrl && (
                  <a
                    href={contactInfo.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconBtn}
                    title="Follow on Facebook"
                    aria-label="Facebook"
                  >
                    🌐
                  </a>
                )}
                {contactInfo.twitterUrl && (
                  <a
                    href={contactInfo.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialIconBtn}
                    title="Follow on X / Twitter"
                    aria-label="Twitter"
                  >
                    🐦
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Navigation</h3>
              <ul className={styles.linkList}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About &amp; Team</Link></li>
                <li><Link href="/practice-areas">Practice Areas</Link></li>
                <li><Link href="/insights">Insights</Link></li>
                <li><Link href="/contact">Contact &amp; FAQs</Link></li>
              </ul>
            </div>

            {/* Practice Areas (dynamic) */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Practice Areas</h3>
              <ul className={styles.linkList}>
                {practiceAreas.slice(0, 6).map(p => (
                  <li key={p.id}><Link href="/practice-areas">{p.title.split(",")[0].split("&")[0].trim()}</Link></li>
                ))}
              </ul>
            </div>

            {/* Office Hours (dynamic) */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Office Hours</h3>
              <div className={styles.hoursArea}>
                <div className={styles.hoursRow}>
                  <span className={styles.hoursDay}>{contactInfo.hoursWeekday.split(":")[0]}</span>
                  <span className={styles.hoursTime}>{contactInfo.hoursWeekday.split(": ").slice(1).join(": ")}</span>
                </div>
                <div className={styles.hoursRow}>
                  <span className={styles.hoursDay}>{contactInfo.hoursWeekend.split(":")[0]}</span>
                  <span className={styles.hoursTime}>{contactInfo.hoursWeekend.split(": ").slice(1).join(": ")}</span>
                </div>
                <p className={styles.emergencyDisclaimer}>
                  * For urgent matters, call {contactInfo.phone1} anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright Bar */}
      <div className={styles.bottomBar}>
        <div className="container">
          <div className={styles.bottomFlex}>
            <p className={styles.copyright}>
              © {currentYear} D N Legal Associates. All rights reserved. Bar Council of Maharashtra &amp; Goa.
            </p>
            <div className={styles.bottomLinks}>
              <a href="#">Privacy Policy</a>
              <span className={styles.divider}>|</span>
              <a href="#">Terms of Service</a>
              <span className={styles.divider}>|</span>
              <button onClick={openDisclaimer} className={styles.bottomLinkBtn}>Disclaimer</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
