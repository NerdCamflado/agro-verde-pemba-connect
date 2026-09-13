import { Link } from "@tanstack/react-router";
import { Headphones, Mail, MessageCircle, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { linkWhatsApp } from "@/lib/agroverde";

/** Contactos da equipa de apoio AGROVERDE. */
export const SUPORTE_TELEFONE = "+258 84 000 0000";
export const SUPORTE_EMAIL = "apoio@agroverde.co.mz";

export function SuporteCliente() {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 print:hidden">
      {aberto ? (
        <div className="w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-5 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold">Suporte ao cliente</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Segunda a sábado, 8h às 18h (Pemba)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAberto(false)}
              aria-label="Fechar suporte"
              className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <a
              href={linkWhatsApp(
                SUPORTE_TELEFONE,
                "Olá equipa AGROVERDE! Preciso de ajuda com a plataforma.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              <MessageCircle className="size-4" />
              <span>
                Falar por WhatsApp
                <span className="block text-xs text-muted-foreground">{SUPORTE_TELEFONE}</span>
              </span>
            </a>
            <a
              href={`mailto:${SUPORTE_EMAIL}`}
              className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              <Mail className="size-4" />
              <span>
                Enviar email
                <span className="block text-xs text-muted-foreground">{SUPORTE_EMAIL}</span>
              </span>
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            É produtor?{" "}
            <Link to="/auth" className="text-primary hover:underline" onClick={() => setAberto(false)}>
              Crie a sua conta
            </Link>{" "}
            e publique gratuitamente.
          </p>
        </div>
      ) : null}

      <Button
        size="lg"
        className="rounded-full shadow-lg"
        aria-expanded={aberto}
        aria-label="Suporte ao cliente"
        onClick={() => setAberto((v) => !v)}
      >
        <Headphones className="size-5" />
        <span className="hidden sm:inline">Suporte</span>
      </Button>
    </div>
  );
}
