alter table guest_confirmations add column if not exists companions integer not null default 0;
alter table guest_confirmations add column if not exists notes text;

update events
set
  name = 'Chá de Panela',
  couple_name = 'João e Mary',
  welcome_text = 'Estamos preparando nosso cantinho e queremos celebrar esse novo capítulo com quem faz parte da nossa história. Seu carinho é o melhor presente.'
where public_slug = 'joao-e-mary';

update gifts set name = 'Jogo de xícaras' where name = 'Jogo de xicaras';
update gifts set name = 'Pá de lixo' where name = 'Pa de lixo';
update gifts set category = 'Área de serviço' where category = 'Area de servico';

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
