"use client";

import { useState, useEffect } from "react";
import styles from "./DisclaimerModal.module.css";

interface DisclaimerModalProps {
  isOpen?: boolean;
  onAccept?: () => void;
}

export default function DisclaimerModal({ isOpen: externalIsOpen, onAccept: externalOnAccept }: DisclaimerModalProps) {
  const [internalOpen, setInternalOpen] = useState(true);
  const [agreed, setAgreed] = useState(true);
  const [showError, setShowError] = useState(false);

  // Always show on mount if no external control
  useEffect(() => {
    if (externalIsOpen === undefined) {
      setInternalOpen(true);
      setAgreed(true);
      setShowError(false);
    }
  }, [externalIsOpen]);

  // When the parent controls visibility (as ContentProvider does) that prop wins;
  // otherwise the component keeps its own open/closed state.
  const isOpen = externalIsOpen ?? internalOpen;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setAgreed(true);
      setShowError(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleProceed = () => {
    if (!agreed) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setInternalOpen(false);
    if (externalOnAccept) {
      externalOnAccept();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="disclaimer-title">
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h2 id="disclaimer-title" className={styles.title}>Disclaimer</h2>
        </div>

        <div className={styles.modalBody}>
          <p>
            The Bar Council of India does not permit advertisement or solicitation by advocates in any form or manner.
            By accessing this website, <strong>www.dnlegal.in</strong>, you acknowledge and confirm that you are seeking
            information relating to D N Legal Associates of your own accord and that there has been no form of solicitation,
            advertisement or inducement by D N Legal Associates or its members.
          </p>
          <p>
            The content of this website is for informational purposes only and should not be interpreted as soliciting or
            advertisement. No material/information provided on this website should be construed as legal advice. D N Legal Associates
            shall not be liable for consequences of any action taken by relying on the material/information provided on this
            website. The contents of this website are the intellectual property of D N Legal Associates.
          </p>
        </div>

        <div className={styles.modalFooter}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (e.target.checked) {
                  setShowError(false);
                }
              }}
              className={styles.checkbox}
            />
            <span>I accept the above.</span>
          </label>
          {showError && <div className={styles.error}>Please accept the above</div>}
          <button
            onClick={handleProceed}
            className={styles.acceptBtn}
            aria-label="Proceed to website"
          >
            PROCEED TO WEBSITE
          </button>
        </div>
      </div>
    </div>
  );
}
