import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { UNIDADES, ZONAS_PEMBA, type Produto } from "@/lib/agroverde";
import { categoriasQuery } from "@/lib/queries";

interface Props {
  produtorId: string;
  zonaProdutor: string;
  produto?: Produto;
}

export function FormularioProduto({ produtorId, zonaProdutor, produto }: Props) {
  const navigate = useNavigate();
  const { data: categorias = [] } = useQuery(categoriasQuery);
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [categoria, setCategoria] = useState(produto?.categoria_id ?? "");
  const [imagem, setImagem] = useState(produto?.imagem_url ?? "");
  const [quantidade, setQuantidade] = useState(String(produto?.quantidade ?? ""));
  const [unidade, setUnidade] = useState<string>(produto?.unidade ?? UNIDADES[0]);
  const [preco, setPreco] = useState(String(produto?.preco ?? ""));
  const [zona, setZona] = useState(produto?.localizacao ?? zonaProdutor);
  const [data, setData] = useState(
    produto?.data_disponibilidade ?? new Date().toISOString().slice(0, 10),
  );
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [aguardar, setAguardar] = useState(false);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    if (!categoria) {
      toast.error("Escolha uma categoria");
      return;
    }
    setAguardar(true);
    const valores = {
      nome,
      categoria_id: categoria,
      imagem_url: imagem || null,
      quantidade: Number(quantidade),
      unidade,
      preco: Number(preco),
      localizacao: zona,
      data_disponibilidade: data,
      descricao: descricao || null,
      produtor_id: produtorId,
    };

    const { error } = produto
      ? await supabase.from("produtos").update(valores).eq("id", produto.id)
      : await supabase.from("produtos").insert({ ...valores, estado: "Pendente" });

    setAguardar(false);
    if (error) {
      toast.error("Não foi possível guardar o produto", { description: error.message });
      return;
    }
    toast.success(
      produto ? "Produto actualizado" : "Produto submetido — aguarda aprovação da equipa",
    );
    navigate({ to: "/painel" });
  }

  return (
    <form onSubmit={submeter} className="space-y-5 rounded-2xl border border-border bg-card p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="nome">Nome do produto</Label>
          <Input
            id="nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Tomate maduro"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label>Categoria</Label>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue placeholder="Escolher categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="imagem">Ligação da fotografia</Label>
          <Input
            id="imagem"
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
            placeholder="https://..."
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="quantidade">Quantidade</Label>
          <Input
            id="quantidade"
            type="number"
            min={1}
            required
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label>Unidade</Label>
          <Select value={unidade} onValueChange={setUnidade}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UNIDADES.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="preco">Preço (MT por unidade)</Label>
          <Input
            id="preco"
            type="number"
            min={0}
            step="0.01"
            required
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label>Localização</Label>
          <Select value={zona} onValueChange={setZona}>
            <SelectTrigger className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ZONAS_PEMBA.map((z) => (
                <SelectItem key={z} value={z}>
                  {z}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="data">Data de disponibilidade</Label>
          <Input
            id="data"
            type="date"
            required
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Qualidade, condições de entrega, quantidade mínima..."
            className="mt-1.5"
            rows={4}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={aguardar}>
          {produto ? "Guardar alterações" : "Publicar produto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate({ to: "/painel" })}>
          Cancelar
        </Button>
      </div>
      {!produto ? (
        <p className="text-xs text-muted-foreground">
          O anúncio fica pendente até ser aprovado pela equipa AGROVERDE.
        </p>
      ) : null}
    </form>
  );
}
