'use strict';

/* ================= 常量与工具 ================= */
const LS_RECORDS = 'jz_records_v1';
const LS_CATS = 'jz_custom_cats_v1';

const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const ICONS = {
  food: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>',
  bus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
  dots: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>',
  trend: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  coffee: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>',
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>'
};

const COLOR_PALETTE = ['#ff8f1f', '#3a7afe', '#ff5b6b', '#9b59f6', '#00b8d9', '#07c160', '#f4602a', '#5a67d8', '#e84393', '#8a94a6'];

const DEFAULT_EXPENSE_CATS = [
  { id: 'food', name: '餐饮', color: '#ffb300', icon: 'food', type: 'expense' },
  { id: 'transport', name: '交通', color: '#3a7afe', icon: 'bus', type: 'expense' },
  { id: 'shopping', name: '购物', color: '#ff5b6b', icon: 'bag', type: 'expense' },
  { id: 'entertainment', name: '娱乐', color: '#9b59f6', icon: 'game', type: 'expense' },
  { id: 'study', name: '学习', color: '#00b8d9', icon: 'book', type: 'expense' },
  { id: 'device', name: '电子设备', color: '#5a67d8', icon: 'phone', type: 'expense' },
  { id: 'hema', name: '盒马', color: '#f4602a', icon: 'cart', type: 'expense' },
  { id: 'other-expense', name: '其他', color: '#8a94a6', icon: 'dots', type: 'expense' }
];

const DEFAULT_INCOME_CATS = [
  { id: 'salary', name: '工资', color: '#07c160', icon: 'wallet', type: 'income' },
  { id: 'bonus', name: '奖金', color: '#f59e0b', icon: 'trophy', type: 'income' },
  { id: 'invest', name: '理财', color: '#3a7afe', icon: 'trend', type: 'income' },
  { id: 'other-income', name: '其他', color: '#8a94a6', icon: 'dots', type: 'income' }
];

const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const nowParts = () => { const d = new Date(); return { date: fmtDate(d), time: fmtTime(d) }; };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const round2 = (n) => Math.round(n * 100) / 100;

function fmtMoney(n) {
  const s = n.toFixed(2);
  const [int, dec] = s.split('.');
  return '¥' + int.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + dec;
}

/* ================= 数据 ================= */
function loadRecords() {
  try { return JSON.parse(localStorage.getItem(LS_RECORDS) || '[]'); }
  catch (e) { return []; }
}
function saveRecords(rs) { localStorage.setItem(LS_RECORDS, JSON.stringify(rs)); }

function loadCats() {
  let custom = [];
  try { custom = JSON.parse(localStorage.getItem(LS_CATS) || '[]'); } catch (e) { custom = []; }
  return [...DEFAULT_EXPENSE_CATS, ...DEFAULT_INCOME_CATS, ...custom];
}
function saveCustomCats(custom) { localStorage.setItem(LS_CATS, JSON.stringify(custom)); }

function catById(id) { return loadCats().find((c) => c.id === id); }
function catsByType(type) { return loadCats().filter((c) => c.type === type); }

/* ================= 状态 ================= */
const state = {
  type: 'expense',
  amount: '',
  catId: null,
  note: '',
  editingId: null,
  month: ''
};

const catDraft = { icon: 'dots', color: COLOR_PALETTE[0] };

/* ================= Toast ================= */
let toastTimer = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

/* ================= 视图切换 ================= */
const TITLES = { record: '记一笔', list: '明细', stats: '统计', settings: '设置' };

function switchView(name) {
  $$('.view').forEach((v) => v.classList.remove('active'));
  $('#view-' + name).classList.add('active');
  $$('.tab').forEach((t) => t.classList.toggle('active', t.dataset.view === name));
  $('#header-title').textContent = TITLES[name];
  if (name === 'list') renderList();
  if (name === 'stats') renderStats();
  if (name === 'settings') renderCatManage();
}

/* ================= 记账表单 ================= */
function setType(type, editMode) {
  const root = editMode ? $('#edit-type-switch') : $('#type-switch');
  root.querySelectorAll('.type-btn').forEach((b) => b.classList.toggle('active', b.dataset.type === type));
  const target = editMode ? state : state;
  target.type = type;
  if (!catsByType(type).some((c) => c.id === state.catId)) state.catId = null;
  renderCatGrid(editMode);
}

function updateAmountDisplay(editMode) {
  const el = editMode ? $('#edit-amount-display') : $('#amount-display');
  el.textContent = state.amount === '' ? '0.00' : state.amount;
}

function renderCatGrid(editMode) {
  const grid = editMode ? $('#edit-cat-grid') : $('#cat-grid');
  const cats = catsByType(state.type);
  grid.innerHTML = cats.map((c) => {
    const sel = state.catId === c.id ? ' sel' : '';
    const tint = c.color + '22';
    return `<button class="cat-item${sel}" data-cat="${c.id}" style="--cat:${c.color}">
      <span class="cat-ic" style="background:${tint};color:${c.color}">${ICONS[c.icon] || ICONS.dots}</span>
      <span>${c.name}</span>
    </button>`;
  }).join('');
}

function onKey(key, editMode) {
  if (key === 'del') {
    state.amount = state.amount.slice(0, -1);
  } else if (key === '.') {
    if (!state.amount.includes('.')) state.amount = state.amount === '' ? '0.' : state.amount + '.';
  } else {
    const dec = state.amount.includes('.') ? state.amount.split('.')[1] : '';
    if (dec.length >= 2) return;
    if (state.amount.replace('.', '').length >= 10) return;
    state.amount = state.amount === '0' ? key : state.amount + key;
  }
  updateAmountDisplay(editMode);
}

function resetForm() {
  state.amount = '';
  state.catId = null;
  state.note = '';
  state.editingId = null;
  $('#type-switch').querySelectorAll('.type-btn').forEach((b) => b.classList.toggle('active', b.dataset.type === state.type));
  const n = nowParts();
  $('#date-input').value = n.date;
  $('#time-input').value = n.time;
  $('#note-input').value = '';
  updateAmountDisplay(false);
  renderCatGrid(false);
}

function saveRecord() {
  const amount = parseFloat(state.amount);
  if (!amount || amount <= 0) { toast('请输入金额'); return; }
  if (!state.catId) { toast('请选择分类'); return; }
  const editing = Boolean(state.editingId);
  const note = (editing ? $('#edit-note-input') : $('#note-input')).value.trim();
  const date = (editing ? $('#edit-date-input') : $('#date-input')).value || nowParts().date;
  const time = (editing ? $('#edit-time-input') : $('#time-input')).value || nowParts().time;
  const rs = loadRecords();

  if (editing) {
    const i = rs.findIndex((r) => r.id === state.editingId);
    if (i > -1) {
      rs[i] = { ...rs[i], type: state.type, amount: round2(amount), category: state.catId, note, date, time };
      saveRecords(rs);
      toast('已更新');
      closeEdit();
    }
  } else {
    rs.push({ id: uid(), type: state.type, amount: round2(amount), category: state.catId, note, date, time, createdAt: Date.now() });
    saveRecords(rs);
    toast('已记账');
    resetForm();
  }
  renderList();
  renderStats();
}

/* ================= 明细 ================= */
function currentMonth() {
  if (!state.month) {
    const n = nowParts();
    state.month = n.date.slice(0, 7);
  }
  return state.month;
}
function shiftMonth(delta) {
  const [y, m] = currentMonth().split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  state.month = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  renderList();
  renderStats();
}
function monthLabel(ym) {
  const [y, m] = ym.split('-');
  return `${y}年${Number(m)}月`;
}
function dayLabel(dateStr) {
  const today = nowParts().date;
  const y = new Date(dateStr + 'T00:00');
  const ty = new Date(today + 'T00:00');
  const diff = Math.round((ty - y) / 86400000);
  if (diff === 0) return '今天';
  if (diff === 1) return '昨天';
  const label = `${y.getMonth() + 1}月${y.getDate()}日`;
  return y.getFullYear() === ty.getFullYear() ? label : `${y.getFullYear()}年${label}`;
}

function renderList() {
  const ym = currentMonth();
  $('#month-label-list').textContent = monthLabel(ym);
  const q = $('#search-input').value.trim().toLowerCase();
  let rs = loadRecords().filter((r) => (r.date || '').startsWith(ym));
  if (q) {
    rs = rs.filter((r) => {
      const c = catById(r.category);
      return (r.note || '').toLowerCase().includes(q) || (c && c.name.toLowerCase().includes(q));
    });
  }
  rs.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time) || (b.createdAt || 0) - (a.createdAt || 0));

  const sumExp = rs.filter((r) => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const sumInc = rs.filter((r) => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  $('#sum-expense').textContent = fmtMoney(sumExp);
  $('#sum-income').textContent = fmtMoney(sumInc);

  const body = $('#list-body');
  if (!rs.length) {
    body.innerHTML = '<div class="empty">这个月还没有记录<br>去「记账」页记一笔吧</div>';
    return;
  }

  const groups = {};
  rs.forEach((r) => { (groups[r.date] = groups[r.date] || []).push(r); });

  body.innerHTML = Object.keys(groups).map((date) => `
    <div class="list-group">
      <div class="list-date">${dayLabel(date)}</div>
      ${groups[date].map(itemHTML).join('')}
    </div>
  `).join('');
}

function itemHTML(r) {
  const c = catById(r.category) || { name: '未知', color: '#8a94a6', icon: 'dots' };
  const tint = c.color + '22';
  const cls = r.type === 'expense' ? 'expense' : 'income';
  const sign = r.type === 'expense' ? '-' : '+';
  return `<button class="list-card" data-id="${r.id}">
    <span class="item-ic" style="background:${tint};color:${c.color}">${ICONS[c.icon] || ICONS.dots}</span>
    <span class="item-main">
      <div class="item-name">${c.name}</div>
      <div class="item-note">${escapeHtml(r.note || '无备注')}</div>
    </span>
    <span>
      <div class="item-amount ${cls}">${sign}${fmtMoney(r.amount).slice(1)}</div>
      <div class="item-time">${r.time || ''}</div>
    </span>
  </button>`;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

/* ================= 编辑 ================= */
function openEdit(id) {
  const r = loadRecords().find((x) => x.id === id);
  if (!r) return;
  state.editingId = id;
  state.type = r.type;
  state.amount = String(r.amount);
  state.catId = r.category;
  $('#edit-note-input').value = r.note || '';
  $('#edit-date-input').value = r.date || nowParts().date;
  $('#edit-time-input').value = r.time || nowParts().time;
  updateAmountDisplay(true);
  setType(r.type, true);
  renderCatGrid(true);
  $('#edit-backdrop').classList.remove('hidden');
}
function closeEdit() {
  $('#edit-backdrop').classList.add('hidden');
  state.editingId = null;
  resetForm();
}
function deleteEditing() {
  if (!state.editingId) return;
  if (!confirm('确定删除这笔记录吗？')) return;
  const rs = loadRecords().filter((r) => r.id !== state.editingId);
  saveRecords(rs);
  toast('已删除');
  closeEdit();
  renderList();
  renderStats();
}

/* ================= 统计 ================= */
function renderStats() {
  const ym = currentMonth();
  $('#month-label-stats').textContent = monthLabel(ym);
  const rs = loadRecords().filter((r) => (r.date || '').startsWith(ym));
  const exp = rs.filter((r) => r.type === 'expense');
  const inc = rs.filter((r) => r.type === 'income');
  const expSum = exp.reduce((s, r) => s + r.amount, 0);
  const incSum = inc.reduce((s, r) => s + r.amount, 0);
  $('#stat-income').textContent = fmtMoney(incSum);
  $('#stat-expense').textContent = fmtMoney(expSum);
  $('#stat-balance').textContent = fmtMoney(incSum - expSum);
  $('#stat-balance').style.color = incSum - expSum >= 0 ? 'var(--income)' : 'var(--expense)';

  renderBreakdown('expense', exp, expSum, $('#expense-donut'), $('#expense-legend'));
  renderBreakdown('income', inc, incSum, $('#income-donut'), $('#income-legend'));
  renderTrend(rs);
}

function breakdown(records) {
  const map = {};
  records.forEach((r) => { map[r.category] = (map[r.category] || 0) + r.amount; });
  return Object.keys(map).map((cat) => ({ cat, sum: round2(map[cat]) })).sort((a, b) => b.sum - a.sum);
}

function renderBreakdown(type, records, total, donutEl, legendEl) {
  if (!records.length || total <= 0) {
    donutEl.style.background = '#eceef1';
    donutEl.innerHTML = '<div class="donut-center"><b>--</b><span>暂无数据</span></div>';
    legendEl.innerHTML = '<div class="empty" style="padding:20px 0">本月暂无记录</div>';
    return;
  }
  const items = breakdown(records);
  let acc = 0;
  const stops = items.map((it) => {
    const start = acc * 360;
    acc += it.sum / total;
    const end = acc * 360;
    return `${catById(it.cat).color} ${start}deg ${end}deg`;
  }).join(',');
  donutEl.style.background = `conic-gradient(${stops})`;
  donutEl.innerHTML = `<div class="donut-center"><b>${fmtMoney(total)}</b><span>${type === 'expense' ? '支出' : '收入'}总额</span></div>`;
  legendEl.innerHTML = items.map((it) => {
    const c = catById(it.cat);
    const pct = (it.sum / total * 100).toFixed(1);
    return `<div class="legend-item">
      <span class="legend-dot" style="background:${c.color}"></span>
      <span class="legend-name">${c.name}</span>
      <span class="legend-val">${fmtMoney(it.sum).slice(1)}</span>
      <span class="legend-pct">${pct}%</span>
    </div>`;
  }).join('');
}

function renderTrend(rs) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ymd = fmtDate(d);
    days.push({ ymd, label: '日一二三四五六'[d.getDay()], sum: 0 });
  }
  rs.filter((r) => r.type === 'expense').forEach((r) => {
    const day = days.find((x) => x.ymd === r.date);
    if (day) day.sum += r.amount;
  });
  const max = Math.max(...days.map((d) => d.sum), 1);
  const trend = $('#trend');
  if (max <= 0) {
    trend.innerHTML = '<div class="empty" style="padding:20px 0;width:100%">近 7 天暂无支出</div>';
    return;
  }
  trend.innerHTML = days.map((d) => `
    <div class="trend-day">
      <span class="trend-val">${d.sum ? fmtMoney(d.sum).slice(1) : ''}</span>
      <div class="trend-bar${d.sum >= max ? ' high' : ''}" style="height:${Math.max(6, d.sum / max * 90)}px"></div>
      <span class="trend-label">${d.label}</span>
    </div>
  `).join('');
}

/* ================= 设置 ================= */
function exportData() {
  const data = { exportedAt: new Date().toISOString(), records: loadRecords(), categories: loadCats() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `记账备份_${nowParts().date}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast('备份已导出');
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const rs = Array.isArray(data.records) ? data.records.filter((r) => r && r.id && typeof r.amount === 'number') : [];
      const cats = Array.isArray(data.categories) ? data.categories.filter((c) => c && c.id && c.custom) : [];
      if (!rs.length && !cats.length) throw new Error('empty');
      saveRecords(rs);
      saveCustomCats(cats);
      state.month = '';
      resetForm();
      renderList();
      renderStats();
      renderCatManage();
      toast('导入成功');
    } catch (e) {
      toast('导入失败：文件格式不正确');
    }
  };
  reader.readAsText(file);
}

function renderCatManage() {
  const box = $('#cat-manage');
  const cats = loadCats();
  box.innerHTML = cats.map((c) => `
    <div class="manage-row">
      <span class="item-ic" style="background:${c.color}22;color:${c.color}">${ICONS[c.icon] || ICONS.dots}</span>
      <span class="manage-name">${c.name}</span>
      <span class="manage-badge">${c.type === 'expense' ? '支出' : '收入'}</span>
      ${c.custom ? `<button class="manage-del" data-del="${c.id}">删除</button>` : ''}
    </div>
  `).join('');
}

function openCatModal() {
  catDraft.icon = 'dots';
  catDraft.color = COLOR_PALETTE[0];
  $('#cat-name-input').value = '';
  $('#cat-type-switch').querySelectorAll('.type-btn').forEach((b) => b.classList.toggle('active', b.dataset.type === 'expense'));
  renderIconPicker();
  renderColorPicker();
  $('#cat-backdrop').classList.remove('hidden');
}
function renderIconPicker() {
  $('#icon-picker').innerHTML = Object.keys(ICONS).map((k) => `
    <button class="icon-opt${catDraft.icon === k ? ' sel' : ''}" data-icon="${k}">${ICONS[k]}</button>
  `).join('');
}
function renderColorPicker() {
  $('#color-picker').innerHTML = COLOR_PALETTE.map((c) => `
    <button class="color-opt${catDraft.color === c ? ' sel' : ''}" data-color="${c}" style="background:${c}"></button>
  `).join('');
}
function addCategory() {
  const name = $('#cat-name-input').value.trim();
  if (!name) { toast('请输入分类名称'); return; }
  const type = $('#cat-type-switch').querySelector('.type-btn.active').dataset.type;
  if (loadCats().some((c) => c.name === name && c.type === type)) { toast('这个分类已存在'); return; }
  const custom = JSON.parse(localStorage.getItem(LS_CATS) || '[]');
  custom.push({ id: 'c' + uid(), name, color: catDraft.color, icon: catDraft.icon, type, custom: true });
  saveCustomCats(custom);
  toast('已添加分类');
  $('#cat-backdrop').classList.add('hidden');
  renderCatManage();
  renderCatGrid(false);
}
function deleteCategory(id) {
  const used = loadRecords().some((r) => r.category === id);
  if (used) { toast('该分类已有记录，无法删除'); return; }
  if (!confirm('确定删除这个分类吗？')) return;
  const custom = JSON.parse(localStorage.getItem(LS_CATS) || '[]').filter((c) => c.id !== id);
  saveCustomCats(custom);
  renderCatManage();
  renderCatGrid(false);
  toast('已删除分类');
}

/* ================= 事件绑定 ================= */
function bindEvents() {
  $$('.tab').forEach((t) => t.addEventListener('click', () => switchView(t.dataset.view)));

  $('#type-switch').addEventListener('click', (e) => {
    const btn = e.target.closest('.type-btn');
    if (btn) setType(btn.dataset.type, false);
  });
  $('#edit-type-switch').addEventListener('click', (e) => {
    const btn = e.target.closest('.type-btn');
    if (btn) setType(btn.dataset.type, true);
  });
  $('#cat-type-switch').addEventListener('click', (e) => {
    const btn = e.target.closest('.type-btn');
    if (!btn) return;
    $('#cat-type-switch').querySelectorAll('.type-btn').forEach((b) => b.classList.toggle('active', b.dataset.type === btn.dataset.type));
  });

  $('#keypad').addEventListener('click', (e) => {
    const key = e.target.closest('.key');
    if (key) onKey(key.dataset.key, false);
  });
  $('#edit-keypad').addEventListener('click', (e) => {
    const key = e.target.closest('.key');
    if (key) onKey(key.dataset.key, true);
  });

  $('#save-btn').addEventListener('click', saveRecord);
  $('#note-input').addEventListener('input', () => { state.note = $('#note-input').value; });

  $('#cat-grid').addEventListener('click', (e) => {
    const item = e.target.closest('.cat-item');
    if (!item) return;
    state.catId = item.dataset.cat;
    renderCatGrid(false);
  });
  $('#edit-cat-grid').addEventListener('click', (e) => {
    const item = e.target.closest('.cat-item');
    if (!item) return;
    state.catId = item.dataset.cat;
    renderCatGrid(true);
  });

  $('#list-body').addEventListener('click', (e) => {
    const card = e.target.closest('.list-card');
    if (card) openEdit(card.dataset.id);
  });

  $('#prev-month').addEventListener('click', () => shiftMonth(-1));
  $('#next-month').addEventListener('click', () => shiftMonth(1));
  $('#prev-month-stats').addEventListener('click', () => shiftMonth(-1));
  $('#next-month-stats').addEventListener('click', () => shiftMonth(1));
  $('#search-input').addEventListener('input', renderList);

  $('#edit-close').addEventListener('click', closeEdit);
  $('#edit-backdrop').addEventListener('click', (e) => { if (e.target.id === 'edit-backdrop') closeEdit(); });
  $('#edit-save-btn').addEventListener('click', saveRecord);
  $('#edit-delete-btn').addEventListener('click', deleteEditing);

  $('#export-btn').addEventListener('click', exportData);
  $('#import-btn').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', (e) => { if (e.target.files[0]) importData(e.target.files[0]); e.target.value = ''; });
  $('#clear-btn').addEventListener('click', () => {
    if (!confirm('确定清空所有记账记录吗？此操作不可恢复，建议先导出备份。')) return;
    saveRecords([]);
    state.month = '';
    resetForm();
    renderList();
    renderStats();
    toast('已清空');
  });

  $('#add-cat-btn').addEventListener('click', openCatModal);
  $('#cat-close').addEventListener('click', () => $('#cat-backdrop').classList.add('hidden'));
  $('#cat-backdrop').addEventListener('click', (e) => { if (e.target.id === 'cat-backdrop') $('#cat-backdrop').classList.add('hidden'); });
  $('#icon-picker').addEventListener('click', (e) => {
    const opt = e.target.closest('.icon-opt');
    if (!opt) return;
    catDraft.icon = opt.dataset.icon;
    renderIconPicker();
  });
  $('#color-picker').addEventListener('click', (e) => {
    const opt = e.target.closest('.color-opt');
    if (!opt) return;
    catDraft.color = opt.dataset.color;
    renderColorPicker();
  });
  $('#cat-save-btn').addEventListener('click', addCategory);
  $('#cat-manage').addEventListener('click', (e) => {
    const btn = e.target.closest('.manage-del');
    if (btn) deleteCategory(btn.dataset.del);
  });
}

/* ================= 初始化 ================= */
function init() {
  const n = nowParts();
  $('#date-input').value = n.date;
  $('#time-input').value = n.time;
  bindEvents();
  renderCatGrid(false);
  renderList();
  renderStats();
  renderCatManage();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

document.addEventListener('DOMContentLoaded', init);
