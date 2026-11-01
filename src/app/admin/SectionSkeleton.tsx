export default function SectionSkeleton({ title = 'DATA STREAM' }: { title?: string }) {
  return (
    <div className="space-y-6 font-mono text-xs animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 border-b border-[#23232C] pb-4">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-[#1A1A24] rounded-sm" />
          <div className="h-4 w-72 bg-[#14141C] rounded-sm" />
        </div>
        <div className="h-10 w-36 bg-[#1A1A24] rounded-sm self-start sm:self-auto" />
      </div>

      <div className="text-[11px] text-[#E9470B] flex items-center gap-2">
        <span className="w-2 h-2 bg-[#E9470B] animate-ping" />
        <span>LOADING {title.toUpperCase()} // RETRIEVING OPTIMIZED STREAM...</span>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 bg-[#121217] border border-[#23232C] space-y-4">
            <div className="flex justify-between items-center border-b border-[#1E1E26] pb-3">
              <div className="h-5 w-40 bg-[#1C1C26] rounded-sm" />
              <div className="h-7 w-20 bg-[#1C1C26] rounded-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="h-10 bg-[#0E0E14] rounded-sm" />
              <div className="h-10 bg-[#0E0E14] rounded-sm" />
              <div className="h-10 bg-[#0E0E14] rounded-sm" />
              <div className="h-10 bg-[#0E0E14] rounded-sm" />
            </div>
            <div className="space-y-2">
              <div className="h-14 bg-[#0A0A0E] rounded-sm" />
              <div className="h-14 bg-[#0A0A0E] rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
