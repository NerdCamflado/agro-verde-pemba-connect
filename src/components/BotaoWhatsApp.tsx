import { MessageCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { linkWhatsApp, mensagemProduto, type Produto } from "@/lib/agroverde";

export function BotaoWhatsApp({ produto }: { produto: Produto }) {
  const [aguardar, setAguardar] = useState(false);
  const telefone = produto.profiles?.telefone;

  async function contactar() {
    if (!telefone) return;
    setAguardar(true);
    const url = linkWhatsApp(telefone, mensagemProduto(produto));
    const janela = window.open("about:blank", "_blank");
    try {
      await supabase.from("contactos_whatsapp").insert({
        produto_id: produto.id,
        produtor_id: produto.produtor_id,
      });
    } catch {
      // o registo do contacto nunca deve impedir a conversa
    }
    if (janela) janela.location.href = url;
    else window.location.href = url;
    setAguardar(false);
  }

  return (
    <Button
      size="lg"
      onClick={contactar}
      disabled={!telefone || aguardar}
      className="w-full gap-2 bg-[oklch(0.62_0.16_150)] text-base font-semibold text-white hover:bg-[oklch(0.56_0.16_150)]"
    >
      <MessageCircle className="size-5" />
      Contactar via WhatsApp
    </Button>
  );
}
