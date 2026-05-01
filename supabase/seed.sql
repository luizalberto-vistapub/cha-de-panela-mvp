insert into events (
  name,
  couple_name,
  short_description,
  welcome_text,
  event_date,
  event_time,
  event_place,
  cover_image_url,
  public_slug
) values (
  'Cha de Panela',
  'Joao e Mary',
  'Venha celebrar esse momento especial com a gente.',
  'Estamos preparando nosso cantinho e queremos dividir esse carinho com voce.',
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
    ('Jogo de xicaras', 'Cozinha', 10),
    ('Jogo de sobremesa', 'Cozinha', 20),
    ('Jogo de copos', 'Cozinha', 30),
    ('Aparelho de jantar', 'Cozinha', 40),
    ('Kit pizza', 'Cozinha', 50),
    ('Faqueiro de cozinha', 'Cozinha', 60),
    ('Jogo de banheiro', 'Banheiro', 70),
    ('Jogo de toalha', 'Banheiro', 80),
    ('Lixeira de banheiro', 'Banheiro', 90),
    ('Porta escova de dente', 'Banheiro', 100),
    ('Saboneteira', 'Banheiro', 110),
    ('Almofadas', 'Quarto', 120),
    ('Cabides', 'Quarto', 130),
    ('Edredom', 'Quarto', 140),
    ('Manta', 'Quarto', 150),
    ('Jogo de cama', 'Quarto', 160),
    ('Baldes', 'Area de servico', 170),
    ('Lixeira', 'Area de servico', 180),
    ('Pa de lixo', 'Area de servico', 190),
    ('Rodo', 'Area de servico', 200),
    ('Pregador', 'Area de servico', 210)
) as g(name, category, display_order)
where e.public_slug = 'joao-e-mary'
on conflict do nothing;
