---
name: Catequiza. — Paróquia Nossa Senhora do Carmo
description: Identidade paroquial carmelita em pergaminho claro, marrom profundo do hábito e dourado do brasão oficial.
colors:
  carmel-habit: "#3B2112"
  carmel-action: "#4A2916"
  carmel-action-hover: "#5A3621"
  heraldic-gold: "#AF915D"
  heraldic-gold-text: "#75592C"
  heraldic-gold-light: "#D9BE87"
  parchment-ground: "#FAF6EE"
  parchment-subtle: "#F3EBD9"
  pure-surface: "#FFFFFF"
  sand-border: "#E5DAC8"
  espresso-ink: "#26150B"
  bronze-muted: "#6D4B34"
  liturgical-green: "#15693B"
  liturgical-amber: "#925308"
  liturgical-crimson: "#A32222"
typography:
  display:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
  title:
    fontFamily: "'Source Sans 3', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "'Source Sans 3', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Source Sans 3', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.carmel-action}"
    textColor: "{colors.parchment-ground}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.carmel-action-hover}"
  button-secondary:
    backgroundColor: "{colors.pure-surface}"
    textColor: "{colors.carmel-action}"
    rounded: "{rounded.sm}"
    padding: "10px 16px"
  card-surface:
    backgroundColor: "{colors.pure-surface}"
    textColor: "{colors.espresso-ink}"
    rounded: "{rounded.md}"
    padding: "20px"
  input-field:
    backgroundColor: "{colors.parchment-ground}"
    textColor: "{colors.espresso-ink}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
  sidebar-shell:
    backgroundColor: "{colors.carmel-habit}"
    textColor: "{colors.parchment-ground}"
    width: "256px"
---

# Design System: Catequiza. — Paróquia Nossa Senhora do Carmo

## Overview

**Creative North Star: "Secretaria Carmelita em Pergaminho Vivo"**

A identidade visual do Catequiza. foi moldada diretamente a partir da comunicação oficial da **Paróquia Nossa Senhora do Carmo (Arquidiocese de Brasília — Taguatinga Sul)**: a clareza luminosa do papel pergaminho claro combinada à sobriedade do marrom carmelita do hábito e ao dourado heráldico do brasão paroquial (`#AF915D`). Em vez de um painel escuro genérico de software corporativo, a ferramenta acolhe secretários, catequistas voluntários e famílias em um ambiente claro, sereno e imediatamente reconhecível como pertencente à sua paróquia.

A interface opera sob alta clareza funcional (modo Operate): a barra lateral fixa em marrom carmelita profundo ancora a navegação e o brasão institucional, enquanto toda a área de trabalho se abre sobre fundo marfim suave com cartões brancos nítidos e bordas em areia quente. Apenas os momentos de projeção em sala de aula (Modal de Projeção de PIN e Quadro de Aula Ao Vivo) assumem o marrom carmelita profundo como palco de alto contraste para leitura à distância sem ofuscamento.

**Key Characteristics:**
- Paleta derivada diretamente das peças gráficas e do brasão oficial da Paróquia Nossa Senhora do Carmo.
- Hierarquia clara entre área institucional (marrom carmelita profundo) e área operacional (pergaminho claro + superfícies brancas).
- Tipografia clássica de inscrição romana (`Marcellus`) restrita a títulos e marca, combinada à sans-serif humanista de trabalho (`Source Sans 3`) para tabelas, formulários e controles.
- Contraste WCAG AA garantido em textos, placeholders, badges sacramentais e tabelas.

## Colors

A paleta une tons terrosos quentes de pergaminho e marrom carmelita ao dourado do brasão oficial, com semântica litúrgica sóbria para estados de presença, alerta e erro.

### Primary
- **Marrom Carmelita do Hábito** (`#3B2112`): Ancora a barra lateral fixa do painel administrativo, o topo e rodapé do Portal do Aluno, o painel institucional do Login e o fundo de projeção do PIN.
- **Marrom Carmelita de Ação** (`#4A2916`, hover `#5A3621`): Cor principal de botões primários, abas selecionadas e filtros ativos.

### Secondary
- **Dourado Heráldico do Brasão** (`#AF915D`): Extraído diretamente do brasão oficial da paróquia; utilizado em divisórias sutis, anéis de foco, ícones de destaque e selos institucionais.
- **Dourado Escuro Acessível** (`#75592C`): Variante escurecida para texto sobre branco ou pergaminho claro, garantindo contraste superior a 5.7:1.
- **Dourado Luminoso** (`#D9BE87`): Utilizado sobre superfícies em marrom carmelita profundo (subtítulos, ícones ativos na sidebar e códigos PIN projetados).

### Neutral
- **Pergaminho Claro** (`#FAF6EE`): Fundo principal da área de trabalho e do Portal do Aluno.
- **Superfície Branca** (`#FFFFFF`): Cartões, tabelas, cabeçalho superior e modais elevados sobre o pergaminho.
- **Areia Suave** (`#F3EBD9`) e **Borda Areia** (`#E5DAC8`): Cabeçalhos de tabela, pílulas neutras e bordas nítidas de separação.
- **Tinta Café Profundo** (`#26150B`) e **Bronze Suave** (`#6D4B34`): Textos principais (>15:1) e textos secundários (>6.8:1).

### Named Rules
**The Carmelite Anchor Rule.** O marrom carmelita profundo (`#3B2112`) pertence à moldura institucional (sidebar, topo do portal, painel de login e projeção de PIN); o espaço de trabalho diário permanece claro (`#FAF6EE` + `#FFFFFF`) para leitura prolongada sem fadiga visual.

**The Accessible Gold Rule.** Nunca utilize `#AF915D` ou `#D9BE87` para texto pequeno sobre fundos claros; utilize `#75592C` sobre fundos claros e `#D9BE87` exclusivamente sobre marrom escuro.

## Typography

**Display Font:** `Marcellus` (fallback: `Georgia, serif`)
**Body Font:** `Source Sans 3` (fallback: `system-ui, -apple-system, sans-serif`)
**Mono Font:** `JetBrains Mono` (fallback: `ui-monospace, monospace`)

**Character:** `Marcellus` ecoa diretamente a tipografia lapidar dos cartazes da Paróquia Nossa Senhora do Carmo, conferindo reverência e identidade institucional aos títulos, enquanto `Source Sans 3` mantém formulários, tabelas e badges extremamente legíveis em qualquer densidade.

### Hierarchy
- **Display** (`400`, `1.875rem` / `30px`, `1.2`): Títulos principais de módulo (`h1`) e marca `Catequiza.`.
- **Headline** (`400`, `1.25rem` / `20px`, `1.25`): Títulos de modais e seções internas.
- **Title** (`700`, `1rem` / `16px`, `1.35`): Nomes de turmas em cards e subtítulos de painel (`Source Sans 3`).
- **Body** (`400`, `0.875rem` / `14px`, `1.55`): Textos descritivos, inputs, selects e linhas de tabela.
- **Label** (`600`, `0.75rem` / `12px`, `1.3`, tracking `0.04em`): Rótulos de formulário, cabeçalhos de coluna e badges.
- **Mono** (`600`, `0.875rem`, `tabular-nums`): Códigos PIN, CPFs, matrículas e datas formatadas.

### Named Rules
**The Workhorse Control Rule.** `Marcellus` nunca aparece em botões, inputs, cabeçalhos de tabela ou badges; todos os controles operacionais usam `Source Sans 3`.

## Layout

O painel administrativo adota grade responsiva com barra lateral fixa de `256px` em desktop (`lg:static`), recolhível em gaveta sobre mobile, cabeçalho superior fixo de `64px` (`h-16`) e área principal centrada até `1280px` (`max-w-7xl`) com espaçamento rítmico de `24px` (`space-y-6`). O Portal do Aluno usa coluna única centrada até `540px` com alvos de toque mínimos de `46px` para uso confortável com uma mão em smartphones.

## Elevation & Depth

O sistema combina camadas tonais suaves (cartões `#FFFFFF` sobre fundo `#FAF6EE` delimitados por bordas `1px solid #E5DAC8`) com sombras quentes sutis em tom marrom translúcido apenas para elevação tátil no hover e modais.

### Shadow Vocabulary
- **Card Rest** (`box-shadow: 0 2px 10px -2px rgba(59, 33, 18, 0.06), 0 1px 3px 0 rgba(59, 33, 18, 0.04)`): Cartões, tabelas e painéis em repouso.
- **Card Hover** (`box-shadow: 0 10px 24px -6px rgba(59, 33, 18, 0.12), 0 4px 8px -2px rgba(59, 33, 18, 0.05)`): Elevação suave em cards clicáveis de turma.
- **Modal** (`box-shadow: 0 24px 48px -12px rgba(38, 21, 11, 0.28)`): Sobreposição de diálogos e projeção de PIN.

## Shapes

Bordas suaves e consistentes sem exageros geométricos: `8px` (`rounded-lg`) para botões, inputs e filtros; `12px–16px` (`rounded-xl` / `rounded-2xl`) para cartões, tabelas e modais; `24px` (`rounded-3xl`) reservado ao modal de projeção em tela cheia. O brasão oficial sobre o fundo marrom escuro é sempre acomodado em um medalhão marfim (`#FAF6EE`, `rounded-xl`, anel fino `#D9BE87/50`) preservando a leitura fiel do escudo.

## Components

### Buttons
- **Shape:** Bordas suavemente arredondadas (`8px`).
- **Primary:** Fundo `#4A2916`, texto `#FAF6EE`, fonte `Source Sans 3` semibold (`10px 18px`), hover `#5A3621`.
- **Secondary:** Fundo `#FFFFFF`, borda `#E5DAC8`, texto `#4A2916`, hover `#F3EBD9`.

### Cards / Containers
- **Corner Style:** `12px` a `16px`.
- **Background:** `#FFFFFF` sobre `#FAF6EE`.
- **Border:** `1px solid #E5DAC8`; cards clicáveis transicionam a borda para `#AF915D` no hover.

### Inputs / Fields
- **Style:** Fundo `#FAF6EE` com borda `1px solid #E5DAC8`, raio `8px`, texto `#26150B` e placeholder acessível `#785C45`.
- **Focus:** Fundo transita para `#FFFFFF`, borda `#AF915D` e anel de foco `ring-2 ring-gold-500/60`.

### Navigation
- **Admin Sidebar:** Rail fixo `256px` em `#3B2112` com brasão paroquial + `Catequiza.` / `Paróquia N. Sra. do Carmo`, item ativo em `#4A2916` com anel dourado sutil e ícone `#D9BE87`.
- **Student Portal Tabs:** Faixa fixa superior em `#3B2112` com três abas de alvo mínimo `46px` e sublinhado dourado `#D9BE87`.

### Projeção de PIN Carmelita
Modal de projeção dedicado em `#3B2112` com o brasão da paróquia no topo, código PIN em `JetBrains Mono` de alto contraste (`#EAD9B4`) sobre bloco `#26150B` e contagem regressiva em tempo real.

## Do's and Don'ts

### Do:
- **Do** manter o brasão oficial da Paróquia Nossa Senhora do Carmo em medalhão marfim sobre fundos escuros e com `mix-blend-multiply` sobre pergaminho claro.
- **Do** aplicar `tabular-nums` em todas as colunas de faltas, frequências, matrículas, datas e CPFs.
- **Do** usar as cores semânticas litúrgicas (`#15693B`, `#925308`, `#A32222`) sobre fundos tintados claros com bordas correspondentes.

### Don't:
- **Don't** misturar elementos azul-escuro (`slate-900` / azul corporativo antigo) com a paleta carmelita.
- **Don't** usar texto com gradiente, bordas laterais grossas (`border-l-4`) ou sombras neon em cartões e linhas de tabela.
- **Don't** aplicar `Marcellus` em rótulos pequenos, botões ou células numéricas de tabela.
