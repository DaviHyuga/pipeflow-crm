import Link from "next/link"

const footerLinks = {
  Produto: [
    { label: "Funcionalidades", href: "/#features" },
    { label: "Preços", href: "/#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Empresa: [
    { label: "Sobre nós", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Carreiras", href: "#" },
    { label: "Contato", href: "#" },
  ],
  Legal: [
    { label: "Privacidade", href: "#" },
    { label: "Termos de uso", href: "#" },
    { label: "Cookies", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/8 pt-16 pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top: logo + links */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/30">
                <span className="text-sm font-bold text-primary-foreground">P</span>
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-foreground">PipeFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-48">
              O CRM visual que times de vendas adoram usar.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-3 border-t border-white/8 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} PipeFlow CRM. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground/40">
            <span>Feito com</span>
            <span className="text-red-400/70">♥</span>
            <span>para times de vendas</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
