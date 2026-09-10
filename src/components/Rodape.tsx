import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";

export function Rodape() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="size-4" />
            </span>
            <span className="font-display text-lg font-semibold">AGROVERDE</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Marketplace agrícola que liga produtores locais de Pemba, Cabo Delgado, a compradores em
            todo o país.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Comprar</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/produtos" className="hover:text-foreground">
                Catálogo de produtos
              </Link>
            </li>
            <li>
              <Link to="/" hash="como-funciona" className="hover:text-foreground">
                Como funciona
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Produtores</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/auth" className="hover:text-foreground">
                Registar conta
              </Link>
            </li>
            <li>
              <Link to="/painel" className="hover:text-foreground">
                Meu painel
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Contacto</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Pemba, Cabo Delgado
            <br />
            Moçambique
            <br />
            Preços em Meticais (MT)
          </p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AGROVERDE — Conectando produtores ao mercado.
      </div>
    </footer>
  );
}
