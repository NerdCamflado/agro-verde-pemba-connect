import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, ShieldCheck, Sprout, MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProdutoCard } from "@/components/ProdutoCard";
import { categoriasQuery, produtosPublicosQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AGROVERDE — Conectando produtores ao mercado em Pemba" },
      {
        name: "description",
        content:
          "Marketplace agrícola de Pemba: compre hortaliças, frutas, cereais e tubérculos directamente aos produtores locais, com preços em Meticais.",
      },
      { property: "og:title", content: "AGROVERDE — Conectando produtores ao mercado" },
      {
        property: "og:description",
        content:
          "Produtos frescos de produtores de Pemba, Cabo Delgado. Contacte o produtor directamente por WhatsApp.",
      },
    ],
  }),
  component: Inicio,
});

function Inicio() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const { data: produtos = [] } = useQuery(produtosPublicosQuery);
  const { data: categorias = [] } = useQuery(categoriasQuery);

  const destaques = produtos.slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src="/hero-agroverde.jpg"
          alt="Produtora de Pemba com uma caixa de legumes frescos"
          width={1920}
          height={1080}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[oklch(0.24_0.05_150_/_0.92)] via-[oklch(0.24_0.05_150_/_0.75)] to-[oklch(0.24_0.05_150_/_0.35)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            <Sprout className="size-3.5" /> Pemba · Cabo Delgado
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold text-white sm:text-5xl">
            Produtos frescos, direto do produtor de Pemba
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/85">
            Encontre hortaliças, frutas, cereais e tubérculos das machambas locais e fale
            directamente com quem produz — sem intermediários.
          </p>

          <form
            className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/produtos", search: { q: busca || undefined } });
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Procurar tomate, milho, banana..."
                className="h-12 bg-white pl-9 text-foreground"
                aria-label="Procurar produtos"
              />
            </div>
            <Button type="submit" size="lg" className="h-12">
              Procurar
            </Button>
          </form>
          <p className="mt-3 text-sm text-white/70">
            {produtos.length} produtos disponíveis agora em Pemba e arredores
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-2xl font-semibold">Categorias em destaque</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categorias.map((c) => (
            <Link
              key={c.id}
              to="/produtos"
              search={{ categoria: c.id }}
              className="rounded-xl border border-border bg-card px-4 py-5 text-center text-sm font-medium shadow-sm transition-colors hover:border-primary hover:text-primary"
            >
              {c.nome}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold">Produtos disponíveis</h2>
          <Link
            to="/produtos"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver tudo <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {destaques.map((p) => (
            <ProdutoCard key={p.id} produto={p} />
          ))}
        </div>
        {destaques.length === 0 ? (
          <p className="py-10 text-center text-muted-foreground">
            Ainda não há produtos publicados.
          </p>
        ) : null}
      </section>

      <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="font-display text-2xl font-semibold">Como funciona</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              icone: Search,
              titulo: "1. Procure o produto",
              texto:
                "Pesquise por nome ou filtre por categoria, zona de Pemba e faixa de preço em Meticais.",
            },
            {
              icone: MessageCircle,
              titulo: "2. Fale com o produtor",
              texto:
                "Um clique abre o WhatsApp do produtor com uma mensagem pronta sobre o anúncio.",
            },
            {
              icone: ShieldCheck,
              titulo: "3. Combine a entrega",
              texto:
                "Todos os anúncios são revistos pela equipa AGROVERDE antes de ficarem visíveis.",
            },
          ].map((passo) => (
            <div key={passo.titulo} className="rounded-2xl border border-border bg-card p-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <passo.icone className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{passo.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{passo.texto}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground">
          <h3 className="font-display text-2xl font-semibold">É produtor em Pemba?</h3>
          <p className="mx-auto mt-2 max-w-lg text-primary-foreground/85">
            Publique os seus produtos gratuitamente e receba contactos de compradores directamente
            no seu WhatsApp.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/auth">Criar conta de produtor</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
