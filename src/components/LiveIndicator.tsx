export function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-ok">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ok" />
      </span>
      Live
    </span>
  );
}
