export default function CollectionsLoading() {
  return (
    <div className="bg-brand-ivory text-brand-charcoal min-h-screen">
      {/* Header Block Shimmer */}
      <div className="border-b border-brand-gold/10 py-16 px-6 md:px-12 bg-[#1A1A18] text-brand-ivory">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-3 w-24 bg-brand-gold/20 animate-pulse" />
          <div className="h-10 w-64 bg-brand-ivory/15 animate-pulse" />
          <div className="h-4 w-96 bg-brand-grey/20 animate-pulse" />
        </div>
      </div>

      {/* Main Grid Wrapper */}
      <div className="max-w-7xl mx-auto py-12 px-6 md:px-12 space-y-8">
        
        {/* Sticky Filters Shimmer */}
        <div className="border-y border-brand-gold/15 py-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3">
            <div className="h-9 w-24 bg-brand-charcoal/10 animate-pulse" />
            <div className="h-9 w-24 bg-brand-charcoal/10 animate-pulse" />
            <div className="h-9 w-24 bg-brand-charcoal/10 animate-pulse" />
            <div className="h-9 w-24 bg-brand-charcoal/10 animate-pulse" />
          </div>
          <div className="h-6 w-20 bg-brand-charcoal/10 animate-pulse" />
        </div>

        {/* Product Cards Grid Shimmer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-[#1A1A18] border border-brand-gold/10 aspect-[3/4] flex flex-col justify-between p-6 space-y-4"
            >
              {/* Photo placeholder */}
              <div className="w-full flex-grow bg-brand-charcoal animate-pulse" />
              
              {/* Info placeholder */}
              <div className="space-y-2.5">
                <div className="h-4 w-3/4 bg-brand-ivory/15 animate-pulse" />
                <div className="h-3 w-1/2 bg-brand-gold/20 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
