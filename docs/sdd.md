# SDD - MVP Landing Page Cha de Panela

## Objetivo

Landing page responsiva para um cha de panela, com convite publico, confirmacao de presenca sem login, token local no navegador, reserva de presentes e area admin com senha unica.

## Design

- Estilo: romantico classico, inspirado nas referencias enviadas.
- Paleta: creme `#f8ecd9`, caramelo `#b98667`, terracota `#8e604b`, azul aquarela `#6f879e`, tinta escura `#3f332d`.
- Hero: foto do casal em tela inicial, overlay creme quente, titulo "Cha de Panela", nomes em fonte manuscrita e CTA principal.
- Estrutura: convite em etapas. Primeiro convite, depois formulario de presenca, depois presentes.
- Componentes: cards simples, bordas discretas, botoes grandes, status visual para presente reservado.

## Fluxo Publico

1. `/convite/[slug]` carrega dados do evento.
2. Frontend cria ou reutiliza `cha_panela_visitor_token` no `localStorage`.
3. API recupera confirmacao associada ao token.
4. Sem confirmacao, exibe CTA e formulario de presenca.
5. Com confirmacao, exibe saudacao e lista de presentes.
6. Reserva chama backend, que valida disponibilidade e uma reserva ativa por convidado.

## Fluxo Admin

1. `/admin` exibe login se nao houver sessao.
2. Senha unica cria cookie HTTP-only assinado.
3. Admin ve confirmacoes e presentes.
4. Admin adiciona, edita/inativa e libera presentes.
5. Liberar presente limpa reserva ativa e registra historico.

## API

- `GET /api/public/event?slug=joao-e-mary`
- `GET /api/public/me?slug=joao-e-mary&visitorToken=...`
- `POST /api/public/confirm-presence`
- `GET /api/public/gifts?slug=joao-e-mary`
- `POST /api/public/reserve-gift`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/confirmations`
- `GET /api/admin/gifts`
- `POST /api/admin/gifts`
- `PATCH /api/admin/gifts/:id`
- `POST /api/admin/gifts/:id/release`

## Regras

- Convidado nao cria conta.
- Token local identifica o dispositivo.
- Nome e telefone sao obrigatorios.
- Duplicidade e aceita no MVP e resolvida manualmente.
- Presente representa reserva, nao compra.
- Um convidado tem no maximo uma reserva ativa.
- A disponibilidade final sempre e validada no backend.
