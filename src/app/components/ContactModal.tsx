"use client";

import { useState, useEffect } from "react";
import styles from "./ContactModal.module.css";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    practiceArea: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Disable scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset form states on close
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", practiceArea: "", message: "" });
        setErrors({});
        setIsSuccess(false);
      }, 300);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = "Full name is required.";
    
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required.";
    } else if (!/^[+]?[0-9\s-]{7,15}$/.test(formData.phone)) {
      tempErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.practiceArea) {
      tempErrors.practiceArea = "Please select a practice area.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          ×
        </button>

        {!isSuccess ? (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>Schedule Consultation</h2>
              <p className={styles.subtitle}>
                Complete the form below. A D N Legal Associates advocate will contact you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Name */}
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  placeholder="John Doe"
                />
                {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
              </div>

              {/* Contact Row */}
              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
                </div>
              </div>

              {/* Practice Area */}
              <div className={styles.formGroup}>
                <label htmlFor="practiceArea" className={styles.label}>Legal Concern *</label>
                <select
                  id="practiceArea"
                  name="practiceArea"
                  value={formData.practiceArea}
                  onChange={handleChange}
                  className={`${styles.select} ${errors.practiceArea ? styles.inputError : ""}`}
                >
                  <option value="">Select practice area...</option>
                  <option value="arbitration">Arbitration, Mediation &amp; Dispute Resolution</option>
                  <option value="banking">Banking, Insolvency &amp; Financial Restructuring</option>
                  <option value="compliance">Compliance Counselling</option>
                  <option value="cyber">Cyber Crime &amp; Information Technology</option>
                  <option value="pharma">Pharmaceutical / Hospitals &amp; Health Care</option>
                  <option value="manufacturing">Manufacturing &amp; Chemical Industry</option>
                  <option value="hospitality">Hospitality / Travel Industry</option>
                  <option value="litigation">Civil / Criminal Litigation</option>
                  <option value="labour">Labour Laws &amp; Employee Relations</option>
                  <option value="realestate">Real Estate, Construction &amp; SRA</option>
                </select>
                {errors.practiceArea && <span className={styles.errorMsg}>{errors.practiceArea}</span>}
              </div>

              {/* Message */}
              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Case Brief description (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={4}
                  placeholder="Provide a brief summary of your legal situation..."
                />
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing Request..." : "Request Case Evaluation"}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.successContainer}>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.successTitle}>Request Submitted</h2>
            <p className={styles.successText}>
              Thank you, <strong>{formData.name}</strong>. Your consultation request has been successfully filed with our intake coordinators.
            </p>
            <p className={styles.successSubtext}>
              An attorney specializing in <strong>{formData.practiceArea.toUpperCase()}</strong> will contact you via email ({formData.email}) or phone ({formData.phone}) within one business day.
            </p>
            <button onClick={onClose} className={styles.doneBtn}>
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
