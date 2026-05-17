"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
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
    <motion.section
      className={className || ""}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 md:px-16 mb-5">
        <h2
          className="text-xl md:text-2xl font-bold tracking-tight"
          style={{ color: "#ffdad5" }}
        >
          {title}
        </h2>
        {seeAllHref && (
          <motion.a
            href={seeAllHref}
            className="flex items-center gap-1 text-sm font-semibold"
            style={{ color: "#e50914" }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            See All <ChevronRight size={16} />
          </motion.a>
        )}
      </div>

      {/* Scrollable Row */}
      <div style={{ position: "relative" }}>
        {/* Arrow Left */}
        <motion.button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#ffdad5",
          }}
          whileHover={{ scale: 1.1, background: "rgba(229,9,20,0.8)" }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <ChevronLeft size={18} />
        </motion.button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            paddingLeft: "64px",
            paddingRight: "64px",
            paddingBottom: "16px",
          }}
        >
          {children}
        </div>

        {/* Arrow Right */}
        <motion.button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 z-20 w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#ffdad5",
          }}
          whileHover={{ scale: 1.1, background: "rgba(229,9,20,0.8)" }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </motion.section>
  );
}