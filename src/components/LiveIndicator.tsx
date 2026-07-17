export function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      Live
    </span>
  );
}
