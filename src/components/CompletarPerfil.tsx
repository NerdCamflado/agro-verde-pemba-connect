import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

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
import { ZONAS_PEMBA } from "@/lib/agroverde";

export function CompletarPerfil({ utilizador }: { utilizador: User }) {
  const meta = (utilizador.user_metadata ?? {}) as Record<string, string | undefined>;
  const queryClient = useQueryClient();
  const [nome, setNome] = useState(meta['nome'] ?? meta['full_name'] ?? "");
  const [telefone, setTelefone] = useState(meta['telefone'] ?? "");
  const [zona, setZona] = useState(meta['localizacao'] ?? ZONAS_PEMBA[0]);
  const [bio, setBio] = useState("");
  const [aguardar, setAguardar] = useState(false);

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setAguardar(true);
    const { error } = await supabase.from("profiles").insert({
      id: utilizador.id,
      nome,
      telefone,
      localizacao: zona,
      bio: bio || null,
    });
    if (!error) {
      await supabase.from("user_roles").insert({ user_id: utilizador.id, role: "produtor" });
    }
    setAguardar(false);
    if (error) {
      toast.error("Não foi possível guardar o perfil", { description: error.message });
      return;
    }
    toast.success("Perfil criado com sucesso");
    queryClient.invalidateQueries();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="font-display text-2xl font-bold">Complete o seu perfil de produtor</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Estes dados aparecem nos seus anúncios e permitem que os compradores o contactem.
      </p>
      <form onSubmit={guardar} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <Label htmlFor="p-nome">Nome completo</Label>
          <Input
            id="p-nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="p-tel">Telefone (WhatsApp)</Label>
          <Input
            id="p-tel"
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
          <Label htmlFor="p-bio">Apresentação (opcional)</Label>
          <Textarea
            id="p-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1.5"
            placeholder="Fale um pouco da sua machamba e do que produz."
          />
        </div>
        <Button type="submit" className="w-full" disabled={aguardar}>
          Guardar perfil
        </Button>
      </form>
    </div>
  );
}
