// ================================
// ANIME SKELETON
// Placeholder loading card
// ================================
export function AnimeCardSkeleton() {
  return (
    <div className="flex-none w-[160px] sm:w-[180px] md:w-[200px]">
      {/* Image skeleton */}
      <div
        className="skeleton rounded-xl mb-3"
        style={{ aspectRatio: "2/3", width: "100%" }}
      />
      {/* Title skeleton */}
      <div className="skeleton h-4 rounded-lg mb-2 w-4/5" />
      <div className="skeleton h-3 rounded-lg w-3/5" />
    </div>
  );
}

export function AnimeCardRankedSkeleton() {
  return (
    <div className="flex-none flex items-end gap-0">
      {/* Angka skeleton */}
      <div className="skeleton w-20 h-28 rounded-xl opacity-20" />
      {/* Card skeleton */}
      <div
        className="skeleton rounded-xl -ml-6"
        style={{ width: "140px", aspectRatio: "2/3" }}
      />
    </div>
  );
}