// Área do gerente — Quintal de Tia Lena.
// Entrar com PIN, controlar aberto/fechado, aviso do site, buffet do dia, preço,
// promoções e pedidos de evento. Tudo gravado no Store, que o site lê.

const PIN = '2026'; // demonstração (num projeto real: login com senha de cada usuário)
const SESSAO = 'tialena-painel';
const $ = (id) => document.getElementById(id);

let filtro = 'todos';
let ultimoNovo = null;

// ---------- Utilidades ----------
function el(tag, attrs = {}, ...filhos) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v == null || v === false) return;
    if (k === 'text') n.textContent = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  });
  filhos.flat().forEach((f) => f != null && n.append(f));
  return n;
}

let toastTimer;
function avisar(msg = 'Salvo · já aparece no site') {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-on'), 2200);
}

const dataCurta = (iso) => {
  if (!iso) return { d: '—', m: 'a definir' };
  const dt = new Date(iso + 'T12:00');
  return { d: dt.getDate(), m: dt.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '') };
};
const haQuanto = (iso) => {
  const min = Math.round((Date.now() - new Date(iso)) / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? 'ontem' : `há ${d} dias`;
};

// ---------- Entrada ----------
function logado() { try { return sessionStorage.getItem(SESSAO) === '1'; } catch { return false; } }
function mostrarApp(sim) {
  $('login').hidden = sim;
  $('app').hidden = !sim;
  if (sim) desenharTudo();
  else $('pin').focus();
}
$('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if ($('pin').value === PIN) {
    try { sessionStorage.setItem(SESSAO, '1'); } catch { /* navegação privada */ }
    mostrarApp(true);
  } else {
    $('pinErro').textContent = 'PIN incorreto. Tente de novo.';
    $('pinErro').hidden = false;
    $('pin').select();
  }
});
$('sair').addEventListener('click', () => {
  try { sessionStorage.removeItem(SESSAO); } catch { /* ignora */ }
  $('pin').value = '';
  mostrarApp(false);
});

// ---------- Navegação ----------
const VIEWS = ['hoje', 'buffet', 'cardapio', 'eventos', 'promos'];
function irPara(v) {
  VIEWS.forEach((n) => { $('v-' + n).hidden = n !== v; });
  document.querySelectorAll('.tabbar button').forEach((b) => {
    if (b.dataset.view === v) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0 });
}
document.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => irPara(b.dataset.view)));
document.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => irPara(b.dataset.go)));

// ---------- HOJE ----------
function desenharHoje(d) {
  const agora = new Date();
  const h = agora.getHours();
  $('saudacao').textContent = h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
  $('dataHoje').textContent = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  const s = situacaoAgora(d);
  $('statStatus').classList.toggle('is-open', s.aberto);
  $('statStatus').classList.toggle('is-closed', !s.aberto);
  $('sStatus').textContent = s.aberto ? 'Aberto' : 'Fechado';
  $('sStatusSub').textContent = s.texto.replace(/^(Aberto agora|Fechado) · /, '').replace('Fechado hoje', 'marcado por você');
  $('sPratos').textContent = d.buffet.filter((b) => b.on).length;
  const novos = d.eventos.filter((e) => e.status === 'novo').length;
  $('sNovos').textContent = novos;
  $('sPreco').textContent = fmtPreco(d.preco);
  $('tabBadge').textContent = novos;
  $('tabBadge').hidden = !novos;

  document.querySelectorAll('.seg button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.status === d.status)));

  if (document.activeElement !== $('aviso')) $('aviso').value = d.aviso;
  $('avisoCount').textContent = `${$('aviso').value.length}/140`;

  $('evResumo').replaceChildren(...(d.eventos.length
    ? d.eventos.slice(0, 3).map((e) => itemEvento(e, true))
    : [el('li', { class: 'empty', text: 'Nenhum pedido ainda.' })]));
}

document.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => {
  const d = Store.update((x) => { x.status = b.dataset.status; });
  desenharHoje(d);
  avisar(b.dataset.status === 'fechado' ? 'Site mostrando "Fechado hoje"' : 'Site seguindo o horário normal');
}));
$('aviso').addEventListener('input', () => { $('avisoCount').textContent = `${$('aviso').value.length}/140`; });
$('avisoSalvar').addEventListener('click', () => {
  const txt = $('aviso').value.trim();
  Store.update((x) => { x.aviso = txt; });
  avisar(txt ? 'Aviso publicado no site' : 'Aviso removido');
});
$('avisoLimpar').addEventListener('click', () => {
  $('aviso').value = '';
  Store.update((x) => { x.aviso = ''; });
  $('avisoCount').textContent = '0/140';
  avisar('Aviso removido');
});

// ---------- BUFFET ----------
function desenharBuffet(d) {
  if (document.activeElement !== $('preco')) $('preco').value = d.preco;
  $('buffetCount').textContent = d.buffet.filter((b) => b.on).length;
  $('dishes').replaceChildren(...d.buffet.map((b, i) => {
    const id = 'dish-' + i;
    return el('li', { class: 'dish' + (b.on ? '' : ' is-off') },
      el('label', { for: id },
        el('input', { id, type: 'checkbox', class: 'switch', ...(b.on ? { checked: '' } : {}), onchange: (e) => {
          const nd = Store.update((x) => { x.buffet[i].on = e.target.checked; });
          desenharBuffet(nd); desenharHoje(nd);
          avisar(e.target.checked ? `${b.nome} no buffet` : `${b.nome} saiu do buffet`);
        } }),
        el('span', { class: 'dish-name', text: b.nome })),
      el('button', { type: 'button', class: 'del', 'aria-label': `Remover ${b.nome} da lista`, text: '×', onclick: () => {
        const nd = Store.update((x) => { x.buffet.splice(i, 1); });
        desenharBuffet(nd); desenharHoje(nd);
        avisar(`${b.nome} removido da lista`);
      } }));
  }));
}

function salvarPreco(v) {
  const n = Math.max(1, Math.round(Number(v) * 2) / 2);
  if (!Number.isFinite(n)) return;
  const d = Store.update((x) => { x.preco = n; });
  $('preco').value = n;
  desenharHoje(d);
  avisar(`Prato livre agora R$ ${fmtPreco(n)}`);
}
$('precoMenos').addEventListener('click', () => salvarPreco(Number($('preco').value) - 1));
$('precoMais').addEventListener('click', () => salvarPreco(Number($('preco').value) + 1));
$('preco').addEventListener('change', () => salvarPreco($('preco').value));

$('addForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = $('addNome').value.trim();
  if (!nome) return $('addNome').focus();
  const d = Store.update((x) => { x.buffet.push({ nome, on: true }); });
  $('addNome').value = '';
  desenharBuffet(d); desenharHoje(d);
  avisar(`${nome} adicionado ao buffet`);
});

$('copiar').addEventListener('click', async () => {
  const d = Store.get();
  const dia = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
  const txt = `🍽️ Hoje (${dia}) no Quintal de Tia Lena:\n\n` +
    d.buffet.filter((b) => b.on).map((b) => `• ${b.nome}`).join('\n') +
    `\n\nSelf-service sem balança por R$ ${fmtPreco(d.preco)}\n📍 Av. Portugal, 480 · Universitário`;
  try { await navigator.clipboard.writeText(txt); avisar('Lista copiada, é só colar no WhatsApp'); }
  catch { avisar('Não deu para copiar neste navegador'); }
});

// ---------- CARDÁPIO ----------
let catAtual = 'pratos';
let editando = null; // { s: índice da seção, i: índice do item ou null para novo }

const catDe = (d) => d.cardapio.find((c) => c.id === catAtual);
const rotulosPreco = (s) => s.legenda || ['Preço'];

function mexerItem(si, ii, fn, msg) {
  const d = Store.update((x) => { fn(x.cardapio.find((c) => c.id === catAtual).secoes[si].itens[ii]); });
  desenharCardapio(d);
  if (msg) avisar(msg);
}

function campoPreco(item, si, ii, k, rotulo) {
  const id = `pr-${item.id}-${k}`;
  return el('label', { class: 'mi-preco', for: id },
    el('small', { text: rotulo }),
    el('span', { class: 'mi-rs' }, 'R$',
      el('input', { id, type: 'text', inputmode: 'decimal', value: fmtValor(item.precos[k]), 'aria-label': `${rotulo} de ${item.nome}`,
        onfocus: (e) => e.target.select(),
        onkeydown: (e) => { if (e.key === 'Enter') e.target.blur(); },
        onchange: (e) => {
          const v = lerValor(e.target.value);
          if (Number.isNaN(v)) { e.target.value = fmtValor(item.precos[k]); return avisar('Preço inválido. Use algo como 24,90'); }
          mexerItem(si, ii, (it) => { it.precos[k] = v; }, v == null ? `${item.nome}: sem preço nesse tamanho` : `${item.nome} agora R$ ${fmtValor(v)}`);
        } })));
}

function linhaItem(item, s, si, ii) {
  const sw = 'on-' + item.id;
  return el('li', { class: 'mi' + (item.on ? '' : ' is-off') },
    el('div', { class: 'mi-top' },
      el('div', { class: 'mi-nome' },
        el('b', {}, item.nome, item.tag ? el('span', { class: 'mi-tag', text: item.tag }) : null),
        item.desc ? el('small', { text: item.desc }) : null),
      el('button', { type: 'button', id: 'st-' + item.id, class: 'star', 'aria-pressed': String(item.destaque),
        'aria-label': `${item.destaque ? 'Tirar dos' : 'Colocar nos'} destaques: ${item.nome}`, text: item.destaque ? '★' : '☆',
        onclick: () => mexerItem(si, ii, (it) => { it.destaque = !it.destaque; }, item.destaque ? `${item.nome} saiu dos destaques` : `${item.nome} nos destaques do site`) }),
      el('button', { type: 'button', id: 'ed-' + item.id, class: 'edit', 'aria-label': `Editar ${item.nome}`, text: '✎', onclick: () => abrirItem(si, ii) })),
    el('div', { class: 'mi-bottom' },
      el('label', { class: 'mi-on', for: sw },
        el('input', { id: sw, type: 'checkbox', class: 'switch', ...(item.on ? { checked: '' } : {}),
          onchange: (e) => mexerItem(si, ii, (it) => { it.on = e.target.checked; }, e.target.checked ? `${item.nome} voltou ao cardápio` : `${item.nome} marcado como em falta`) }),
        el('span', { text: item.on ? 'Tem hoje' : 'Em falta' })),
      el('div', { class: 'mi-precos' }, ...item.precos.map((_, k) => campoPreco(item, si, ii, k, rotulosPreco(s)[k])))));
}

function desenharCardapio(d) {
  const foco = document.activeElement && document.activeElement.id;
  const todos = (c) => c.secoes.reduce((a, s) => a + s.itens.length, 0);
  document.querySelectorAll('#catFiltros button').forEach((b) => {
    b.setAttribute('aria-selected', String(b.dataset.cat === catAtual));
    b.querySelector('span').textContent = todos(d.cardapio.find((c) => c.id === b.dataset.cat));
  });
  const cat = catDe(d);
  const itens = cat.secoes.flatMap((s) => s.itens);
  const nDest = itens.filter((i) => i.destaque).length;
  const nOff = itens.filter((i) => !i.on).length;
  $('catResumo').replaceChildren(
    el('span', { class: nDest > 8 ? 'warn' : null, text: `★ ${nDest} em destaque${nDest > 8 ? ' (o ideal é até 8)' : nDest === 0 ? ' (o site mostra os 6 primeiros)' : ''}` }),
    el('span', { text: nOff ? `${nOff} em falta` : 'nada em falta' }));
  $('catSecoes').replaceChildren(...cat.secoes.map((s, si) => el('article', { class: 'card cat-sec' },
    el('div', { class: 'card-row' }, el('h2', {}, s.titulo, el('span', { class: 'pill', text: s.itens.length })),
      el('button', { type: 'button', class: 'link-btn', text: '+ Item', 'aria-label': `Adicionar item em ${s.titulo}`, onclick: () => abrirItem(si, null) })),
    s.nota ? el('p', { class: 'card-sub', text: s.nota }) : null,
    s.itens.length ? el('ul', { class: 'mi-list' }, ...s.itens.map((it, ii) => linhaItem(it, s, si, ii)))
      : el('p', { class: 'empty', text: 'Nenhum item nesta seção.' }))));
  if (foco && $(foco)) $(foco).focus();
}
document.querySelectorAll('#catFiltros button').forEach((b) => b.addEventListener('click', () => { catAtual = b.dataset.cat; desenharCardapio(Store.get()); }));

const itemSheet = $('itemSheet');
const itemForm = $('itemForm');
function abrirItem(si, ii) {
  const s = catDe(Store.get()).secoes[si];
  const it = ii == null ? null : s.itens[ii];
  editando = { si, ii };
  itemForm.reset();
  $('itemErro').hidden = true;
  $('itemTitulo').textContent = it ? 'Editar item' : 'Novo item';
  $('itemSecao').textContent = `Seção: ${s.titulo}`;
  $('itemExcluir').hidden = !it;
  itemForm.nome.value = it ? it.nome : '';
  itemForm.desc.value = it ? it.desc : '';
  itemForm.tag.value = it ? it.tag : '';
  itemForm.destaque.checked = !!(it && it.destaque);
  $('itemPrecos').replaceChildren(...rotulosPreco(s).map((r, k) => el('label', { class: 'field' }, `${r} (R$)`,
    el('input', { name: 'p' + k, type: 'text', inputmode: 'decimal', placeholder: s.legenda ? 'vazio = não tem' : '0,00', value: it ? (it.precos[k] == null ? '' : fmtValor(it.precos[k])) : '' }))));
  itemSheet.showModal();
  itemForm.nome.focus();
}
itemSheet.addEventListener('click', (e) => { if (e.target === itemSheet || e.target.closest('[data-fechar]')) itemSheet.close(); });
itemForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const { si, ii } = editando;
  const s = catDe(Store.get()).secoes[si];
  const nome = itemForm.nome.value.trim();
  const precos = rotulosPreco(s).map((_, k) => lerValor(itemForm['p' + k].value));
  const erro = nome.length < 2 ? 'Escreva o nome do item.'
    : precos.some(Number.isNaN) ? 'Algum preço está estranho. Use algo como 24,90.'
    : precos.every((p) => p == null) ? 'Coloque pelo menos um preço.' : '';
  if (erro) { $('itemErro').textContent = erro; $('itemErro').hidden = false; return; }
  const dadosItem = { nome, desc: itemForm.desc.value.trim(), tag: itemForm.tag.value.trim(), precos, destaque: itemForm.destaque.checked };
  const d = Store.update((x) => {
    const sec = x.cardapio.find((c) => c.id === catAtual).secoes[si];
    if (ii == null) sec.itens.push({ id: 'n' + Date.now(), on: true, ...dadosItem });
    else Object.assign(sec.itens[ii], dadosItem);
  });
  itemSheet.close();
  desenharCardapio(d);
  avisar(ii == null ? `${nome} adicionado ao cardápio` : `${nome} atualizado`);
});
$('itemExcluir').addEventListener('click', () => {
  const { si, ii } = editando;
  const it = catDe(Store.get()).secoes[si].itens[ii];
  if (!confirm(`Excluir "${it.nome}" do cardápio?`)) return;
  const d = Store.update((x) => { x.cardapio.find((c) => c.id === catAtual).secoes[si].itens.splice(ii, 1); });
  itemSheet.close();
  desenharCardapio(d);
  avisar(`${it.nome} excluído do cardápio`);
});

// ---------- EVENTOS ----------
const ROTULO = { novo: 'Novo', orcado: 'Orçado', fechado: 'Fechado', perdido: 'Não fechou' };

function mudarStatus(id, status) {
  const d = Store.update((x) => { const ev = x.eventos.find((e) => e.id === id); if (ev) ev.status = status; });
  desenharTudo(d);
  avisar(`Pedido marcado como ${ROTULO[status].toLowerCase()}`);
}

function acoes(e) {
  const b = (txt, st, cls = 'ghost') => el('button', { type: 'button', class: `btn-s ${cls}`, text: txt, onclick: () => mudarStatus(e.id, st) });
  if (e.status === 'novo') return [b('Orçamento enviado', 'orcado', 'sun'), b('Não fechou', 'perdido')];
  if (e.status === 'orcado') return [b('Fechou!', 'fechado', 'solid'), b('Não fechou', 'perdido')];
  return [b('Desfazer', e.status === 'fechado' ? 'orcado' : 'novo')];
}

function itemEvento(e, compacto = false) {
  const { d, m } = dataCurta(e.data);
  return el('li', { class: `ev is-${e.status}${e.id === ultimoNovo ? ' is-new' : ''}` },
    el('div', { class: 'ev-date' }, el('b', { text: d }), el('small', { text: m })),
    el('p', { class: 'ev-name' }, e.nome, el('span', { class: `st st-${e.status}`, text: ROTULO[e.status] })),
    el('p', { class: 'ev-meta' },
      el('span', { text: e.tipo }),
      el('span', { text: e.pessoas ? `${e.pessoas} convidados` : 'convidados a definir' }),
      compacto ? null : el('span', { text: `${e.origem === 'telefone' ? 'por telefone' : 'pelo site'} · ${haQuanto(e.criado)}` })),
    compacto ? null : el('div', { class: 'ev-acts' }, ...acoes(e)));
}

function desenharEventos(d) {
  const conta = (f) => (f === 'todos' ? d.eventos.length : d.eventos.filter((e) => e.status === f).length);
  document.querySelectorAll('#filtros button').forEach((b) => {
    b.setAttribute('aria-selected', String(b.dataset.f === filtro));
    b.querySelector('span').textContent = conta(b.dataset.f);
  });
  const lista = filtro === 'todos' ? d.eventos : d.eventos.filter((e) => e.status === filtro);
  $('evVazio').hidden = lista.length > 0;
  $('evLista').replaceChildren(...lista.map((e) => itemEvento(e)));
}
document.querySelectorAll('#filtros button').forEach((b) => b.addEventListener('click', () => { filtro = b.dataset.f; desenharEventos(Store.get()); }));

const sheet = $('sheet');
const evForm = $('evForm');
$('novoEvento').addEventListener('click', () => {
  evForm.reset();
  $('evErro').hidden = true;
  evForm.data.min = new Date().toISOString().slice(0, 10);
  sheet.showModal();
  evForm.nome.focus();
});
sheet.addEventListener('click', (e) => { if (e.target === sheet || e.target.closest('[data-fechar]')) sheet.close(); });
evForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = evForm.nome.value.trim();
  const pessoas = Number(evForm.pessoas.value);
  if (nome.length < 2 || !evForm.data.value || !pessoas) {
    $('evErro').textContent = 'Preencha nome, data e número de convidados.';
    $('evErro').hidden = false;
    return;
  }
  const novo = { id: Date.now(), nome, tipo: evForm.tipo.value, data: evForm.data.value, pessoas, status: 'novo', origem: 'telefone', criado: new Date().toISOString() };
  ultimoNovo = novo.id;
  const d = Store.update((x) => { x.eventos.unshift(novo); });
  sheet.close();
  filtro = 'todos';
  desenharTudo(d);
  avisar('Pedido salvo');
});

// ---------- PROMOÇÕES ----------
function desenharPromos(d) {
  const hoje = String(new Date().getDay());
  const form = $('promoForm');
  form.replaceChildren(
    ...d.promos.map((p, i) => el('div', { class: 'promo' + (String(p.dia).split(',').includes(hoje) ? ' is-today' : '') },
      el('p', { class: 'promo-day' }, p.rotulo, String(p.dia).split(',').includes(hoje) ? el('em', { text: 'hoje' }) : null),
      el('label', { class: 'field' }, 'Título', el('input', { name: `t${i}`, type: 'text', value: p.titulo, maxlength: '40' })),
      el('label', { class: 'field' }, 'Descrição', el('textarea', { name: `x${i}`, rows: '2', maxlength: '140' }, p.texto)))),
    el('button', { class: 'btn btn-green promo-save', type: 'submit', text: 'Salvar promoções' }));
}
$('promoForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  Store.update((x) => x.promos.forEach((p, i) => {
    p.titulo = f[`t${i}`].value.trim() || p.titulo;
    p.texto = f[`x${i}`].value.trim();
  }));
  avisar('Promoções atualizadas no site');
});

// ---------- Geral ----------
function desenharTudo(d = Store.get()) {
  desenharHoje(d);
  desenharBuffet(d);
  desenharEventos(d);
  if (!$('catSecoes').contains(document.activeElement) && !itemSheet.open) desenharCardapio(d);
  if (!$('promoForm').contains(document.activeElement)) desenharPromos(d);
}

$('resetar').addEventListener('click', () => {
  if (!confirm('Voltar todos os dados para o exemplo inicial?')) return;
  Store.reset();
  desenharTudo();
  avisar('Dados de exemplo restaurados');
});

// Pedido novo feito no site em outra aba aparece aqui sem recarregar
window.addEventListener('storage', (e) => { if (e.key === STORE_KEY && logado()) desenharTudo(); });
setInterval(() => { if (logado()) desenharHoje(Store.get()); }, 60000);

mostrarApp(logado());
