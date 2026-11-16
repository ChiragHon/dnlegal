"use client";

import Header from "./Header";
import Footer from "./Footer";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <>
      <Header />
      <main style={{ flex: "1 0 auto" }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
