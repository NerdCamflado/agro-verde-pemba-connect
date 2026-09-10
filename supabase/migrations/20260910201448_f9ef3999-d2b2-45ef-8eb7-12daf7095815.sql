-- ENUMS
CREATE TYPE public.app_role AS ENUM ('produtor', 'admin');
CREATE TYPE public.produto_estado AS ENUM ('Pendente', 'Disponível', 'Vendido', 'Rejeitado');

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  nome text NOT NULL,
  telefone text NOT NULL,
  localizacao text NOT NULL,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- USER ROLES
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- CATEGORIAS
CREATE TABLE public.categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categorias TO anon;
GRANT SELECT ON public.categorias TO authenticated;
GRANT ALL ON public.categorias TO service_role;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

-- PRODUTOS
CREATE TABLE public.produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  categoria_id uuid NOT NULL REFERENCES public.categorias(id),
  imagem_url text,
  quantidade numeric NOT NULL DEFAULT 1,
  unidade text NOT NULL DEFAULT 'kg',
  preco numeric NOT NULL,
  localizacao text NOT NULL,
  data_disponibilidade date NOT NULL DEFAULT current_date,
  descricao text,
  produtor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  estado public.produto_estado NOT NULL DEFAULT 'Pendente',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.produtos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.produtos TO authenticated;
GRANT ALL ON public.produtos TO service_role;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

-- CONTACTOS WHATSAPP
CREATE TABLE public.contactos_whatsapp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id uuid NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  produtor_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contactos_whatsapp TO anon;
GRANT SELECT, INSERT ON public.contactos_whatsapp TO authenticated;
GRANT ALL ON public.contactos_whatsapp TO service_role;
ALTER TABLE public.contactos_whatsapp ENABLE ROW LEVEL SECURITY;

-- POLICIES
CREATE POLICY "Perfis visiveis publicamente" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Utilizador cria o seu perfil" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Utilizador actualiza o seu perfil" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Ver os proprios papeis" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Registar-se como produtor" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND role = 'produtor');

CREATE POLICY "Categorias publicas" ON public.categorias FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Produtos disponiveis sao publicos" ON public.produtos FOR SELECT TO anon USING (estado = 'Disponível');
CREATE POLICY "Produtor ve os seus, publico ve disponiveis" ON public.produtos FOR SELECT TO authenticated USING (estado = 'Disponível' OR produtor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Produtor cria produtos" ON public.produtos FOR INSERT TO authenticated WITH CHECK (produtor_id = auth.uid());
CREATE POLICY "Produtor ou admin actualiza" ON public.produtos FOR UPDATE TO authenticated USING (produtor_id = auth.uid() OR public.has_role(auth.uid(), 'admin')) WITH CHECK (produtor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Produtor ou admin apaga" ON public.produtos FOR DELETE TO authenticated USING (produtor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Qualquer um regista contacto" ON public.contactos_whatsapp FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Produtor ou admin ve contactos" ON public.contactos_whatsapp FOR SELECT TO authenticated USING (produtor_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- CATEGORIAS SEED
INSERT INTO public.categorias (id, nome, slug) VALUES
 ('11111111-1111-4111-8111-000000000001', 'Hortaliças', 'hortalicas'),
 ('11111111-1111-4111-8111-000000000002', 'Frutas', 'frutas'),
 ('11111111-1111-4111-8111-000000000003', 'Cereais', 'cereais'),
 ('11111111-1111-4111-8111-000000000004', 'Legumes', 'legumes'),
 ('11111111-1111-4111-8111-000000000005', 'Tubérculos', 'tuberculos'),
 ('11111111-1111-4111-8111-000000000006', 'Outros', 'outros');

-- PRODUTORES FICTICIOS
INSERT INTO public.profiles (id, nome, telefone, localizacao, bio) VALUES
 ('22222222-2222-4222-8222-000000000001', 'Amina Salimo', '+258841234501', 'Paquitequete', 'Produtora de hortaliças frescas há 8 anos em Paquitequete.'),
 ('22222222-2222-4222-8222-000000000002', 'Jaime Muanacha', '+258842234502', 'Mieze', 'Cultivo de cereais e tubérculos nas machambas de Mieze.'),
 ('22222222-2222-4222-8222-000000000003', 'Rosa Nampira', '+258843234503', 'Cariacó', 'Venda diária de frutas e legumes no mercado de Cariacó.'),
 ('22222222-2222-4222-8222-000000000004', 'Carlos Mucussete', '+258844234504', 'Metuge', 'Machamba familiar em Metuge, entrega em Pemba cidade.');

-- PRODUTOS APROVADOS
INSERT INTO public.produtos (nome, categoria_id, imagem_url, quantidade, unidade, preco, localizacao, data_disponibilidade, descricao, produtor_id, estado) VALUES
 ('Tomate maduro', '11111111-1111-4111-8111-000000000001', '/produtos/tomate.jpg', 50, 'kg', 85, 'Paquitequete', current_date, 'Tomate fresco colhido esta manhã, ideal para revenda e restauração.', '22222222-2222-4222-8222-000000000001', 'Disponível'),
 ('Cebola local', '11111111-1111-4111-8111-000000000001', '/produtos/cebola.jpg', 30, 'saco', 950, 'Cariacó', current_date, 'Sacos de 25 kg de cebola local bem seca e conservada.', '22222222-2222-4222-8222-000000000003', 'Disponível'),
 ('Batata reno', '11111111-1111-4111-8111-000000000005', '/produtos/batata.jpg', 40, 'saco', 1250, 'Mieze', current_date, 'Batata de calibre médio, boa para mercados e cantinas.', '22222222-2222-4222-8222-000000000002', 'Disponível'),
 ('Mandioca fresca', '11111111-1111-4111-8111-000000000005', '/produtos/mandioca.jpg', 200, 'kg', 45, 'Metuge', current_date, 'Mandioca colhida no dia, entrega combinada em Pemba.', '22222222-2222-4222-8222-000000000004', 'Disponível'),
 ('Milho seco', '11111111-1111-4111-8111-000000000003', '/produtos/milho.jpg', 25, 'saco', 1800, 'Mieze', current_date, 'Milho branco seco, pronto para moagem, saco de 50 kg.', '22222222-2222-4222-8222-000000000002', 'Disponível'),
 ('Banana prata', '11111111-1111-4111-8111-000000000002', '/produtos/banana.jpg', 60, 'caixa', 320, 'Chuiba', current_date, 'Caixas de banana prata doce, colheita semanal.', '22222222-2222-4222-8222-000000000003', 'Disponível'),
 ('Alface crespa', '11111111-1111-4111-8111-000000000001', '/produtos/alface.jpg', 100, 'molho', 25, 'Natite', current_date, 'Alface crespa fresca em molhos, ideal para restaurantes.', '22222222-2222-4222-8222-000000000001', 'Disponível'),
 ('Couve manteiga', '11111111-1111-4111-8111-000000000001', '/produtos/couve.jpg', 80, 'molho', 20, 'Muxara', current_date, 'Couve fresca de horta regada diariamente.', '22222222-2222-4222-8222-000000000004', 'Pendente');