import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, CalendarDays } from "lucide-react";

import { ProdutoCard } from "@/components/ProdutoCard";
import { formatarData } from "@/lib/agroverde";
import { produtorQuery } from "@/lib/queries";

export const Route = createFileRoute("/produtores/$id")({
  head: () => ({
    meta: [
      { title: "Perfil do produtor | AGROVERDE" },
      {
        name: "description",
        content: "Conheça o produtor de Pemba e veja todos os seus produtos disponíveis.",
      },
      { property: "og:title", content: "Perfil do produtor | AGROVERDE" },
      {
        property: "og:description",
        content: "Produtos disponíveis deste produtor local de Pemba, Cabo Delgado.",
      },
    ],
  }),
  component: PerfilProdutor,
});

function PerfilProdutor() {
  const { id } = Route.useParams();
  const { data, isLoading } = useQuery(produtorQuery(id));

  if (isLoading) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-muted-foreground">A carregar...</p>;
  }

  if (!data?.perfil) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-2xl font-semibold">Produtor não encontrado</h1>
        <Link to="/produtos" className="mt-4 inline-block text-primary hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const { perfil, produtos } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 font-display text-2xl font-semibold text-primary">
            {perfil.nome.charAt(0)}
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">{perfil.nome}</h1>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5" /> {perfil.localizacao}, Pemba
            </p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays className="size-3.5" /> No AGROVERDE desde{" "}
              {formatarData(perfil.created_at)}
            </p>
          </div>
        </div>
        {perfil.bio ? <p className="mt-4 text-muted-foreground">{perfil.bio}</p> : null}
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">
        Produtos disponíveis ({produtos.length})
      </h2>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {produtos.map((p) => (
          <ProdutoCard key={p.id} produto={p} />
        ))}
      </div>
      {produtos.length === 0 ? (
        <p className="py-10 text-muted-foreground">
          Este produtor não tem anúncios disponíveis de momento.
        </p>
      ) : null}
    </div>
  );
}
