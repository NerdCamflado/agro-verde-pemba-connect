# AGROVERDE — Marketplace agrícola de Pemba

Aplicação completa em português, moeda em Meticais (MT), ligando produtores de Pemba a compradores.

## O que será construído

### Portal público (compradores, sem registo)
- **Início**: hero "Conectando produtores ao mercado", busca rápida, categorias em destaque, produtos disponíveis, secção "Como funciona", rodapé.
- **Catálogo**: busca em tempo real e filtros por categoria, zona de Pemba, faixa de preço e disponibilidade.
- **Detalhe do produto**: fotos, especificações, dados do produtor e botão destacado "Contactar via WhatsApp" que regista o clique e abre a conversa com mensagem pronta sobre o produto.
- **Perfil público do produtor**: apresentação, zona, histórico e produtos disponíveis.

### Área do produtor
- Registo (nome, telefone moçambicano, zona de Pemba, senha) e entrada.
- Painel com os seus produtos e estatísticas de anúncios e contactos recebidos.
- Publicar produto (entra como "Pendente"), editar e marcar como "Vendido".

### Área de administração
- Só para administradores.
- Métricas: produtores, produtos activos, pendentes, vendidos e total de contactos.
- Aprovar ou rejeitar anúncios pendentes — só os aprovados aparecem ao público.
- Lista de produtores e de contactos gerados.

## Design
Tema agrícola fresco: verdes (folha, campo) e tons de terra, tipografia clara, cartões com foto, totalmente responsivo em telemóvel.

## Dados iniciais
Produtores fictícios de Pemba e produtos já aprovados: Tomate, Cebola, Batata, Mandioca, Milho, Banana e Alface, com preços em MT e zonas reais (Paquitequete, Cariacó, Natite, Muxara, Chuiba, Mieze, Metuge).

## Detalhes técnicos
- Activação do Lovable Cloud para base de dados, contas e envio de imagens.
- Tabelas: `profiles` (nome, telefone, zona, bio), `user_roles` (produtor/admin, tabela separada por segurança), `categorias` (pré-populada), `produtos` (nome, categoria, imagem, quantidade, unidade kg/saco/caixa/molho, preço MT, localização, data de disponibilidade, descrição, produtor_id, estado, created_at), `contactos_whatsapp` (produto_id, produtor_id, criado_em).
- RLS: leitura pública apenas de produtos com estado "Disponível"; produtor lê/escreve os seus; admin gere tudo via função `has_role`.
- Registo de contacto WhatsApp por inserção pública restrita, com abertura do link `wa.me` formatado a partir do telefone do produtor.
- Rotas: `/`, `/produtos`, `/produtos/$id`, `/produtores/$id`, `/auth`, `/_authenticated/painel`, `/_authenticated/painel/novo`, `/_authenticated/painel/produto/$id`, `/_authenticated/admin`.
- Migração única com esquema, políticas, grants e INSERTs dos dados iniciais.
- Imagens dos produtos geradas para o arranque; upload por armazenamento de ficheiros no painel do produtor.
