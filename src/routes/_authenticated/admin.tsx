import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useEhAdmin, useSessao } from "@/hooks/useSessao";
import { supabase } from "@/integrations/supabase/client";
import {
  CORES_ESTADO,
  formatarData,
  formatarMT,
  type Perfil,
  type Produto,
} from "@/lib/agroverde";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Administração — AGROVERDE" },
      { name: "description", content: "Moderação de anúncios e métricas do marketplace AGROVERDE." },
      { property: "og:title", content: "Administração — AGROVERDE" },
      {
        property: "og:description",
        content: "Aprove anúncios, veja produtores e contactos gerados no AGROVERDE.",
      },
    ],
  }),
  component: Admin,
});

interface Contacto {
  id: string;
  created_at: string;
  produtos?: { nome: string } | null;
  profiles?: { nome: string } | null;
}

function Admin() {
  const { utilizador } = useSessao();
  const { data: ehAdmin, isLoading: aVerificar } = useEhAdmin(utilizador?.id);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "painel"],
    enabled: !!ehAdmin,
    queryFn: async () => {
      const [produtos, perfis, contactos] = await Promise.all([
        supabase
          .from("produtos")
          .select("*, profiles:produtor_id(id, nome, telefone, localizacao, bio, created_at)")
          .order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase
          .from("contactos_whatsapp")
          .select("id, created_at, produtos:produto_id(nome), profiles:produtor_id(nome)")
          .order("created_at", { ascending: false })
          .limit(30),
      ]);
      if (produtos.error) throw produtos.error;
      if (perfis.error) throw perfis.error;
      if (contactos.error) throw contactos.error;
      return {
        produtos: (produtos.data ?? []) as unknown as Produto[],
        perfis: (perfis.data ?? []) as unknown as Perfil[],
        contactos: (contactos.data ?? []) as unknown as Contacto[],
      };
    },
  });

  async function moderar(id: string, estado: "Disponível" | "Rejeitado") {
    const { error } = await supabase.from("produtos").update({ estado }).eq("id", id);
    if (error) {
      toast.error("Não foi possível actualizar o anúncio", { description: error.message });
      return;
    }
    toast.success(estado === "Disponível" ? "Anúncio aprovado" : "Anúncio rejeitado");
    queryClient.invalidateQueries({ queryKey: ["admin", "painel"] });
    queryClient.invalidateQueries({ queryKey: ["produtos"] });
  }

  if (aVerificar || isLoading) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-muted-foreground">A carregar...</p>;
  }

  if (!ehAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Acesso restrito</h1>
        <p className="mt-2 text-muted-foreground">
          Esta área é apenas para administradores do AGROVERDE.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Voltar ao início</Link>
        </Button>
      </div>
    );
  }

  const produtos = data?.produtos ?? [];
  const pendentes = produtos.filter((p) => p.estado === "Pendente");
  const metricas = [
    { rotulo: "Produtores", valor: data?.perfis.length ?? 0 },
    { rotulo: "Produtos activos", valor: produtos.filter((p) => p.estado === "Disponível").length },
    { rotulo: "Pendentes", valor: pendentes.length },
    { rotulo: "Vendidos", valor: produtos.filter((p) => p.estado === "Vendido").length },
    { rotulo: "Contactos", valor: data?.contactos.length ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Administração</h1>
      <p className="mt-1 text-muted-foreground">Modere anúncios e acompanhe o marketplace.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {metricas.map((m) => (
          <div key={m.rotulo} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{m.rotulo}</p>
            <p className="mt-1 font-display text-3xl font-bold">{m.valor}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Anúncios pendentes</h2>
        <div className="mt-4 space-y-3">
          {pendentes.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div>
                <p className="font-medium">{p.nome}</p>
                <p className="text-sm text-muted-foreground">
                  {p.profiles?.nome} · {p.localizacao} · {formatarMT(p.preco)} / {p.unidade}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => moderar(p.id, "Disponível")}>
                  Aprovar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => moderar(p.id, "Rejeitado")}
                >
                  Rejeitar
                </Button>
              </div>
            </div>
          ))}
          {pendentes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum anúncio à espera de revisão.</p>
          ) : null}
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-semibold">Todos os anúncios</h2>
          <div className="mt-4 space-y-2">
            {produtos.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
              >
                <span>
                  {p.nome}
                  <span className="block text-xs text-muted-foreground">{p.profiles?.nome}</span>
                </span>
                <span className={`rounded-full px-2.5 py-1 text-xs ${CORES_ESTADO[p.estado]}`}>
                  {p.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold">Produtores</h2>
          <div className="mt-4 space-y-2">
            {(data?.perfis ?? []).map((perfil) => (
              <Link
                key={perfil.id}
                to="/produtores/$id"
                params={{ id: perfil.id }}
                className="block rounded-xl border border-border bg-card px-4 py-3 text-sm hover:border-primary"
              >
                {perfil.nome}
                <span className="block text-xs text-muted-foreground">
                  {perfil.localizacao} · {perfil.telefone}
                </span>
              </Link>
            ))}
          </div>

          <h2 className="mt-8 font-display text-xl font-semibold">Contactos recentes</h2>
          <div className="mt-4 space-y-2">
            {(data?.contactos ?? []).map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm"
              >
                {c.produtos?.nome ?? "Produto"} · {c.profiles?.nome ?? "Produtor"}
                <span className="block text-xs text-muted-foreground">
                  {formatarData(c.created_at)}
                </span>
              </div>
            ))}
            {(data?.contactos ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">Ainda não há contactos registados.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
