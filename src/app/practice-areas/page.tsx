"use client";

import PageWrapper from "../components/PageWrapper";
import PracticeAreas from "../components/PracticeAreas";
import styles from "./practice.module.css";

export default function PracticeAreasPage() {
  return (
    <PageWrapper>
      <section className={styles.headerSection}>
        <div className="container text-center">
          <span className={styles.subtitle}>OUR SPECIALIZATIONS</span>
          <h1 className={styles.title}>Practice Areas</h1>
          <p className={styles.description}>
            D N Legal Associates provides expert legal services across 10 core areas of Indian law —
            from arbitration, real estate &amp; RERA, to cyber crime, insolvency, labour law, and civil
            litigation across Maharashtra.
          </p>
        </div>
      </section>
      <PracticeAreas />
    </PageWrapper>
  );
}
