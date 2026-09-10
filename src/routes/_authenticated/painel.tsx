import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Plus } from "lucide-react";
import { toast } from "sonner";

import { CompletarPerfil } from "@/components/CompletarPerfil";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { usePerfil, useSessao } from "@/hooks/useSessao";
import { CORES_ESTADO, formatarMT, type Estado } from "@/lib/agroverde";
import { meusProdutosQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/painel")({
  component: Painel,
});

function Painel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { utilizador, carregando } = useSessao();
  const { data: perfil, isLoading: perfilCarregando } = usePerfil(utilizador?.id);
  const { data: produtos = [] } = useQuery({
    ...meusProdutosQuery(utilizador?.id ?? ""),
    enabled: !!utilizador?.id && !!perfil,
  });
  const { data: contactos = 0 } = useQuery({
    queryKey: ["contactos", utilizador?.id],
    enabled: !!utilizador?.id,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("contactos_whatsapp")
        .select("id", { count: "exact", head: true })
        .eq("produtor_id", utilizador!.id);
      if (error) throw error;
      return count ?? 0;
    },
  });

  if (carregando || perfilCarregando) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-muted-foreground">A carregar...</p>;
  }
  if (!utilizador) return null;
  if (!perfil) return <CompletarPerfil utilizador={utilizador} />;

  const metricas = [
    { rotulo: "Total de anúncios", valor: produtos.length },
    { rotulo: "Disponíveis", valor: produtos.filter((p) => p.estado === "Disponível").length },
    { rotulo: "Pendentes", valor: produtos.filter((p) => p.estado === "Pendente").length },
    { rotulo: "Contactos recebidos", valor: contactos },
  ];

  async function marcarVendido(id: string) {
    const { error } = await supabase
      .from("produtos")
      .update({ estado: "Vendido" })
      .eq("id", id);
    if (error) {
      toast.error("Não foi possível actualizar", { description: error.message });
      return;
    }
    toast.success("Produto marcado como vendido");
    queryClient.invalidateQueries();
  }

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Olá, {perfil.nome}</h1>
          <p className="text-muted-foreground">
            {perfil.localizacao}, Pemba · {perfil.telefone}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/novo-produto">
              <Plus className="size-4" /> Publicar produto
            </Link>
          </Button>
          <Button variant="outline" onClick={sair}>
            <LogOut className="size-4" /> Sair
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricas.map((m) => (
          <div key={m.rotulo} className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{m.rotulo}</p>
            <p className="mt-1 font-display text-3xl font-bold text-primary">{m.valor}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold">Os meus produtos</h2>
      <div className="mt-4 space-y-3">
        {produtos.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              {p.imagem_url ? (
                <img
                  src={p.imagem_url}
                  alt={p.nome}
                  loading="lazy"
                  width={64}
                  height={64}
                  className="size-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-40 flex-1">
              <p className="font-medium">{p.nome}</p>
              <p className="text-sm text-muted-foreground">
                {formatarMT(p.preco)} / {p.unidade} · {p.quantidade} {p.unidade} · {p.localizacao}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${CORES_ESTADO[p.estado as Estado]}`}
            >
              {p.estado}
            </span>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/editar-produto/$id" params={{ id: p.id }}>
                  Editar
                </Link>
              </Button>
              {p.estado !== "Vendido" ? (
                <Button size="sm" variant="secondary" onClick={() => marcarVendido(p.id)}>
                  Marcar vendido
                </Button>
              ) : null}
            </div>
          </div>
        ))}
        {produtos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Ainda não publicou nenhum produto.
          </div>
        ) : null}
      </div>
    </div>
  );
}
