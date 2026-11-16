"use client";

import { useContent } from "../context/ContentContext";
import styles from "./WhatsAppButton.module.css";

export default function WhatsAppButton() {
  const { contactInfo } = useContent();
  const rawNum = (contactInfo?.whatsappNumber || "9325462134").replace(/\D/g, "");
  const numWithCountry = rawNum.length === 10 ? `91${rawNum}` : rawNum;

  const whatsappUrl = `https://wa.me/${numWithCountry}?text=${encodeURIComponent(
    "Hello D N Legal Associates, I would like to inquire about legal consultation."
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappFloat}
      aria-label="Chat on WhatsApp with D N Legal Associates"
      title="Chat with us on WhatsApp"
    >
      <span className={styles.pulseRing}></span>
      <svg
        className={styles.whatsappIcon}
        viewBox="0 0 32 32"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 2A13.93 13.93 0 0 0 2 16a13.77 13.77 0 0 0 2.12 7.37L2 30l6.83-2.07A13.88 13.88 0 0 0 16 30a13.93 13.93 0 0 0 0-28zm0 25.43a11.45 11.45 0 0 1-5.83-1.59l-.42-.25-4.33 1.31 1.33-4.21-.28-.44A11.45 11.45 0 1 1 16 27.43zm6.31-8.58c-.35-.17-2.07-1-2.39-1.13s-.56-.17-.79.17-.91 1.13-1.12 1.36-.42.26-.77.09a9.7 9.7 0 0 1-2.86-1.77 10.72 10.72 0 0 1-1.98-2.47c-.2-.35 0-.54.17-.71s.35-.41.52-.61a2.36 2.36 0 0 0 .35-.59.64.64 0 0 0 0-.61c-.08-.17-.79-1.9-1.08-2.61s-.58-.59-.79-.6h-.67a1.3 1.3 0 0 0-.94.44A3.92 3.92 0 0 0 6 12.33a6.83 6.83 0 0 0 1.43 3.63A15.61 15.61 0 0 0 13.5 21.8c.84.36 1.5.58 2 .74a4.84 4.84 0 0 0 2.23.14 3.64 3.64 0 0 0 2.4-1.69 3 3 0 0 0 .21-1.69c-.09-.13-.35-.22-.7-.39z" />
      </svg>
      <span className={styles.tooltip}>Chat on WhatsApp</span>
    </a>
  );
}
