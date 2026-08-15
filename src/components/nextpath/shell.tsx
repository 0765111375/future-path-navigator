import { Link, useRouterState } from "@tanstack/react-router";
import {
  Compass,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Map,
  MessageCircle,
  Route as RouteIcon,
  Sparkles,
  Trophy,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/roadmap", label: "My Roadmap", icon: Map },
  { to: "/careers", label: "Careers", icon: Compass },
  { to: "/skills", label: "Skills & Projects", icon: Wrench },
  { to: "/education", label: "Education", icon: GraduationCap },
  { to: "/opportunities", label: "Opportunities", icon: Trophy },
  { to: "/ai", label: "NextPath AI", icon: MessageCircle },
] as const;

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elevated">
        <RouteIcon className="size-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Next<span className="text-primary">Path</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <BrandMark />
          <nav className="scrollbar-none -mx-1 flex flex-1 items-center gap-1 overflow-x-auto px-1">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <Link
            to="/profile"
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <Sparkles className="size-4" /> My profile
          </Link>
          <Link
            to="/help"
            aria-label="Help"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
          >
            <HelpCircle className="size-4" />
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-4 text-xs text-muted-foreground">
        NextPath shows exploration recommendations built from a verified demo dataset. Always verify
        admission requirements, closing dates and funding rules with the official institution.
      </footer>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
