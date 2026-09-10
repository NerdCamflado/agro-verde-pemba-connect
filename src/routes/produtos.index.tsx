import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProdutoCard } from "@/components/ProdutoCard";
import { ZONAS_PEMBA } from "@/lib/agroverde";
import { categoriasQuery, produtosPublicosQuery } from "@/lib/queries";

type Busca = {
  q?: string;
  categoria?: string;
  zona?: string;
  max?: number;
};

export const Route = createFileRoute("/produtos/")({
  validateSearch: (search: Record<string, unknown>): Busca => ({
    q: typeof search['q'] === "string" ? search['q'] : undefined,
    categoria: typeof search['categoria'] === "string" ? search['categoria'] : undefined,
    zona: typeof search['zona'] === "string" ? search['zona'] : undefined,
    max: typeof search['max'] === "number" ? search['max'] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Catálogo de produtos agrícolas em Pemba | AGROVERDE" },
      {
        name: "description",
        content:
          "Pesquise produtos agrícolas disponíveis em Pemba por categoria, zona e preço em Meticais, e contacte o produtor por WhatsApp.",
      },
      { property: "og:title", content: "Catálogo de produtos agrícolas em Pemba | AGROVERDE" },
      {
        property: "og:description",
        content: "Hortaliças, frutas, cereais e tubérculos frescos de produtores de Pemba.",
      },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  const navigate = useNavigate({ from: "/produtos" });
  const filtros = Route.useSearch();
  const { data: produtos = [], isLoading } = useQuery(produtosPublicosQuery);
  const { data: categorias = [] } = useQuery(categoriasQuery);

  function actualizar(parcial: Partial<Busca>) {
    navigate({ search: (anterior) => ({ ...anterior, ...parcial }) });
  }

  const resultados = useMemo(() => {
    const termo = (filtros.q ?? "").trim().toLowerCase();
    return produtos.filter((p) => {
      if (termo && !`${p.nome} ${p.descricao ?? ""}`.toLowerCase().includes(termo)) return false;
      if (filtros.categoria && p.categoria_id !== filtros.categoria) return false;
      if (filtros.zona && p.localizacao !== filtros.zona) return false;
      if (filtros.max && Number(p.preco) > filtros.max) return false;
      return true;
    });
  }, [produtos, filtros]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Catálogo de produtos</h1>
      <p className="mt-2 text-muted-foreground">
        Apenas anúncios aprovados e disponíveis. Preços em Meticais (MT).
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <SlidersHorizontal className="size-4" /> Filtros
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="busca">Procurar</Label>
              <div className="relative mt-1.5">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="busca"
                  value={filtros.q ?? ""}
                  onChange={(e) => actualizar({ q: e.target.value || undefined })}
                  placeholder="Nome do produto"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label>Categoria</Label>
              <Select
                value={filtros.categoria ?? "todas"}
                onValueChange={(v) => actualizar({ categoria: v === "todas" ? undefined : v })}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categorias.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Localização</Label>
              <Select
                value={filtros.zona ?? "todas"}
                onValueChange={(v) => actualizar({ zona: v === "todas" ? undefined : v })}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Toda a Pemba</SelectItem>
                  {ZONAS_PEMBA.map((z) => (
                    <SelectItem key={z} value={z}>
                      {z}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="max">Preço máximo (MT)</Label>
              <Input
                id="max"
                type="number"
                min={0}
                value={filtros.max ?? ""}
                onChange={(e) =>
                  actualizar({ max: e.target.value ? Number(e.target.value) : undefined })
                }
                placeholder="Ex.: 1000"
                className="mt-1.5"
              />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                navigate({ search: { q: undefined, categoria: undefined, zona: undefined, max: undefined } })
              }
            >
              Limpar filtros
            </Button>
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {isLoading ? "A carregar produtos..." : `${resultados.length} produto(s) encontrado(s)`}
          </p>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {resultados.map((p) => (
              <ProdutoCard key={p.id} produto={p} />
            ))}
          </div>
          {!isLoading && resultados.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Nenhum produto corresponde à sua pesquisa.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
