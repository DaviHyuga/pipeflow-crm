export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
          <span className="text-[14px] font-bold text-primary-foreground">P</span>
        </div>
        <span className="text-[17px] font-semibold tracking-tight text-foreground">
          PipeFlow
        </span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
