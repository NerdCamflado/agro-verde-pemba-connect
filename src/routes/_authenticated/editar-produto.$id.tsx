import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { FormularioProduto } from "@/components/FormularioProduto";
import { usePerfil, useSessao } from "@/hooks/useSessao";
import { produtoQuery } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/editar-produto/$id")({
  component: EditarProduto,
});

function EditarProduto() {
  const { id } = Route.useParams();
  const { utilizador } = useSessao();
  const { data: perfil } = usePerfil(utilizador?.id);
  const { data: produto, isLoading } = useQuery(produtoQuery(id));

  if (isLoading || !utilizador) {
    return <p className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">A carregar...</p>;
  }
  if (!produto) {
    return <p className="mx-auto max-w-3xl px-4 py-16">Produto não encontrado.</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Editar produto</h1>
      <div className="mt-6">
        <FormularioProduto
          produtorId={produto.produtor_id}
          zonaProdutor={perfil?.localizacao ?? produto.localizacao}
          produto={produto}
        />
      </div>
    </div>
  );
}
