"use client";

import PageWrapper from "../components/PageWrapper";
import Blog from "../components/Blog";
import styles from "./insights.module.css";

export default function InsightsPage() {
  return (
    <PageWrapper>
      <section className={styles.headerSection}>
        <div className="container text-center">
          <span className={styles.subtitle}>MEDIA &amp; ARTICLES</span>
          <h1 className={styles.title}>Legal Insights</h1>
          <p className={styles.description}>
            Stay informed on developments in arbitration, real estate law, cyber crime, land acquisition,
            and more — written by D N Legal Associates&apos; practising advocates based in Nashik, Maharashtra.
          </p>
        </div>
      </section>
      <Blog />
    </PageWrapper>
  );
}
