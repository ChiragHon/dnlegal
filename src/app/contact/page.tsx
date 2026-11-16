"use client";

import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import Faq from "../components/Faq";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    caseType: "ARBITRATION",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        caseType: "ARBITRATION",
        message: "",
      });
    }, 1200);
  };

  return (
    <PageWrapper>
      <section className={styles.headerSection}>
        <div className="container text-center">
          <span className={styles.subtitle}>GET IN TOUCH</span>
          <h1 className={styles.title}>Contact Our Office</h1>
          <p className={styles.description}>
            Reach out to D N Legal Associates in Nashik for a consultation. We respond to all enquiries promptly.
          </p>
        </div>
      </section>

      <section className={styles.contactFormSection}>
        <div className="container">
          <div className={styles.grid}>
            {/* Left Column: Direct Info */}
            <div className={styles.infoCol}>
              <div className={styles.card}>
                <h2>DN Legal Headquarters</h2>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📍</span>
                  <div>
                    <strong>Address</strong>
                   <span>B-12 , Keshav-Akshay, 3rd Floor,<br />B-Wing, Near State Bank Of India<br />( SBI Lekhanagar) , Nashik, State- Maharashtra,India, Pin- 422009</span>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>📞</span>
                  <div>
                    <strong>Phone</strong>
                    <p>
                      <a href="tel:+919325462134">+91 93254 62134</a><br />
                      <a href="tel:+917588739705">+91 75887 39705</a>
                    </p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.icon}>✉</span>
                  <div>
                    <strong>Email</strong>
                    <p><a href="mailto:support@dnlegal.in">support@dnlegal.in</a></p>
                  </div>
                </div>
              </div>

              <div className={styles.emergencyCard}>
                <h3>Need Urgent Legal Help?</h3>
                <p>
                  Facing an urgent legal situation? Our team is available to assist you. Reach us directly
                  by phone for immediate guidance on your matter.
                </p>
                <a href="tel:+919325462134" className={styles.emergencyBtn}>
                  Call Now: +91 93254 62134
                </a>
              </div>
            </div>

            {/* Right Column: Embedded Intake Form */}
            <div className={styles.formCol}>
              <div className={styles.formCard}>
                <h2>Request a Free Evaluation</h2>
                <p>Fill out the form below and our intake coordinator will follow up within 2 hours.</p>

                {isSubmitted ? (
                  <div className={styles.successMessage}>
                    <div className={styles.successIcon}>✓</div>
                    <h3>Consultation Requested</h3>
                    <p>Thank you. A D N Legal Associates representative has received your file and will contact you shortly.</p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className={styles.resetBtn}
                    >
                      Submit Another Request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        required 
                      />
                    </div>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>Email Address *</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required 
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Phone Number *</label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(555) 555-5555"
                          required 
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Area of Concern *</label>
                      <select
                        name="caseType"
                        value={formData.caseType}
                        onChange={handleChange}
                      >
                        <option value="ARBITRATION">Arbitration, Mediation &amp; Dispute Resolution</option>
                        <option value="BANKING_INSOLVENCY">Banking, Insolvency &amp; Financial Restructuring</option>
                        <option value="COMPLIANCE">Compliance Counselling</option>
                        <option value="CYBER_CRIME">Cyber Crime &amp; Information Technology</option>
                        <option value="PHARMA_HEALTH">Pharmaceutical / Hospitals &amp; Health Care</option>
                        <option value="MANUFACTURING">Manufacturing &amp; Chemical Industry</option>
                        <option value="HOSPITALITY">Hospitality / Travel Industry</option>
                        <option value="LITIGATION">Civil / Criminal Litigation</option>
                        <option value="LABOUR">Labour Laws &amp; Employee Relations</option>
                        <option value="REAL_ESTATE">Real Estate, Construction &amp; SRA</option>
                        <option value="OTHER">Other / General Enquiry</option>
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Brief Case Outline *</label>
                      <textarea 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Describe your situation in 2-3 sentences..."
                        rows={4}
                        required 
                      />
                    </div>
                    <button 
                      type="submit" 
                      className={styles.submitBtn}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending Request..." : "Submit Case Details"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Faq />
    </PageWrapper>
  );
}
