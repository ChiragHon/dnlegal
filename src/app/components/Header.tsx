"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContent } from "../context/ContentContext";
import styles from "./Header.module.css";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { openConsultation } = useContent();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSolid = isScrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`${styles.header} ${isSolid ? styles.scrolled : ""}`}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.logo} aria-label="D N Legal Associates Home">
          <Image
            src="/images/logo.png"
            alt="D N Legal Associates Logo"
            width={200}
            height={40}
            className={styles.logoImage}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/about" className={styles.navLink}>About & Team</Link>
          <Link href="/practice-areas" className={styles.navLink}>Practice Areas</Link>
          <Link href="/insights" className={styles.navLink}>Insights</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
          <button onClick={openConsultation} className={styles.ctaButton}>
            Free Consultation
          </button>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button 
          className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerActive : ""}`} 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuActive : ""}`}>
        <nav className={styles.mobileNav}>
          <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/about" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>About & Team</Link>
          <Link href="/practice-areas" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Practice Areas</Link>
          <Link href="/insights" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Insights</Link>
          <Link href="/contact" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              openConsultation();
            }} 
            className={styles.mobileCtaButton}
          >
            Free Consultation
          </button>
        </nav>
      </div>
    </header>
  );
}
