# Agro Conecta Pemba

Crie a aplicação web completa AGROVERDE ("Conectando produtores ao mercado"), marketplace agrícola para conectar produtores locais de Pemba (Cabo Delgado, Moçambique) a compradores.

Principais funcionalidades e arquitetura:
1. Idioma em Português e moeda em Meticais (MT / MZN).
2. Base de dados e autenticação (Lovable Cloud / Supabase):
   - Perfis de utilizador com papéis: 'produtor' e 'admin' (compradores navegam sem cadastro).
   - Tabela de produtos: nome, categoria, fotografia/imagem, quantidade, unidade (kg, saco, caixa, molho), preço em MT, localização (bairros/zonas de Pemba e arredores), data de disponibilidade, descrição, produtor_id, estado ('Pendente', 'Disponível', 'Vendido', 'Rejeitado'), created_at.
   - Tabela de categorias pré-populada: Hortaliças, Frutas, Cereais, Legumes, Tubérculos, Outros.
   - Tabela para rastreamento de contactos WhatsApp iniciados.
3. Portal do Comprador (Público):
   - Página inicial com hero, busca rápida, categorias em destaque, produtos disponíveis, secção "Como funciona" e rodapé.
   - Catálogo de produtos com busca em tempo real e filtros (categoria, localização em Pemba, faixa de preço, disponibilidade).
   - Página de detalhes do produto com fotos, especificações completas, info do produtor e botão destacado "Contactar via WhatsApp" que registra o clique e abre o link direto para o número do produtor com mensagem pré-formatada sobre o produto.
   - Página pública de perfil do produtor com histórico e lista de produtos disponíveis.
4. Painel do Produtor:
   - Registo (nome, telefone moçambicano, localização em Pemba, senha) e login.
   - Dashboard: Meus produtos, estatísticas simples de anúncios e contactos.
   - Formulário para publicar novo produto (entra por padrão com estado 'Pendente').
   - Editar produto e marcar produto como 'Vendido'.
5. Painel de Administração:
   - Acesso restrito a administradores.
   - Dashboard com métricas: total de produtores, produtos ativos, anúncios pendentes, produtos vendidos, total de contactos gerados.
   - Gestão e moderação de anúncios: aprovar ou rejeitar produtos pendentes (apenas produtos aprovados/'Disponível' aparecem na busca pública).
   - Gestão de produtores e lista de contactos.
6. Design limpo, profissional, moderno e responsivo com temática agrícola fresca (tons de verde e terra).
7. Mock data inicial realista com produtores fictícios e produtos de Pemba (Tomate, Cebola, Batata, Mandioca, Milho, Banana, Alface) já aprovados para visualização imediata.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://agro-verde-pemba-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2dc9778a-dc86-463e-b1e7-86f18477a46f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
