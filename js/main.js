// Quintal de Tia Lena — site

// WhatsApp do restaurante (55 + DDD + número). Número do cadastro da empresa: confirmar com a Tia Lena.
const WHATSAPP = '5581989074817';
const waLink = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

document.querySelectorAll('[data-wa]').forEach((a) => { a.href = waLink(a.dataset.wa); });

const $ = (id) => document.getElementById(id);
const dados = Store.get();
const hoje = new Date();

// Menu mobile
const menuBtn = $('menuBtn');
const menu = $('menu');
menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  menuBtn.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  menu.classList.toggle('is-open', !open);
});
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  menuBtn.setAttribute('aria-expanded', 'false');
  menu.classList.remove('is-open');
}));

// Borda da barra ao rolar
const topbar = $('topbar');
const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Aviso publicado pelo gerente
if (dados.aviso.trim()) {
  $('avisoTxt').textContent = dados.aviso;
  $('aviso').hidden = false;
}

// Aberto / fechado agora
function pintarStatus() {
  const s = situacaoAgora(dados);
  ['statusHero', 'statusVisit'].forEach((id) => {
    const el = $(id);
    el.classList.toggle('is-open', s.aberto);
    el.classList.toggle('is-closed', !s.aberto);
    el.querySelector('.status-txt').textContent = s.texto;
  });
}
pintarStatus();
setInterval(pintarStatus, 60000);

// Linha de hoje na tabela de horários
document.querySelectorAll('#hours tr').forEach((tr) => {
  tr.classList.toggle('is-today', tr.dataset.days.split(',').includes(String(hoje.getDay())));
});

// Preço e buffet do dia
$('preco').textContent = fmtPreco(dados.preco);
$('hojeData').textContent = '· ' + hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const noBuffet = dados.buffet.filter((b) => b.on);
$('buffetHoje').replaceChildren(...noBuffet.map((b) => {
  const li = document.createElement('li');
  li.textContent = b.nome;
  return li;
}));

// Semana no Quintal (editável no painel)
$('week').replaceChildren(...dados.promos.map((p) => {
  const li = document.createElement('li');
  if (String(p.dia).split(',').includes(String(hoje.getDay()))) li.classList.add('is-today');
  const wd = document.createElement('span'); wd.className = 'wd'; wd.textContent = p.rotulo;
  const h3 = document.createElement('h3'); h3.textContent = p.titulo;
  const tx = document.createElement('p'); tx.textContent = p.texto;
  li.append(wd, h3, tx);
  return li;
}));

// Abas do cardápio
const tabs = [...document.querySelectorAll('.tab')];
const photo = $('menuPhoto');
function abrirAba(tab, foco = false) {
  tabs.forEach((t) => {
    const ativa = t === tab;
    t.setAttribute('aria-selected', String(ativa));
    t.tabIndex = ativa ? 0 : -1;
    $(t.getAttribute('aria-controls')).hidden = !ativa;
  });
  const painel = $(tab.getAttribute('aria-controls'));
  const img = photo.querySelector('img');
  if (img.getAttribute('src') !== painel.dataset.img) {
    photo.classList.add('is-swapping');
    setTimeout(() => {
      img.src = painel.dataset.img;
      img.alt = painel.dataset.alt;
      img.onload = () => photo.classList.remove('is-swapping');
    }, 180);
  }
  if (foco) tab.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => abrirAba(t));
  t.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') abrirAba(tabs[(i + 1) % tabs.length], true);
    if (e.key === 'ArrowLeft') abrirAba(tabs[(i - 1 + tabs.length) % tabs.length], true);
  });
});

// Pedido de evento: registra para o painel do gerente e abre o WhatsApp
$('evForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  const nome = f.nome.value.trim() || 'Cliente do site';
  const pedido = {
    id: Date.now(),
    nome,
    tipo: f.tipo.value,
    data: f.data.value,
    pessoas: Number(f.pessoas.value) || 0,
    status: 'novo',
    origem: 'site',
    criado: new Date().toISOString()
  };
  Store.update((d) => { d.eventos.unshift(pedido); });
  const dataTxt = pedido.data ? new Date(pedido.data + 'T12:00').toLocaleDateString('pt-BR') : 'a combinar';
  const msg = `Olá, Tia Lena! Quero um orçamento de evento.\nTipo: ${pedido.tipo}\nData: ${dataTxt}\nConvidados: ${pedido.pessoas || 'a definir'}\nNome: ${nome}`;
  window.open(waLink(msg), '_blank', 'noopener');
  f.reset();
});

// Entrada suave das seções
const io = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
if (io) document.querySelectorAll('.sec-head, .ss-media, .price-card, .menu-wrap, .week li, .gallery figure, .ev-form, .reviews blockquote, .map').forEach((el) => { el.classList.add('reveal'); io.observe(el); });

// Atualiza se o gerente mudar algo em outra aba
window.addEventListener('storage', (e) => { if (e.key === STORE_KEY) location.reload(); });

$('year').textContent = hoje.getFullYear();
