import { createFileRoute } from "@tanstack/react-router";

import { FormularioProduto } from "@/components/FormularioProduto";
import { usePerfil, useSessao } from "@/hooks/useSessao";
import { CompletarPerfil } from "@/components/CompletarPerfil";

export const Route = createFileRoute("/_authenticated/novo-produto")({
  component: NovoProduto,
});

function NovoProduto() {
  const { utilizador } = useSessao();
  const { data: perfil, isLoading } = usePerfil(utilizador?.id);

  if (!utilizador || isLoading) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">A carregar...</p>;
  }
  if (!perfil) return <CompletarPerfil utilizador={utilizador} />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Publicar novo produto</h1>
      <p className="mt-1 text-muted-foreground">Preços em Meticais (MT).</p>
      <div className="mt-6">
        <FormularioProduto produtorId={utilizador.id} zonaProdutor={perfil.localizacao} />
      </div>
    </div>
  );
}
