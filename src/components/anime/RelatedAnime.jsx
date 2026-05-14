"use client";

import { useRouter } from "next/navigation";

export default function RelatedAnime({ relations }) {
  const router = useRouter();

  if (!relations || relations.length === 0) {
    return (
      <p className="text-center py-16" style={{ color: "#c7c6c6" }}>
        No related anime found.
      </p>
    );
  }

  // Filter hanya yang tipe "anime" (bukan manga dll)
  const animeRelations = relations.filter((rel) =>
    rel.entry.some((e) => e.type === "anime")
  );

  return (
    <div className="flex flex-col gap-6">
      {animeRelations.map((relation) => (
        <div key={relation.relation}>
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#af8782" }}>
            {relation.relation}
          </h3>
          <div className="flex flex-col gap-2">
            {relation.entry
              .filter((e) => e.type === "anime")
              .map((entry) => (
                <button
                  key={entry.mal_id}
                  onClick={() => router.push(`/anime/${entry.mal_id}`)}
                  className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:scale-[1.01]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(229,9,20,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  }}
                >
                  <span className="text-sm font-medium" style={{ color: "#ffdad5" }}>
                    {entry.name}
                  </span>
                  <span className="text-xs ml-auto" style={{ color: "#af8782" }}>
                    Anime →
                  </span>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}