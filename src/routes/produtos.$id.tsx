import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin, Package, User } from "lucide-react";

import { BotaoWhatsApp } from "@/components/BotaoWhatsApp";
import { formatarData, formatarMT } from "@/lib/agroverde";
import { produtoQuery } from "@/lib/queries";

export const Route = createFileRoute("/produtos/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do produto | AGROVERDE" },
      {
        name: "description",
        content:
          "Veja fotografia, preço em Meticais, quantidade, zona de Pemba e contacte o produtor por WhatsApp.",
      },
      { property: "og:title", content: "Detalhes do produto | AGROVERDE" },
      {
        property: "og:description",
        content: "Produto agrícola de um produtor local de Pemba, no AGROVERDE.",
      },
    ],
  }),
  component: Detalhe,
});

function Detalhe() {
  const { id } = Route.useParams();
  const { data: produto, isLoading } = useQuery(produtoQuery(id));

  if (isLoading) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-muted-foreground">A carregar...</p>;
  }

  if (!produto) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="font-display text-2xl font-semibold">Produto não encontrado</h1>
        <p className="mt-2 text-muted-foreground">
          Este anúncio pode ter sido vendido ou removido.
        </p>
        <Link to="/produtos" className="mt-4 inline-block text-primary hover:underline">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const especificacoes = [
    { icone: Package, rotulo: "Quantidade", valor: `${produto.quantidade} ${produto.unidade}` },
    { icone: MapPin, rotulo: "Localização", valor: produto.localizacao },
    {
      icone: CalendarDays,
      rotulo: "Disponível desde",
      valor: formatarData(produto.data_disponibilidade),
    },
    { icone: User, rotulo: "Categoria", valor: produto.categorias?.nome ?? "—" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/produtos" className="text-sm text-muted-foreground hover:text-foreground">
        ← Voltar ao catálogo
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          {produto.imagem_url ? (
            <img
              src={produto.imagem_url}
              alt={produto.nome}
              width={1024}
              height={768}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex aspect-4/3 items-center justify-center text-muted-foreground">
              Sem fotografia
            </div>
          )}
        </div>

        <div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            {produto.categorias?.nome ?? "Outros"}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold">{produto.nome}</h1>
          <p className="mt-2 text-3xl font-semibold text-primary">
            {formatarMT(produto.preco)}
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / {produto.unidade}
            </span>
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4">
            {especificacoes.map((e) => (
              <div key={e.rotulo} className="rounded-xl border border-border bg-card p-4">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <e.icone className="size-3.5" /> {e.rotulo}
                </dt>
                <dd className="mt-1 text-sm font-medium">{e.valor}</dd>
              </div>
            ))}
          </dl>

          {produto.descricao ? (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold">Descrição</h2>
              <p className="mt-2 whitespace-pre-line text-muted-foreground">{produto.descricao}</p>
            </div>
          ) : null}

          {produto.profiles ? (
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display text-lg font-semibold">Produtor</h2>
              <p className="mt-1 font-medium">{produto.profiles.nome}</p>
              <p className="text-sm text-muted-foreground">{produto.profiles.localizacao}</p>
              {produto.profiles.bio ? (
                <p className="mt-2 text-sm text-muted-foreground">{produto.profiles.bio}</p>
              ) : null}
              <Link
                to="/produtores/$id"
                params={{ id: produto.produtor_id }}
                className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
              >
                Ver perfil e outros produtos
              </Link>
            </div>
          ) : null}

          <div className="mt-6">
            <BotaoWhatsApp produto={produto} />
            <p className="mt-2 text-center text-xs text-muted-foreground">
              A conversa abre com uma mensagem pronta sobre este anúncio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
