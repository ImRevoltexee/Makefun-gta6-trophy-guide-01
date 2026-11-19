// Leonida Legend tracker: checklist + guide pane + planner, saved in localStorage.
// Loads only the local trophies.json; makes no network request at run time.
const KEY = 'gta6-trophy-progress-v1';
const NOTES_KEY = 'gta6-trophy-notes-v1';

const listEl = document.getElementById('trophyList');
const detailEl = document.getElementById('detailPane');
const nextUpEl = document.getElementById('nextUp');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('gradeFilter');
const kindEl = document.getElementById('kindFilter');
const spoilerEl = document.getElementById('spoilerToggle');
const hideEarnedEl = document.getElementById('hideEarned');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

let earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
let notes = JSON.parse(localStorage.getItem(NOTES_KEY) ?? '{}');
let selected = null;

function saveProgress() {
  localStorage.setItem(KEY, JSON.stringify([...earned]));
}
function saveNotes() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}
function isHidden(t) {
  return spoilerEl.checked && t.kind === 'story' && !earned.has(t.name);
}
function displayName(t) {
  return isHidden(t) ? '??? — hidden story trophy' : t.name;
}
function displayDesc(t) {
  return isHidden(t) ? 'Hidden until earned. Turn spoiler mode off to reveal it.' : t.description;
}
function gradeCounts() {
  const out = {};
  for (const t of trophies) {
    const g = t.grade;
    out[g] = out[g] ?? [0, 0];
    out[g][1] += 1;
    if (earned.has(t.name)) out[g][0] += 1;
  }
  return out;
}
function renderProgress() {
  document.getElementById('earnedCount').textContent = earned.size;
  document.getElementById('barFill').style.width = `${(earned.size / trophies.length) * 100}%`;
  const counts = gradeCounts();
  document.getElementById('gradeCounts').innerHTML =
    ['platinum', 'gold', 'silver', 'bronze']
      .map((g) => `<span><b>${counts[g][0]}/${counts[g][1]}</b> ${g}</span>`)
      .join(' ');
}
function filtered() {
  const q = searchEl.value.trim().toLowerCase();
  return trophies.filter((t) => {
    if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
    if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
    if (hideEarnedEl.checked && earned.has(t.name)) return false;
    if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
    return true;
  });
}
function renderList() {
  const shown = filtered();
  document.getElementById('shownCount').textContent = `— ${shown.length} shown`;
  listEl.replaceChildren();
  for (const t of shown) {
    const li = document.createElement('li');
    if (earned.has(t.name)) li.classList.add('earned');
    if (selected === t.name) li.classList.add('selected');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      saveProgress();
      renderAll();
    });
    const mid = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'tname';
    name.textContent = displayName(t);
    const desc = document.createElement('div');
    desc.className = 'tdesc';
    desc.textContent = displayDesc(t);
    mid.append(name, desc);
    const meta = document.createElement('div');
    meta.className = 'tmeta';
    const grade = document.createElement('span');
    grade.className = `grade ${t.grade}`;
    grade.textContent = t.grade;
    const kind = document.createElement('span');
    kind.className = 'kind';
    kind.textContent = t.kind;
    meta.append(grade, kind);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'miss';
      m.textContent = '⚠ missable';
      meta.append(m);
    }
    li.append(box, mid, meta);
    li.addEventListener('click', () => {
      selected = t.name;
      renderAll();
    });
    listEl.append(li);
  }
}
function renderDetail() {
  const t = trophies.find((x) => x.name === selected);
  if (!t) {
    detailEl.innerHTML = '<p class="pick">Select a trophy on the left to read its full guide, sources and your note.</p>';
    return;
  }
  detailEl.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = displayName(t);
  const g = document.createElement('span');
  g.className = `grade ${t.grade}`;
  g.textContent = t.grade;
  const d = document.createElement('p');
  d.className = 'desc';
  d.textContent = `“${displayDesc(t)}”`;
  const line = document.createElement('p');
  line.innerHTML = '';
  line.textContent = `Kind: ${t.kind} · Grade: ${t.grade}${t.missable ? ' · ⚠ POSSIBLY MISSABLE' : ''}`;
  detailEl.append(h, g, d, line);
  if (t.missable) {
    const w = document.createElement('p');
    w.className = 'warn';
    w.textContent = '⚠ Possibly missable — see the guide below and do it in Chapter 1. There is no mission replay.';
    detailEl.append(w);
  }
  const gh = document.createElement('h3');
  gh.textContent = 'Guide';
  const gp = document.createElement('p');
  gp.className = 'guide';
  gp.textContent = isHidden(t) ? 'Hidden until earned (spoiler mode is on).' : t.guide;
  detailEl.append(gh, gp);
  const sh = document.createElement('h3');
  sh.textContent = 'Sources';
  const ul = document.createElement('ul');
  ul.className = 'sources';
  for (const s of t.sources ?? []) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = s.name;
    li.append(a);
    ul.append(li);
  }
  detailEl.append(sh, ul);
  const nh = document.createElement('h3');
  nh.textContent = 'Your note';
  const ta = document.createElement('textarea');
  ta.value = notes[t.name] ?? '';
  ta.placeholder = 'Your own note for this trophy…';
  ta.addEventListener('input', () => {
    notes[t.name] = ta.value;
    saveNotes();
  });
  const eb = document.createElement('div');
  eb.className = 'earnedline';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = earned.has(t.name) ? '✓ Earned — click to unmark' : 'Mark as earned';
  btn.addEventListener('click', () => {
    if (earned.has(t.name)) earned.delete(t.name);
    else earned.add(t.name);
    saveProgress();
    renderAll();
  });
  eb.append(btn);
  detailEl.append(nh, ta, eb);
}
// Planner order: the missable first, then unfinished story, then quick activities,
// then collectibles, then the long grinds, platinum last.
const PLANNER_ORDER = [
  'Positive Mental Attitude',
  'Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!',
  'Top Of The World, Ma', 'You Gotta Know When to Get Off',
  'Trust', 'Break the Bank', 'Family Matters', 'DWNFALL', 'Hi-Jacked', 'Snow Storm',
  'Road to Rehabilitation', 'This Was No Boat Accident', 'The Lone Rider',
  'Supply & Demand', 'Spin On This!',
  'Stick Fiddler', 'Let’s Go Bowling', 'A Classic Blitz Play', 'Baited My Tackle',
  'Master of None', 'Hot Together', 'Retail Therapy', 'Sneakthief', 'Gunslinger',
  'Ten Pin', 'Catch Me If You Can', 'In The Beginning…', 'Capital Offense',
  'Fair Game', 'Personal Best', 'Bad Luck, I Guess', 'The Truth Is Out There',
  'Actions Speak Louder', 'Challenging Tank', 'On the Spot', 'Treat Yo Self',
  'Strangers & Freaks', 'One Last Thing', 'Dime on the Dollar',
  'Little Boxes', 'Whip It Good', 'The Goodtime State', 'Pest Control',
  'Maximum Withdrawal', 'Cunning Stunts', 'Earn Cash, Not Kudos', 'Top Fun',
  'The Shootist', "Don't Touch My Deck", 'You WAiNKer!',
  'A Long Road', 'Vice Got a Price!',
];
const PLANNER_WHY = {
  'Positive Mental Attitude': 'the only possibly missable trophy — do it in Chapter 1',
  'A Long Road': 'the 100% checklist — clean it up last, after the story',
  'Vice Got a Price!': 'the platinum — pops automatically when the other 54 are done',
};
function renderPlanner() {
  nextUpEl.replaceChildren();
  const remaining = PLANNER_ORDER.filter((n) => !earned.has(n));
  const picks = remaining.slice(0, 6);
  if (picks.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'All 54 done — the platinum is yours. Leonida Legend!';
    nextUpEl.append(li);
    return;
  }
  for (const name of picks) {
    const t = trophies.find((x) => x.name === name);
    if (!t) continue;
    const li = document.createElement('li');
    const b = document.createElement('b');
    b.textContent = t.name;
    li.append(b);
    const why = document.createElement('span');
    why.className = 'why';
    why.textContent = ` — ${PLANNER_WHY[name] ?? `${t.grade} · ${t.kind}`}`;
    li.append(why);
    li.addEventListener('click', () => {
      selected = name;
      renderAll();
      document.querySelector('.detailcol').scrollIntoView({ behavior: 'smooth' });
    });
    li.style.cursor = 'pointer';
    nextUpEl.append(li);
  }
}
function renderAll() {
  renderProgress();
  renderList();
  renderDetail();
  renderPlanner();
}
document.getElementById('exportBtn').addEventListener('click', () => {
  const data = { earned: [...earned], notes };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
});
document.getElementById('importFile').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const list = Array.isArray(data) ? data : data.earned ?? [];
    earned = new Set(list.filter((n) => trophies.some((t) => t.name === n)));
    if (data.notes) notes = data.notes;
    saveProgress();
    saveNotes();
  } catch {
    alert('That file is not a valid progress export.');
  }
  e.target.value = '';
  renderAll();
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies and notes?')) return;
  earned = new Set();
  notes = {};
  saveProgress();
  saveNotes();
  renderAll();
});
for (const el of [searchEl, gradeEl, kindEl, spoilerEl, hideEarnedEl]) {
  el.addEventListener('input', renderAll);
  el.addEventListener('change', renderAll);
}
renderAll();
