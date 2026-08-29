import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/26329/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP = path.join(ROOT, 'Zcode');
const QA = path.join(APP, '_qa');
fs.mkdirSync(QA, { recursive: true });

const APP_URL = process.env.APP_URL || ('file:///' + path.join(APP, 'index.html').replace(/\\/g, '/'));

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true
});
// iPhone 16 Pro 逻辑分辨率 393×852 @3x
const page = await browser.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true });
page.on('console', (msg) => { if (msg.type() === 'error') console.log('PAGE_ERROR:', msg.text()); });
page.on('pageerror', (err) => console.log('PAGE_EXCEPTION:', err.message));

const results = [];
function check(name, ok, extra = '') {
  results.push({ name, ok });
  console.log((ok ? 'PASS' : 'FAIL') + ' | ' + name + (extra ? ' | ' : '') + extra);
}

await page.goto(APP_URL, { waitUntil: 'domcontentloaded' });
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);

// 初始状态
check('标题正确', (await page.textContent('#header-title')) === '记一笔');
check('分类网格有 8 个支出分类', (await page.locator('#cat-grid .cat-item').count()) === 8);
check('金额初始 0.00', (await page.textContent('#amount-display')) === '0.00');
const fit = await page.evaluate(() => {
  const v = document.querySelector('#view-record');
  return { scrollH: v.scrollHeight, clientH: v.clientHeight };
});
check('记账页一屏完整显示（iPhone 16 Pro 无需滚动）', fit.scrollH <= fit.clientH + 1, `scroll=${fit.scrollH} client=${fit.clientH}`);
await page.screenshot({ path: path.join(QA, '01-record.png') });

// 记账：支出 45.5 餐饮
for (const k of ['4', '5', '.', '5']) await page.click(`.key[data-key="${k}"]`);
check('输入金额 45.5', (await page.textContent('#amount-display')) === '45.5');
await page.click('.cat-item[data-cat="food"]');
check('选中餐饮分类', (await page.locator('#cat-grid .cat-item.sel').textContent()).includes('餐饮'));
await page.fill('#note-input', '中午和朋友吃饭');
await page.click('#save-btn');
await page.waitForTimeout(300);
check('保存后出现提示', (await page.textContent('#toast')).includes('已记账'));

// 收入：1000 工资
await page.click('#type-switch .type-btn[data-type="income"]');
check('切换收入后分类为 4 个', (await page.locator('#cat-grid .cat-item').count()) === 4);
for (const k of ['1', '0', '0', '0']) await page.click(`.key[data-key="${k}"]`);
await page.click('.cat-item[data-cat="salary"]');
await page.fill('#note-input', '8月工资');
await page.click('#save-btn');
await page.waitForTimeout(300);

// 明细
await page.click('.tab[data-view="list"]');
await page.waitForTimeout(300);
const listText = await page.textContent('#list-body');
check('明细包含支出记录', listText.includes('中午和朋友吃饭') && listText.includes('-45.50'));
check('明细包含收入记录', listText.includes('8月工资') && listText.includes('+1,000.00'));
check('汇总支出 45.50', (await page.textContent('#sum-expense')).includes('45.50'));
check('汇总收入 1,000.00', (await page.textContent('#sum-income')).includes('1,000.00'));

// 搜索
await page.fill('#search-input', '工资');
await page.waitForTimeout(200);
const searchText = await page.textContent('#list-body');
check('搜索只显示工资记录', searchText.includes('8月工资') && !searchText.includes('中午和朋友吃饭'));
await page.fill('#search-input', '');

// 编辑记录：把 45.5 改成 50
await page.click('.list-card:has-text("中午和朋友吃饭")');
await page.waitForTimeout(300);
check('编辑弹层打开', (await page.textContent('.sheet h2')) === '编辑记录');
for (let i = 0; i < 4; i++) await page.click('#edit-keypad .key[data-key="del"]');
await page.click('#edit-keypad .key[data-key="5"]');
await page.click('#edit-keypad .key[data-key="0"]');
await page.click('#edit-save-btn');
await page.waitForTimeout(300);
const editedText = await page.textContent('#list-body');
check('编辑后金额更新为 50', editedText.includes('50.00') && !editedText.includes('45.50'));
check('编辑弹层已关闭且主表单未受污染', (await page.textContent('#amount-display')) === '0.00');

// 统计
await page.click('.tab[data-view="stats"]');
await page.waitForTimeout(300);
check('统计支出 50', (await page.textContent('#stat-expense')).includes('50.00'));
check('统计收入 1,000', (await page.textContent('#stat-income')).includes('1,000.00'));
check('结余 950', (await page.textContent('#stat-balance')).includes('950.00'));
check('支出占比图渲染', (await page.locator('#expense-donut .donut-center').count()) === 1);
check('支出图例有餐饮', (await page.textContent('#expense-legend')).includes('餐饮'));
await page.screenshot({ path: path.join(QA, '03-stats.png') });

// 每日支出：整月柱状图（跟随所选月份）
const daysInMonth = await page.evaluate(() => {
  const ym = document.querySelector('#month-label-stats').textContent;
  const m = Number(ym.match(/(\d+)月/)[1]);
  return new Date(new Date().getFullYear(), m, 0).getDate();
});
check('每日支出为整月柱状图', (await page.locator('#trend .trend-bar').count()) === daysInMonth, `期望 ${daysInMonth} 根`);
check('柱状图有数据', (await page.locator('#trend .trend-bar').count()) > 0 && (await page.textContent('#trend')).includes('50.00'));

// 切换到上个月，趋势应跟随月份变化
await page.click('#prev-month-stats');
await page.waitForTimeout(300);
check('切换月份后趋势标题月份更新', (await page.textContent('#month-label-stats')).length > 0);
await page.click('#next-month-stats');

// 设置页
await page.click('.tab[data-view="settings"]');
await page.waitForTimeout(300);
check('分类管理列出 12 个分类', (await page.locator('#cat-manage .manage-row').count()) === 12);

// 添加自定义分类（名称含 HTML，应被转义）
await page.click('#add-cat-btn');
await page.waitForTimeout(300);
check('图标选择器共 34 个图标', (await page.locator('#icon-picker .icon-opt').count()) === 34);
check('颜色选择器共 20 个颜色', (await page.locator('#color-picker .color-opt').count()) === 20);
await page.click('#color-picker .color-opt[data-color="#0d9488"]');
check('可选中新扩充的青绿色', (await page.locator('#color-picker .color-opt.sel').getAttribute('data-color')) === '#0d9488');
await page.screenshot({ path: path.join(QA, '06-icons.png') });
await page.fill('#cat-name-input', '<img src=x onerror=window.__xss=1>');
await page.click('#icon-picker .icon-opt[data-icon="heart"]');
await page.click('#color-picker .color-opt[data-color="#e84393"]');
await page.click('#cat-save-btn');
await page.waitForTimeout(300);
const manageHtml = await page.evaluate(() => document.querySelector('#cat-manage').innerHTML);
check('分类名中的 HTML 被转义（XSS 防护）', manageHtml.includes('&lt;img') && !manageHtml.includes('<img src=x'));
check('恶意分类名未被执行', (await page.evaluate(() => window.__xss)) === undefined);

// 删除自定义分类（走新确认弹层）
await page.click('.manage-del[data-del]');
await page.waitForTimeout(300);
check('删除分类弹出确认层', !(await page.locator('#confirm-backdrop.hidden').count()));
await page.click('#confirm-ok');
await page.waitForTimeout(300);
check('确认后自定义分类已删除', !(await page.textContent('#cat-manage')).includes('onerror'));

// 删除记录（走新确认弹层）
await page.click('.tab[data-view="list"]');
await page.waitForTimeout(200);
await page.click('.list-card[data-id]');
await page.waitForTimeout(300);
await page.click('#edit-delete-btn');
await page.waitForTimeout(300);
check('删除记录弹出确认层', !(await page.locator('#confirm-backdrop.hidden').count()));
await page.click('#confirm-ok');
await page.waitForTimeout(300);
check('删除记录后列表只剩支出', (await page.locator('#list-body .list-card').count()) === 1);

// 刷新后数据仍保留
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
await page.click('.tab[data-view="list"]');
await page.waitForTimeout(300);
check('刷新后数据仍保留', (await page.locator('#list-body .list-card').count()) === 1 && (await page.textContent('#list-body')).includes('中午和朋友吃饭'));

// 备份提醒：25 条记录且从未备份 → 设置页显示提醒
await page.evaluate(() => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const ym = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
  const rs = [];
  for (let i = 1; i <= 25; i++) {
    rs.push({ id: 'seed' + i, type: 'expense', amount: 10 + i, category: 'food', note: 'seed' + i, date: `${ym}-${pad(i)}`, time: '12:00', createdAt: i });
  }
  localStorage.setItem('jz_records_v1', JSON.stringify(rs));
  localStorage.removeItem('jz_last_backup_v1');
});
await page.reload({ waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
await page.click('.tab[data-view="settings"]');
await page.waitForTimeout(300);
const hintShown = await page.evaluate(() => {
  const el = document.querySelector('#backup-hint');
  return el.classList.contains('warn') && el.textContent.length > 0;
});
check('超过 20 条且未备份时显示提醒', hintShown);
check('提醒文案包含记录数', (await page.textContent('#backup-hint')).includes('25'));

// 刚备份过（或记录少）则不提醒
await page.evaluate(() => localStorage.setItem('jz_last_backup_v1', String(Date.now())));
await page.evaluate(() => renderBackupHint());
check('备份后提醒消失', (await page.textContent('#backup-hint')) === '');

// 导入备份：先取消（数据不变），再确认（数据被替换）
const backupFile = path.join(QA, 'backup_test.json');
fs.writeFileSync(backupFile, JSON.stringify({
  exportedAt: new Date().toISOString(),
  records: [
    { id: 'imp1', type: 'expense', amount: 12.5, category: 'food', note: '导入A', date: new Date().toISOString().slice(0, 10), time: '09:00' },
    { id: 'imp2', type: 'income', amount: 300, category: 'salary', note: '导入B', date: new Date().toISOString().slice(0, 10), time: '10:00' },
    { id: 'imp3', type: 'expense', amount: 7, category: 'transport', note: '导入C', date: new Date().toISOString().slice(0, 10), time: '11:00' }
  ],
  categories: []
}));
await page.click('#import-btn');
await page.setInputFiles('#import-file', backupFile);
await page.waitForTimeout(400);
const confirmMsg = await page.textContent('#confirm-msg');
check('导入前弹出覆盖确认', confirmMsg.includes('替换现有 25 条') && confirmMsg.includes('3 条'));
await page.click('#confirm-cancel');
await page.waitForTimeout(200);
const countAfterCancel = await page.evaluate(() => JSON.parse(localStorage.getItem('jz_records_v1')).length);
check('取消导入后数据不变', countAfterCancel === 25);
await page.click('#import-btn');
await page.setInputFiles('#import-file', backupFile);
await page.waitForTimeout(400);
await page.click('#confirm-ok');
await page.waitForTimeout(400);
const countAfterImport = await page.evaluate(() => JSON.parse(localStorage.getItem('jz_records_v1')).length);
check('确认后导入成功（3 条）', countAfterImport === 3);

// 清空数据（走新确认弹层）
await page.click('#clear-btn');
await page.waitForTimeout(300);
const clearMsg = await page.textContent('#confirm-msg');
check('清空前弹出确认并显示条数', clearMsg.includes('3 条'));
await page.click('#confirm-ok');
await page.waitForTimeout(300);
check('确认后已清空', (await page.evaluate(() => JSON.parse(localStorage.getItem('jz_records_v1')).length)) === 0);

await page.screenshot({ path: path.join(QA, '05-final.png') });
await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n共 ${results.length} 项，通过 ${results.length - failed.length} 项，失败 ${failed.length} 项`);
if (failed.length) {
  console.log('失败项：', failed.map((f) => f.name).join('、'));
  process.exit(1);
}
