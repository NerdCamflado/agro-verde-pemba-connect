export const ZONAS_PEMBA = [
  "Paquitequete",
  "Cariacó",
  "Natite",
  "Muxara",
  "Chuiba",
  "Alto Gingone",
  "Josina Machel",
  "Eduardo Mondlane",
  "Mieze",
  "Metuge",
  "Murrébué",
] as const;

export const UNIDADES = ["kg", "saco", "caixa", "molho"] as const;

export const ESTADOS = ["Pendente", "Disponível", "Vendido", "Rejeitado"] as const;
export type Estado = (typeof ESTADOS)[number];

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
}

export interface Perfil {
  id: string;
  nome: string;
  telefone: string;
  localizacao: string;
  bio: string | null;
  created_at: string;
}

export interface Produto {
  id: string;
  nome: string;
  categoria_id: string;
  imagem_url: string | null;
  quantidade: number;
  unidade: string;
  preco: number;
  localizacao: string;
  data_disponibilidade: string;
  descricao: string | null;
  produtor_id: string;
  estado: Estado;
  created_at: string;
  categorias?: Categoria | null;
  profiles?: Perfil | null;
}

export function formatarMT(valor: number): string {
  return `${new Intl.NumberFormat("pt-MZ", { maximumFractionDigits: 2 }).format(valor)} MT`;
}

export function formatarData(valor: string): string {
  try {
    return new Intl.DateTimeFormat("pt-PT", { dateStyle: "long" }).format(new Date(valor));
  } catch {
    return valor;
  }
}

/** Converte um número moçambicano para o formato exigido pelo wa.me (258...). */
export function numeroWhatsApp(telefone: string): string {
  const digitos = telefone.replace(/\D/g, "");
  if (digitos.startsWith("258")) return digitos;
  return `258${digitos.replace(/^0+/, "")}`;
}

export function linkWhatsApp(telefone: string, mensagem: string): string {
  return `https://wa.me/${numeroWhatsApp(telefone)}?text=${encodeURIComponent(mensagem)}`;
}

export function mensagemProduto(produto: Produto): string {
  return `Olá! Vi o seu anúncio de ${produto.nome} (${formatarMT(produto.preco)} / ${produto.unidade}) em ${produto.localizacao} no AGROVERDE. Ainda está disponível?`;
}

export const CORES_ESTADO: Record<Estado, string> = {
  Pendente: "bg-accent text-accent-foreground",
  Disponível: "bg-primary/10 text-primary",
  Vendido: "bg-muted text-muted-foreground",
  Rejeitado: "bg-destructive/10 text-destructive",
};
