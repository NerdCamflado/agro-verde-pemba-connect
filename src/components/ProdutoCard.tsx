import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

import { formatarMT, type Produto } from "@/lib/agroverde";

export function ProdutoCard({ produto }: { produto: Produto }) {
  return (
    <Link
      to="/produtos/$id"
      params={{ id: produto.id }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-4/3 overflow-hidden bg-muted">
        {produto.imagem_url ? (
          <img
            src={produto.imagem_url}
            alt={produto.nome}
            loading="lazy"
            width={1024}
            height={768}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            Sem fotografia
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-tight">{produto.nome}</h3>
          {produto.categorias ? (
            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              {produto.categorias.nome}
            </span>
          ) : null}
        </div>
        <p className="text-lg font-semibold text-primary">
          {formatarMT(produto.preco)}
          <span className="text-sm font-normal text-muted-foreground"> / {produto.unidade}</span>
        </p>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5" /> {produto.localizacao}
        </p>
        {produto.profiles ? (
          <p className="text-xs text-muted-foreground">Produtor: {produto.profiles.nome}</p>
        ) : null}
      </div>
    </Link>
  );
}
