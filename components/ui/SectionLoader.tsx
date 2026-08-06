export function SectionLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        <span className="text-xs text-slate-500 tracking-widest uppercase font-bold">Loading</span>
      </div>
    </div>
  );
}
