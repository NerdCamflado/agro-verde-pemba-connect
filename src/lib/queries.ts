import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Categoria, Perfil, Produto } from "@/lib/agroverde";

const SELECT_PRODUTO =
  "*, categorias:categoria_id(id, nome, slug), profiles:produtor_id(id, nome, telefone, localizacao, bio, created_at)";

export const categoriasQuery = queryOptions({
  queryKey: ["categorias"],
  queryFn: async (): Promise<Categoria[]> => {
    const { data, error } = await supabase.from("categorias").select("*").order("nome");
    if (error) throw error;
    return (data ?? []) as unknown as Categoria[];
  },
});

export const produtosPublicosQuery = queryOptions({
  queryKey: ["produtos", "publicos"],
  queryFn: async (): Promise<Produto[]> => {
    const { data, error } = await supabase
      .from("produtos")
      .select(SELECT_PRODUTO)
      .eq("estado", "Disponível")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as Produto[];
  },
});

export function produtoQuery(id: string) {
  return queryOptions({
    queryKey: ["produto", id],
    queryFn: async (): Promise<Produto | null> => {
      const { data, error } = await supabase
        .from("produtos")
        .select(SELECT_PRODUTO)
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as Produto) ?? null;
    },
  });
}

export function produtorQuery(id: string) {
  return queryOptions({
    queryKey: ["produtor", id],
    queryFn: async (): Promise<{ perfil: Perfil | null; produtos: Produto[] }> => {
      const [{ data: perfil, error: e1 }, { data: produtos, error: e2 }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).maybeSingle(),
        supabase
          .from("produtos")
          .select(SELECT_PRODUTO)
          .eq("produtor_id", id)
          .eq("estado", "Disponível")
          .order("created_at", { ascending: false }),
      ]);
      if (e1) throw e1;
      if (e2) throw e2;
      return {
        perfil: (perfil as unknown as Perfil) ?? null,
        produtos: (produtos ?? []) as unknown as Produto[],
      };
    },
  });
}

export function meusProdutosQuery(userId: string) {
  return queryOptions({
    queryKey: ["produtos", "meus", userId],
    queryFn: async (): Promise<Produto[]> => {
      const { data, error } = await supabase
        .from("produtos")
        .select(SELECT_PRODUTO)
        .eq("produtor_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Produto[];
    },
  });
}
