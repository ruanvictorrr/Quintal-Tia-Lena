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
    { dia: 2, rotulo: 'Terça', titulo: 'Terça do Clone', texto: 'Caipirinha, batata, caldinhos e mini pastéis em dobro.' },
    { dia: 3, rotulo: 'Quarta', titulo: 'Quarta dos Combos', texto: 'Pizza G muçarela ou calabresa + refri 1 L por R$ 42. Happy hour das 17h às 20h.' },
    { dia: 4, rotulo: 'Quinta', titulo: 'Quinta da Long Neck', texto: 'Balde com 5 long necks por R$ 25.' },
    { dia: 5, rotulo: 'Sexta', titulo: 'A Sexta tá Massa!', texto: 'Lasanha individual a partir de R$ 17,99. Happy hour das 17h às 20h.' },
    { dia: '6,0', rotulo: 'Sáb e dom', titulo: 'Feijoada com caipirinha', texto: 'Na feijoada individual, a primeira caipirinha é por conta da casa.' }
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
