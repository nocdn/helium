// Top-pill-tabs prototype interactions
const tabsEl = document.getElementById('tabs');
const newTabBtn = document.getElementById('newTabBtn');
let counter = 1;

function makeTab(title) {
  const el = document.createElement('div');
  el.className = 'tab';
  el.setAttribute('draggable', 'true');
  el.innerHTML = `<span class="tab-title"></span><span class="tab-close" title="Close">×</span>`;
  el.querySelector('.tab-title').textContent = title;
  bindTab(el);
  return el;
}

function bindTab(el) {
  el.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-close')) return;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  });
  el.querySelector('.tab-close').addEventListener('click', () => {
    el.classList.add('closing');
    setTimeout(() => el.remove(), 180);
  });
  // simple drag reorder
  el.addEventListener('dragstart', () => el.classList.add('dragging'));
  el.addEventListener('dragend', () => el.classList.remove('dragging'));
  el.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = tabsEl.querySelector('.dragging');
    if (!dragging || dragging === el) return;
    const rect = el.getBoundingClientRect();
    const after = (e.clientX - rect.left) > rect.width / 2;
    tabsEl.insertBefore(dragging, after ? el.nextSibling : el);
  });
}

document.querySelectorAll('.tab').forEach(bindTab);

newTabBtn.addEventListener('click', () => {
  const titles = ['New Tab', 'Office Commun', 'Design Docs', 'HN — Discussion', 'Norma — Pricing'];
  const t = makeTab(titles[counter % titles.length] + (counter > 4 ? ` ${counter}` : ''));
  counter++;
  tabsEl.insertBefore(t, newTabBtn);
  document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
  t.classList.add('active');
});

document.querySelectorAll('.pin').forEach(p => {
  p.addEventListener('click', () => {
    p.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }],
      { duration: 250, easing: 'cubic-bezier(.34,1.56,.64,1)' }
    );
  });
});
