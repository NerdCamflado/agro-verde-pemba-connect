import { Link } from "@tanstack/react-router";
import { Leaf, Menu } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useEhAdmin, useSessao } from "@/hooks/useSessao";

const LINKS = [
  { to: "/", label: "Início" },
  { to: "/produtos", label: "Produtos" },
] as const;

export function Cabecalho() {
  const { utilizador } = useSessao();
  const { data: ehAdmin } = useEhAdmin(utilizador?.id);
  const [aberto, setAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold">AGROVERDE</span>
            <span className="block text-[11px] text-muted-foreground">
              Conectando produtores ao mercado
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {ehAdmin ? (
            <Link
              to="/admin"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Administração
            </Link>
          ) : null}
          {utilizador ? (
            <Button asChild size="sm" className="ml-2">
              <Link to="/painel">Meu painel</Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="ml-2">
              <Link to="/auth">Entrar / Registar</Link>
            </Button>
          )}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Abrir menu"
          onClick={() => setAberto((v) => !v)}
        >
          <Menu className="size-5" />
        </Button>
      </div>

      {aberto ? (
        <div className="border-t border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setAberto(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            {ehAdmin ? (
              <Link
                to="/admin"
                onClick={() => setAberto(false)}
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
              >
                Administração
              </Link>
            ) : null}
            <Link
              to={utilizador ? "/painel" : "/auth"}
              onClick={() => setAberto(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-secondary"
            >
              {utilizador ? "Meu painel" : "Entrar / Registar"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
