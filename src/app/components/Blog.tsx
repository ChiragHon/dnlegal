"use client";

// Blog artwork is admin-supplied: it can be a remote URL or a data: URL produced by
// the in-panel uploader. next/image would reject those without `images.remotePatterns`
// and offers no optimisation for data URLs, so plain <img> is the correct choice here.
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState, useRef } from "react";
import { useContent, BlogPost } from "../context/ContentContext";
import styles from "./Blog.module.css";

export default function Blog() {
  const { blogs } = useContent();
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
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

  // Escape key handler for article reading modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeBlog) {
        setActiveBlog(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeBlog]);

  // Prevent scroll when reading an article
  useEffect(() => {
    if (activeBlog) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [activeBlog]);

  return (
    <section 
      id="blog" 
      ref={sectionRef} 
      className={`${styles.section} ${isVisible ? styles.visible : ""}`}
    >
      <div className="container">
        <div className={styles.headerArea}>
          <span className={styles.subtitle}>FIRM INSIGHTS</span>
          <h2 className="section-title text-center">Legal Analysis & Briefs</h2>
          <p className={styles.sectionDesc}>
            Stay informed on recent developments in federal trials, corporate compliance, and intellectual property rights written by our legal experts.
          </p>
        </div>

        {blogs.length === 0 ? (
          <p className={styles.emptyText}>No blog posts available at this time.</p>
        ) : (
          <div className={styles.grid}>
            {blogs.map((post, idx) => (
              <div 
                key={post.id} 
                className={styles.card}
                onClick={() => setActiveBlog(post)}
                style={{ transitionDelay: `${idx * 0.1 + 0.45}s` }}
              >
                <div className={styles.cardMedia}>
                  <img
                    src={post.image || "/images/office_boardroom.png"}
                    alt={post.title}
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.cardHeader}>
                  <span className={styles.category}>{post.category}</span>
                  <span className={styles.readTime}>{post.readTime}</span>
                </div>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <div className={styles.cardFooter}>
                  <div className={styles.authorGroup}>
                    <span className={styles.authorIcon}>✍</span>
                    <span className={styles.authorName}>{post.author}</span>
                  </div>
                  <span className={styles.date}>{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Article Reading Modal */}
      {activeBlog && (
        <div className={styles.modalOverlay} onClick={() => setActiveBlog(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setActiveBlog(null)} aria-label="Close article">
              ×
            </button>
            <div className={styles.modalHeader}>
              {activeBlog.image && (
                <div className={styles.modalBanner}>
                  <img
                    src={activeBlog.image}
                    alt={activeBlog.title}
                    className={styles.modalBannerImage}
                  />
                </div>
              )}
              <div className={styles.metaRow}>
                <span className={styles.modalCategory}>{activeBlog.category}</span>
                <span className={styles.divider}>•</span>
                <span className={styles.modalReadTime}>{activeBlog.readTime}</span>
              </div>
              <h1 className={styles.modalTitle}>{activeBlog.title}</h1>
              <div className={styles.authorRow}>
                <div className={styles.authorBadge}>
                  <span className={styles.badgeText}>{activeBlog.author[0]}</span>
                </div>
                <div>
                  <div className={styles.authorLabel}>Written By</div>
                  <div className={styles.modalAuthor}>{activeBlog.author}</div>
                </div>
                <div className={styles.modalDateCol}>
                  <div className={styles.authorLabel}>Published</div>
                  <div className={styles.modalDate}>{activeBlog.date}</div>
                </div>
              </div>
            </div>
            <div className={styles.modalContent}>
              {/<[a-z][\s\S]*>/i.test(activeBlog.content) ? (
                <div className={styles.richArticleContent} dangerouslySetInnerHTML={{ __html: activeBlog.content }} />
              ) : (
                activeBlog.content.split("\n\n").map((para, index) => (
                  <p key={index} className={styles.modalParagraph}>
                    {para}
                  </p>
                ))
              )}
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setActiveBlog(null)} className={styles.backBtn}>
                Back to Insights
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
