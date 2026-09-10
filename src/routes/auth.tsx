import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useSessao } from "@/hooks/useSessao";
import { ZONAS_PEMBA } from "@/lib/agroverde";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar ou registar como produtor | AGROVERDE" },
      {
        name: "description",
        content:
          "Crie a sua conta de produtor no AGROVERDE e publique gratuitamente os seus produtos agrícolas de Pemba.",
      },
      { property: "og:title", content: "Entrar ou registar como produtor | AGROVERDE" },
      {
        property: "og:description",
        content: "Área reservada aos produtores agrícolas de Pemba.",
      },
    ],
  }),
  component: Autenticacao,
});

function Autenticacao() {
  const navigate = useNavigate();
  const { utilizador } = useSessao();
  const [aguardar, setAguardar] = useState(false);

  const [emailEntrar, setEmailEntrar] = useState("");
  const [senhaEntrar, setSenhaEntrar] = useState("");

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [zona, setZona] = useState<string>(ZONAS_PEMBA[0]);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    if (utilizador) navigate({ to: "/painel", replace: true });
  }, [utilizador, navigate]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setAguardar(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: emailEntrar,
      password: senhaEntrar,
    });
    setAguardar(false);
    if (error) {
      toast.error("Não foi possível entrar", { description: error.message });
      return;
    }
    navigate({ to: "/painel" });
  }

  async function registar(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\+?[0-9\s]{9,15}$/.test(telefone)) {
      toast.error("Telefone inválido", {
        description: "Use um número moçambicano, por exemplo +258 84 123 4567.",
      });
      return;
    }
    setAguardar(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        emailRedirectTo: window.location.origin,
        data: { nome, telefone, localizacao: zona },
      },
    });
    setAguardar(false);
    if (error) {
      toast.error("Não foi possível criar a conta", { description: error.message });
      return;
    }
    if (data.session) {
      navigate({ to: "/painel" });
      return;
    }
    toast.success("Conta criada", {
      description: "Confirme o endereço de email para poder entrar.",
    });
  }

  async function entrarComGoogle() {
    const resultado = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (resultado.error) {
      toast.error("Não foi possível entrar com o Google");
      return;
    }
    if (resultado.redirected) return;
    navigate({ to: "/painel" });
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14">
      <div className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Leaf className="size-6" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">Área do produtor</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compradores navegam sem conta. O registo é apenas para quem vende.
        </p>
      </div>

      <Tabs defaultValue="entrar" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="entrar">Entrar</TabsTrigger>
          <TabsTrigger value="registar">Registar</TabsTrigger>
        </TabsList>

        <TabsContent value="entrar">
          <form onSubmit={entrar} className="space-y-4 rounded-2xl border border-border bg-card p-6">
            <div>
              <Label htmlFor="email-entrar">Email</Label>
              <Input
                id="email-entrar"
                type="email"
                required
                value={emailEntrar}
                onChange={(e) => setEmailEntrar(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="senha-entrar">Senha</Label>
              <Input
                id="senha-entrar"
                type="password"
                required
                value={senhaEntrar}
                onChange={(e) => setSenhaEntrar(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full" disabled={aguardar}>
              Entrar
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={entrarComGoogle}>
              Continuar com o Google
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="registar">
          <form
            onSubmit={registar}
            className="space-y-4 rounded-2xl border border-border bg-card p-6"
          >
            <div>
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone (WhatsApp)</Label>
              <Input
                id="telefone"
                required
                placeholder="+258 84 123 4567"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Localização em Pemba</Label>
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
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                required
                minLength={6}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full" disabled={aguardar}>
              Criar conta de produtor
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
