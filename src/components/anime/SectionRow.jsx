"use client";

import { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function SectionRow({ title, children, seeAllHref, className }) {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  return (
    <section className={className || ""}>
      <div className="flex items-center justify-between px-5 md:px-16 mb-5">
        <h2 className="text-xl md:text-2xl font-semibold" style={{ color: "#ffdad5" }}>
          {title}
        </h2>
        {seeAllHref && (
          <a href={seeAllHref} style={{ color: "#e50914", fontSize: "14px" }}>
            See All
          </a>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <button
          onClick={scrollLeft}
          style={{
            position: "absolute",
            left: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#ffdad5",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <div
          ref={scrollRef}
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingBottom: "16px",
          }}
        >
          {children}
        </div>

        <button
          onClick={scrollRight}
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 20,
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.8)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#ffdad5",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
