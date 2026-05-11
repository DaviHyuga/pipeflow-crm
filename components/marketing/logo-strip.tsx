const companies = [
  { name: "VendaMax", style: "font-black tracking-tighter" },
  { name: "TechFlow", style: "font-bold" },
  { name: "InnovaGroup", style: "font-semibold tracking-tight" },
  { name: "PlusB2B", style: "font-black" },
  { name: "GrowthLab", style: "font-bold tracking-tight" },
  { name: "SalesEdge", style: "font-semibold" },
]

export function LogoStrip() {
  return (
    <section className="py-14 border-y border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground/40 mb-8">
          Confiado por times de vendas em toda parte
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {companies.map((co) => (
            <span
              key={co.name}
              className={`text-base text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors select-none ${co.style}`}
            >
              {co.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
