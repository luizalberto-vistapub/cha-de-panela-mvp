insert into events (
  name,
  couple_name,
  short_description,
  welcome_text,
  story_kicker,
  story_title,
  story_items,
  event_date,
  event_time,
  event_place,
  cover_image_url,
  public_slug
) values (
  'Chá de Panela',
  'João e Mary',
  'Venha celebrar esse momento especial com a gente.',
  'Estamos preparando nosso cantinho e queremos celebrar esse novo capítulo com quem faz parte da nossa história. Seu carinho é o melhor presente.',
  'A nossa história',
  'De um café para uma vida juntos',
  '[
    {"year": "2019", "title": "O primeiro café", "text": "Um encontro simples que virou assunto para a vida toda."},
    {"year": "2022", "title": "A primeira casa", "text": "Planos, plantas, listas e um cantinho ganhando forma."},
    {"year": "2025", "title": "O sim", "text": "A certeza de construir cada detalhe lado a lado."},
    {"year": "2026", "title": "O chá", "text": "Vocês com a gente nesse começo tão especial."}
  ]'::jsonb,
  '2026-06-20',
  '16h',
  'Casa da familia - endereco enviado no convite',
  '/images/hero-couple-optimized.jpg',
  'joao-e-mary'
) on conflict (public_slug) do nothing;

insert into gifts (event_id, name, category, display_order)
select e.id, g.name, g.category, g.display_order
from events e
cross join (
  values
    ('Jogo de xícaras', 'Cozinha', 10),
    ('Jogo de sobremesa', 'Cozinha', 20),
    ('Jogo de sorvete', 'Cozinha', 30),
    ('Jogo de copos', 'Cozinha', 40),
    ('Jogo de taças', 'Cozinha', 50),
    ('Suporte de bolo', 'Cozinha', 60),
    ('Aparelho de jantar', 'Cozinha', 70),
    ('Kit pizza', 'Cozinha', 80),
    ('Faqueiro de cozinha', 'Cozinha', 90),
    ('Prato raso', 'Cozinha', 100),
    ('Prato fundo', 'Cozinha', 110),
    ('Sousplat', 'Cozinha', 120),
    ('Colheres de silicone', 'Cozinha', 130),
    ('Colheres de pau', 'Cozinha', 140),
    ('Saladeira', 'Cozinha', 150),
    ('Marinex retangular', 'Cozinha', 160),
    ('Marinex redondo', 'Cozinha', 170),
    ('Prato para bolo', 'Cozinha', 180),
    ('Forma de bolo com furo central', 'Cozinha', 190),
    ('Jogo de tabuleiro', 'Cozinha', 200),
    ('Bandeja de café da manhã', 'Cozinha', 210),
    ('Forma de silicone', 'Cozinha', 220),
    ('Garrafa térmica de café', 'Cozinha', 230),
    ('Garrafa de água', 'Cozinha', 240),
    ('Jarra de suco', 'Cozinha', 250),
    ('Leiteira pequena', 'Cozinha', 260),
    ('Leiteira grande', 'Cozinha', 270),
    ('Jogo de banheiro', 'Banheiro', 280),
    ('Jogo de toalha', 'Banheiro', 290),
    ('Lixeira de banheiro', 'Banheiro', 300),
    ('Porta escova de dente', 'Banheiro', 310),
    ('Saboneteira', 'Banheiro', 320),
    ('Porta shampoo', 'Banheiro', 330),
    ('Cesto de roupa', 'Banheiro', 340),
    ('Almofadas', 'Quarto', 350),
    ('Cabides', 'Quarto', 360),
    ('Edredom', 'Quarto', 370),
    ('Manta', 'Quarto', 380),
    ('Jogo de cama', 'Quarto', 390),
    ('Jogo de lençol', 'Quarto', 400),
    ('Baldes', 'Área de serviço', 410),
    ('Lixeira', 'Área de serviço', 420),
    ('Pá de lixo', 'Área de serviço', 430),
    ('Rodo', 'Área de serviço', 440),
    ('Varal de chão', 'Área de serviço', 450),
    ('Vassoura e pá', 'Área de serviço', 460),
    ('Tábua de passar', 'Área de serviço', 470),
    ('Ferro de passar roupa', 'Área de serviço', 480),
    ('Dispenser de sabão em pó', 'Área de serviço', 490),
    ('Pregador', 'Área de serviço', 500),
    ('Organizadores', 'Área de serviço', 510),
    ('Pano de limpeza', 'Área de serviço', 520)
) as g(name, category, display_order)
where e.public_slug = 'joao-e-mary'
  and not exists (
    select 1
    from gifts existing
    where existing.event_id = e.id
      and existing.name = g.name
      and existing.category = g.category
  );
