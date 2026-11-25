// Quintal de Tia Lena — dados compartilhados entre o site e a área do gerente.
// Demo: tudo fica salvo no navegador (localStorage). Em produção, isso viria de um banco.

const STORE_KEY = 'tialena:v1';

const STORE_DEFAULTS = {
  preco: 25,
  status: 'auto', // auto | fechado
  aviso: '',
  buffet: [
    { nome: 'Feijão verde', on: true },
    { nome: 'Carne de sol acebolada', on: true },
    { nome: 'Frango guisado', on: true },
    { nome: 'Costela no bafo', on: false },
    { nome: 'Macaxeira cozida', on: true },
    { nome: 'Cuscuz', on: true },
    { nome: 'Arroz branco', on: true },
    { nome: 'Purê de batata', on: true },
    { nome: 'Farofa da casa', on: true },
    { nome: 'Vinagrete', on: true },
    { nome: 'Salada verde', on: true },
    { nome: 'Feijoada', on: false },
    { nome: 'Cocada', on: true }
  ],
  promos: [
    { dia: 2, rotulo: 'Terça', titulo: 'Terça do Clone', texto: 'Promoção do clone em caipirinha, batata simples, caldinhos e mini pastéis.' },
    { dia: 3, rotulo: 'Quarta', titulo: 'Quarta dos Combos', texto: 'Pizza G + refri 1 L por R$ 42, 4 pastéis de carne + refri por R$ 25 ou batata gourmet + 2 Spaten por R$ 30.' },
    { dia: 4, rotulo: 'Quinta', titulo: 'Quinta da Long Neck', texto: 'Balde com 5 long necks por R$ 25.' },
    { dia: 5, rotulo: 'Sexta', titulo: 'A Sexta tá Massa!', texto: 'Lasanha individual a partir de R$ 17,99. Happy hour das 17h às 20h.' },
    { dia: '6,0', rotulo: 'Sáb e dom', titulo: 'Feijoada com caipirinha', texto: 'Na feijoada individual, a primeira caipirinha é por conta da casa.' }
  ],
  // Cardápio à la carte (do PDF do Linktree). Preços em reais; null = não servido nesse tamanho.
  cardapio: [
    { id: 'pratos', secoes: [
      { titulo: "Frango", legenda: ["1 pessoa", "2 pessoas"], nota: "", itens: [
        {"id": "c1", "nome": "Panqueca de frango", "desc": "Arroz, batata frita, farofa e vinagrete", "tag": "", "precos": [19.99, 32.99], "destaque": false, "on": true},
        {"id": "c2", "nome": "Filé de frango grelhado", "desc": "Feijão, arroz, purê, farofa e vinagrete", "tag": "", "precos": [26.99, 44.99], "destaque": false, "on": true},
        {"id": "c3", "nome": "Parmegiana de frango", "desc": "Muçarela, macarrão ao molho de tomate e purê", "tag": "", "precos": [26.99, 47.99], "destaque": true, "on": true}
      ] },
      { titulo: "Carnes", legenda: ["1 pessoa", "2 pessoas"], nota: "", itens: [
        {"id": "c4", "nome": "Panqueca de carne", "desc": "Arroz, batata frita, farofa e vinagrete", "tag": "", "precos": [19.99, 34.99], "destaque": false, "on": true},
        {"id": "c5", "nome": "Bisteca suína ao molho de laranja", "desc": "Feijão, arroz, purê, farofa e vinagrete", "tag": "", "precos": [24.99, 42.99], "destaque": false, "on": true},
        {"id": "c6", "nome": "Bife acebolado", "desc": "Feijão, arroz, purê ou fritas, farofa e vinagrete", "tag": "", "precos": [26.99, 46.99], "destaque": false, "on": true},
        {"id": "c7", "nome": "Feijoada", "desc": "Arroz, farofa, vinagrete e couve", "tag": "sáb e dom", "precos": [27.99, 50.99], "destaque": true, "on": true},
        {"id": "c8", "nome": "Parmegiana de carne", "desc": "Muçarela, macarrão ao molho de tomate e purê", "tag": "", "precos": [31.99, 58.99], "destaque": false, "on": true},
        {"id": "c9", "nome": "Costela bovina no bafo", "desc": "Feijão, arroz, purê ou fritas, farofa e vinagrete", "tag": "", "precos": [31.99, 58.99], "destaque": true, "on": true},
        {"id": "c10", "nome": "Maminha", "desc": "Fatiada, com feijão, arroz, purê ou fritas, farofa e vinagrete", "tag": "", "precos": [34.99, 64.99], "destaque": false, "on": true},
        {"id": "c11", "nome": "Carne de sol", "desc": "Feijão, arroz, purê ou fritas, farofa e vinagrete", "tag": "", "precos": [34.99, 63.99], "destaque": true, "on": true},
        {"id": "c12", "nome": "Picanha", "desc": "Fatiada, com feijão, arroz, purê ou fritas, farofa e vinagrete", "tag": "", "precos": [37.99, 67.99], "destaque": true, "on": true},
        {"id": "c13", "nome": "Mistão", "desc": "Carne, carne de sol, toscana, frango e queijo coalho, com feijão, arroz, purê ou fritas, farofa e vinagrete", "tag": "", "precos": [null, 61.99], "destaque": true, "on": true}
      ] },
      { titulo: "Massas", legenda: ["1 pessoa", "2 pessoas"], nota: "", itens: [
        {"id": "c14", "nome": "Espaguete à carbonara", "desc": "Molho especial com pedaços de bacon", "tag": "", "precos": [24.99, 41.99], "destaque": false, "on": true},
        {"id": "c15", "nome": "Espaguete à bolonhesa", "desc": "Molho de tomate com carne moída", "tag": "", "precos": [24.99, 37.99], "destaque": false, "on": true},
        {"id": "c16", "nome": "Lasanha de frango", "desc": "Frango desfiado, muçarela, presunto e molho branco", "tag": "", "precos": [21.99, null], "destaque": false, "on": true},
        {"id": "c17", "nome": "Lasanha de carne", "desc": "Carne moída, muçarela, presunto e molho de tomate", "tag": "", "precos": [21.99, null], "destaque": false, "on": true}
      ] },
      { titulo: "Porções extras", legenda: null, nota: "", itens: [
        {"id": "c18", "nome": "Farofa ou vinagrete", "desc": "", "tag": "", "precos": [2.0], "destaque": false, "on": true},
        {"id": "c19", "nome": "Feijão, arroz, macarrão ou purê", "desc": "", "tag": "", "precos": [6.0], "destaque": false, "on": true}
      ] }
    ] },
    { id: 'petiscos', secoes: [
      { titulo: "Saladas", legenda: null, nota: "Molhos: rosé, mostarda e mel ou iogurte.", itens: [
        {"id": "c20", "nome": "À moda da casa", "desc": "Alface, tomate, cebola, repolho, cenoura e molho", "tag": "", "precos": [19.99], "destaque": false, "on": true},
        {"id": "c21", "nome": "Caesar", "desc": "Mix de folhas, rúcula, tomate seco, tiras de frango e molho", "tag": "", "precos": [21.99], "destaque": false, "on": true},
        {"id": "c22", "nome": "Tia Lena", "desc": "Mix de folhas, tomate cereja, cebola roxa, cenoura, queijo coalho e molho", "tag": "", "precos": [21.99], "destaque": false, "on": true},
        {"id": "c23", "nome": "Salpicão", "desc": "Repolho, batata, cenoura, uva passa, maçã, frango e molho", "tag": "", "precos": [24.99], "destaque": false, "on": true}
      ] },
      { titulo: "Pães", legenda: null, nota: "", itens: [
        {"id": "c24", "nome": "Pão de alho", "desc": "Pão assado com creme de alho", "tag": "", "precos": [8.0], "destaque": false, "on": true},
        {"id": "c25", "nome": "Brusqueta tradicional", "desc": "Molho de tomate especial e muçarela", "tag": "", "precos": [16.0], "destaque": true, "on": true},
        {"id": "c26", "nome": "Brusqueta ao pesto", "desc": "Molho pesto e muçarela", "tag": "", "precos": [19.99], "destaque": false, "on": true},
        {"id": "c27", "nome": "Tiras de filé mignon no pão italiano", "desc": "Filé mignon ao blend de queijos", "tag": "", "precos": [51.99], "destaque": false, "on": true}
      ] },
      { titulo: "Caldinhos", legenda: null, nota: "", itens: [
        {"id": "c28", "nome": "Feijão preto ou mulatinho", "desc": "Com azeitona, ovo de codorna e calabresa", "tag": "", "precos": [8.99], "destaque": true, "on": true},
        {"id": "c29", "nome": "Camarão", "desc": "Com azeitona, ovo de codorna e calabresa", "tag": "", "precos": [11.99], "destaque": false, "on": true}
      ] },
      { titulo: "Camarão", legenda: null, nota: "", itens: [
        {"id": "c30", "nome": "Camarão ao alho e óleo", "desc": "Porção de aproximadamente 350 g", "tag": "", "precos": [26.99], "destaque": true, "on": true}
      ] },
      { titulo: "Espetinhos", legenda: null, nota: "", itens: [
        {"id": "c31", "nome": "Frango", "desc": "", "tag": "", "precos": [7.99], "destaque": false, "on": true},
        {"id": "c32", "nome": "Queijo coalho", "desc": "Com ervas e mel de engenho", "tag": "", "precos": [8.99], "destaque": true, "on": true},
        {"id": "c33", "nome": "Carne bovina", "desc": "", "tag": "", "precos": [9.5], "destaque": false, "on": true},
        {"id": "c34", "nome": "Frango com bacon", "desc": "", "tag": "", "precos": [9.5], "destaque": false, "on": true},
        {"id": "c35", "nome": "Coração de galinha", "desc": "", "tag": "", "precos": [9.99], "destaque": false, "on": true}
      ] },
      { titulo: "Fritas", legenda: null, nota: "", itens: [
        {"id": "c36", "nome": "Batata frita simples", "desc": "Porção pequena", "tag": "", "precos": [11.99], "destaque": false, "on": true},
        {"id": "c37", "nome": "Batata frita gourmet", "desc": "Porção grande com cheddar e bacon", "tag": "", "precos": [19.99], "destaque": false, "on": true},
        {"id": "c38", "nome": "Macaxeira frita simples", "desc": "Porção pequena", "tag": "", "precos": [11.99], "destaque": false, "on": true},
        {"id": "c39", "nome": "Macaxeira frita gourmet", "desc": "Porção grande ao creme de queijo e bacon", "tag": "", "precos": [19.99], "destaque": true, "on": true},
        {"id": "c40", "nome": "Calabresa com fritas", "desc": "Calabresa com batata frita", "tag": "", "precos": [24.99], "destaque": false, "on": true},
        {"id": "c41", "nome": "Maminha com fritas", "desc": "Carne bovina com batata frita", "tag": "", "precos": [29.99], "destaque": false, "on": true},
        {"id": "c42", "nome": "Carne de sol com coalho e fritas", "desc": "Queijo coalho assado e batata frita", "tag": "", "precos": [31.99], "destaque": true, "on": true}
      ] },
      { titulo: "Linguiça toscana", legenda: null, nota: "", itens: [
        {"id": "c43", "nome": "Linguiça mista picante", "desc": "Com geleia de pimenta", "tag": "", "precos": [10.99], "destaque": false, "on": true}
      ] },
      { titulo: "Mini pastéis", legenda: null, nota: "Porção com 6 unidades.", itens: [
        {"id": "c44", "nome": "Frango", "desc": "", "tag": "", "precos": [14.0], "destaque": false, "on": true},
        {"id": "c45", "nome": "Carne e açúcar", "desc": "", "tag": "", "precos": [14.0], "destaque": false, "on": true},
        {"id": "c46", "nome": "Frango com catupiry", "desc": "", "tag": "", "precos": [14.0], "destaque": false, "on": true},
        {"id": "c47", "nome": "Quatro queijos", "desc": "", "tag": "", "precos": [14.0], "destaque": false, "on": true},
        {"id": "c48", "nome": "Calabresa com queijo", "desc": "", "tag": "", "precos": [14.0], "destaque": false, "on": true},
        {"id": "c49", "nome": "Chocolate", "desc": "", "tag": "", "precos": [14.0], "destaque": false, "on": true},
        {"id": "c50", "nome": "Queijo do reino", "desc": "", "tag": "", "precos": [18.0], "destaque": false, "on": true},
        {"id": "c51", "nome": "Nutella", "desc": "", "tag": "", "precos": [18.0], "destaque": false, "on": true}
      ] }
    ] },
    { id: 'brunch', secoes: [
      { titulo: "Cuscuz recheado", legenda: null, nota: "Individual.", itens: [
        {"id": "c52", "nome": "Queijo coalho e manteiga de garrafa", "desc": "", "tag": "", "precos": [9.99], "destaque": true, "on": true},
        {"id": "c53", "nome": "Frango com catupiry", "desc": "", "tag": "", "precos": [11.99], "destaque": false, "on": true},
        {"id": "c54", "nome": "Charque guisada", "desc": "", "tag": "", "precos": [12.99], "destaque": true, "on": true}
      ] },
      { titulo: "Tapiocas", legenda: null, nota: "", itens: [
        {"id": "c55", "nome": "Coco", "desc": "", "tag": "", "precos": [5.0], "destaque": false, "on": true},
        {"id": "c56", "nome": "Coco e queijo coalho", "desc": "", "tag": "", "precos": [6.0], "destaque": true, "on": true},
        {"id": "c57", "nome": "Frango com catupiry", "desc": "", "tag": "", "precos": [8.0], "destaque": false, "on": true},
        {"id": "c58", "nome": "Charque", "desc": "", "tag": "", "precos": [8.0], "destaque": false, "on": true}
      ] },
      { titulo: "Croissant", legenda: null, nota: "", itens: [
        {"id": "c59", "nome": "Tradicional", "desc": "", "tag": "", "precos": [7.0], "destaque": true, "on": true},
        {"id": "c60", "nome": "Queijo do reino", "desc": "", "tag": "", "precos": [9.0], "destaque": false, "on": true}
      ] },
      { titulo: "Pastéis", legenda: null, nota: "Preço por unidade.", itens: [
        {"id": "c61", "nome": "Frango", "desc": "", "tag": "", "precos": [9.0], "destaque": false, "on": true},
        {"id": "c62", "nome": "Carne", "desc": "", "tag": "", "precos": [9.0], "destaque": false, "on": true},
        {"id": "c63", "nome": "Calabresa com queijo", "desc": "", "tag": "", "precos": [9.0], "destaque": false, "on": true},
        {"id": "c64", "nome": "Frango com catupiry", "desc": "", "tag": "", "precos": [11.0], "destaque": false, "on": true},
        {"id": "c65", "nome": "Quatro queijos", "desc": "", "tag": "", "precos": [11.0], "destaque": false, "on": true},
        {"id": "c66", "nome": "Chocolate", "desc": "", "tag": "", "precos": [11.0], "destaque": false, "on": true},
        {"id": "c67", "nome": "Queijo do reino", "desc": "", "tag": "", "precos": [12.0], "destaque": true, "on": true},
        {"id": "c68", "nome": "Nutella", "desc": "", "tag": "", "precos": [12.0], "destaque": false, "on": true}
      ] },
      { titulo: "Sobremesas", legenda: null, nota: "", itens: [
        {"id": "c69", "nome": "Pudim de leite", "desc": "", "tag": "", "precos": [10.0], "destaque": false, "on": true},
        {"id": "c70", "nome": "Mousse", "desc": "Morango, maracujá ou limão", "tag": "", "precos": [10.0], "destaque": false, "on": true},
        {"id": "c71", "nome": "Torta", "desc": "Fatia", "tag": "", "precos": [16.99], "destaque": false, "on": true},
        {"id": "c72", "nome": "Cartola", "desc": "Banana, queijo, açúcar e canela", "tag": "", "precos": [16.99], "destaque": true, "on": true}
      ] }
    ] },
    { id: 'drinks', secoes: [
      { titulo: "Drinks", legenda: null, nota: "", itens: [
        {"id": "c73", "nome": "Caipirinha", "desc": "Cachaça Pitú e limão", "tag": "", "precos": [10.0], "destaque": true, "on": true},
        {"id": "c74", "nome": "Caipifruta", "desc": "Morango ou kiwi, Smirnoff e leite moça", "tag": "", "precos": [12.0], "destaque": true, "on": true},
        {"id": "c75", "nome": "Caipiroska", "desc": "Smirnoff e fruta", "tag": "", "precos": [15.0], "destaque": false, "on": true},
        {"id": "c76", "nome": "Coquetel frutas vermelhas", "desc": "Smirnoff, leite moça e Fabbri", "tag": "", "precos": [16.0], "destaque": false, "on": true},
        {"id": "c77", "nome": "Mojito", "desc": "Rum, limão, gelo e soda", "tag": "", "precos": [17.0], "destaque": false, "on": true},
        {"id": "c78", "nome": "Dry Martini", "desc": "Gin e vermouth", "tag": "", "precos": [17.0], "destaque": false, "on": true},
        {"id": "c79", "nome": "Coquetel Quintal Azul", "desc": "Curaçau blue, Schweppes e limão", "tag": "", "precos": [18.0], "destaque": true, "on": true},
        {"id": "c80", "nome": "Mimosa", "desc": "Espumante moscatel e suco de laranja", "tag": "", "precos": [18.0], "destaque": false, "on": true},
        {"id": "c81", "nome": "Gin tônica", "desc": "Tanqueray e tônica Schweppes", "tag": "", "precos": [20.0], "destaque": false, "on": true},
        {"id": "c82", "nome": "Gin Tia Lena", "desc": "Tanqueray com Red Bull melancia, tropical ou açaí", "tag": "", "precos": [20.0], "destaque": true, "on": true},
        {"id": "c83", "nome": "Lena Coffee", "desc": "Café, leite condensado e vodka", "tag": "", "precos": [20.0], "destaque": true, "on": true},
        {"id": "c84", "nome": "Infinity Strawberry", "desc": "Morango, leite condensado e Smirnoff Ice", "tag": "", "precos": [25.0], "destaque": false, "on": true}
      ] },
      { titulo: "Sem álcool", legenda: null, nota: "", itens: [
        {"id": "c85", "nome": "Dona Honra", "desc": "Limão siciliano, água com gás e Fabbri de kiwi e limão", "tag": "", "precos": [13.0], "destaque": false, "on": true},
        {"id": "c86", "nome": "Tropical refrescante", "desc": "Morango, limão e água de coco", "tag": "", "precos": [15.0], "destaque": true, "on": true},
        {"id": "c87", "nome": "Soda italiana", "desc": "Xarope e água com gás", "tag": "", "precos": [15.0], "destaque": false, "on": true}
      ] },
      { titulo: "Cervejas", legenda: ["Long neck", "600 ml"], nota: "", itens: [
        {"id": "c88", "nome": "Heineken", "desc": "", "tag": "", "precos": [8.0, 15.0], "destaque": false, "on": true},
        {"id": "c89", "nome": "Budweiser", "desc": "", "tag": "", "precos": [6.0, 12.0], "destaque": false, "on": true},
        {"id": "c90", "nome": "Spaten", "desc": "", "tag": "", "precos": [6.0, null], "destaque": false, "on": true},
        {"id": "c91", "nome": "Heineken Zero", "desc": "", "tag": "", "precos": [6.0, null], "destaque": false, "on": true},
        {"id": "c92", "nome": "Devassa", "desc": "", "tag": "", "precos": [null, 12.0], "destaque": false, "on": true},
        {"id": "c93", "nome": "Brahma Duplo Malte", "desc": "", "tag": "", "precos": [null, 12.0], "destaque": false, "on": true},
        {"id": "c94", "nome": "Petra", "desc": "", "tag": "", "precos": [null, 12.0], "destaque": false, "on": true},
        {"id": "c95", "nome": "Amstel", "desc": "", "tag": "", "precos": [null, 12.0], "destaque": false, "on": true}
      ] },
      { titulo: "Destilados", legenda: ["Dose", "Litro"], nota: "", itens: [
        {"id": "c96", "nome": "Vodka Orloff", "desc": "", "tag": "", "precos": [5.0, 40.0], "destaque": false, "on": true},
        {"id": "c97", "nome": "Vodka Absolut", "desc": "", "tag": "", "precos": [12.0, 140.0], "destaque": false, "on": true},
        {"id": "c98", "nome": "Whisky Black & White", "desc": "", "tag": "", "precos": [8.0, null], "destaque": false, "on": true},
        {"id": "c99", "nome": "Whisky Red Label", "desc": "", "tag": "", "precos": [10.0, 160.0], "destaque": false, "on": true},
        {"id": "c100", "nome": "Whisky Old Parr", "desc": "", "tag": "", "precos": [12.0, 200.0], "destaque": false, "on": true},
        {"id": "c101", "nome": "Cachaça", "desc": "Dose", "tag": "", "precos": [4.0, null], "destaque": false, "on": true},
        {"id": "c102", "nome": "Rum", "desc": "Dose", "tag": "", "precos": [4.0, null], "destaque": false, "on": true}
      ] },
      { titulo: "Água, refri e sucos", legenda: null, nota: "", itens: [
        {"id": "c103", "nome": "Água sem gás", "desc": "", "tag": "", "precos": [4.0], "destaque": false, "on": true},
        {"id": "c104", "nome": "Água com gás", "desc": "", "tag": "", "precos": [5.0], "destaque": false, "on": true},
        {"id": "c105", "nome": "Suco", "desc": "Copo", "tag": "", "precos": [6.0], "destaque": false, "on": true},
        {"id": "c106", "nome": "Suco", "desc": "Jarra", "tag": "", "precos": [12.0], "destaque": false, "on": true},
        {"id": "c107", "nome": "Refrigerante", "desc": "Lata", "tag": "", "precos": [7.0], "destaque": false, "on": true},
        {"id": "c108", "nome": "Refrigerante", "desc": "1 litro", "tag": "", "precos": [10.0], "destaque": false, "on": true},
        {"id": "c109", "nome": "Schweppes Citrus", "desc": "", "tag": "", "precos": [6.0], "destaque": false, "on": true},
        {"id": "c110", "nome": "Smirnoff Ice", "desc": "", "tag": "", "precos": [8.0], "destaque": false, "on": true},
        {"id": "c111", "nome": "Energético", "desc": "", "tag": "", "precos": [10.0], "destaque": false, "on": true}
      ] }
    ] }
  ],
  eventos: [
    { id: 1, nome: 'Patrícia Melo', tipo: 'Aniversário', data: '2026-12-06', pessoas: 35, status: 'novo', criado: '2026-11-24T19:12:00' },
    { id: 2, nome: 'Escritório Contábil Agreste', tipo: 'Confraternização', data: '2026-12-12', pessoas: 22, status: 'orcado', criado: '2026-11-21T10:40:00' },
    { id: 3, nome: 'Rafael e Bia', tipo: 'Chá de bebê / revelação', data: '2026-12-20', pessoas: 40, status: 'fechado', criado: '2026-11-15T16:05:00' }
  ]
};

// Horário de funcionamento (0 = domingo)
const HORARIO = { 0: [11, 15], 1: [11, 21], 2: [11, 21], 3: [11, 21], 4: [11, 21], 5: [11, 21], 6: [11, 21] };

const Store = {
  get() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return { ...structuredClone(STORE_DEFAULTS), ...JSON.parse(raw) };
    } catch (e) { /* sem storage: usa padrão */ }
    return structuredClone(STORE_DEFAULTS);
  },
  set(data) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch (e) { /* ignora */ }
  },
  update(fn) {
    const d = this.get();
    fn(d);
    this.set(d);
    return d;
  },
  reset() {
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignora */ }
  }
};

// Situação da casa agora: { aberto, texto }
function situacaoAgora(data, now = new Date()) {
  const d = now.getDay();
  const h = now.getHours() + now.getMinutes() / 60;
  if (data.status === 'fechado') return { aberto: false, texto: 'Fechado hoje' };
  const [ab, fe] = HORARIO[d];
  if (h >= ab && h < fe) return { aberto: true, texto: `Aberto agora · fecha às ${fe}h` };
  if (h < ab) return { aberto: false, texto: `Fechado · abre hoje às ${ab}h` };
  const amanha = HORARIO[(d + 1) % 7][0];
  return { aberto: false, texto: `Fechado · abre amanhã às ${amanha}h` };
}

const fmtPreco = (n) => Number(n).toLocaleString('pt-BR', { minimumFractionDigits: Number.isInteger(+n) ? 0 : 2, maximumFractionDigits: 2 });

// Preço do cardápio: 19.99 -> "19,99"; null -> "—"
const fmtValor = (n) => (n == null ? '—' : Number(n).toFixed(2).replace('.', ','));
// "19,99" / "19.99" / "R$ 19,9" -> 19.99; vazio ou traço -> null; inválido -> NaN
function lerValor(txt) {
  const t = String(txt).replace(/r\$|\s/gi, '').replace(',', '.');
  if (t === '' || /^[-—–]+$/.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : NaN;
}
