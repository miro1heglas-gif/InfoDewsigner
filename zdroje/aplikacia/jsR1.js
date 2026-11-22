  renderVals() {
    const s = this.state;
    const self = this;
    const set = (o) => self.setState(o);
    const WL = window.WZ_LANG || null;
    // texty, ktoré aplikácia sama vytvára ako obsah (názov novej snímky, návrh správy), vznikajú v jazyku rozhrania
    const Tx = (t) => WL ? WL.t(t) : t;
    const say = (m) => { set({ toast: m }); clearTimeout(self._tt); self._tt = setTimeout(() => self.setState({ toast: '' }), 3800); };
    // upozornenie v telefóne po doručení playlistu na zariadenie
    const notify = (text) => {
      if (!s.notif.n5) return;
      clearTimeout(self._tp); clearTimeout(self._tp2);
      self._tp = setTimeout(() => { self.setState({ push: { title: 'Playlist je na zariadení', text } }); self._tp2 = setTimeout(() => self.setState({ push: null }), 4500); }, 2600);
    };
    const plById = (id) => s.pls.find((p) => p.id === id);
    const pl = plById(s.plId) || s.pls[0];
    const sc = s.screen;
    // šírka telefónu: náhľady na celú šírku sa jej prispôsobia (úzke aj široké telefóny)
    const VW = Math.max(300, Math.min(480, (typeof window !== 'undefined' && window.innerWidth) || 390));
    const fw = (w) => w >= 330 ? Math.round(w + (VW - 390)) : w;
    // záložka dole ostáva tam, odkiaľ sa prišlo (napr. úprava playlistu otvorená z Miest)
    const tabOf = TAB_OF[s.stack.length ? s.stack[0] : sc] || TAB_OF[sc] || 'home';
    const dur = (p) => p.slides.reduce((a, x) => a + x.dur, 0);
    const slMeta = (p) => p.slides.length + ' ' + plural(p.slides.length, ['snímka', 'snímky', 'snímok']) + ' · ' + mmss(dur(p));
    const nPlaces = (n) => n + ' ' + plural(n, ['miesto', 'miesta', 'miest']);
    const nWhere = (n) => n ? nPlaces(n) : 'nikde sa neprehráva';
    const KIND = { info: 'Text', photo: 'Fotka', deps: 'Odchody', led: 'Text', clock: 'Čas a dátum' };
    const placeById = (id) => s.places.find((p) => p.id === id);
    const placeName = (id) => (placeById(id) || {}).name || '';
    // prihlásený účet a jeho pridelené miesta (Worker, Partner) – zoznamy ukazujú len ich
    const ACC = MACC[s.role] || MACC.admin;
    const SCOPE = ACC.scope;
    const inScope = (p) => !SCOPE || SCOPE.indexOf(p.id) >= 0;
    const vPlaces = s.places.filter(inScope);
    const withDev = vPlaces.filter((p) => p.n > 0);
    const isOwn = (a) => !!a.acc && a.acc === s.role;
    const vPls = s.pls.filter((p) => !SCOPE || p.mine === s.role || p.where.some((id) => SCOPE.indexOf(id) >= 0) || s.apvs.some((a) => a.plId === p.id && isOwn(a)));
    const names = (ids) => ids.map(placeName);
    const shortList = (nm) => nm.length ? (nm.length > 3 ? nm.slice(0, 3).join(' · ') + ' a ' + (nm.length - 3) + ' ' + plural(nm.length - 3, ['ďalšie', 'ďalšie', 'ďalších']) : nm.join(' · ')) : '—';
    const nav = (screen, o) => set(Object.assign({ screen, stack: s.stack.concat(sc), sheet: null, reorder: false, confirm: '' }, o || {}));
    const goTab = (t) => set({ screen: ROOT[t], stack: [], sheet: null, reorder: false, confirm: '' });
    const backState = () => s.stack.length ? { screen: s.stack[s.stack.length - 1], stack: s.stack.slice(0, -1) } : { screen: ROOT[tabOf], stack: [] };
    const goBack = () => set(Object.assign({ sheet: null, reorder: false, confirm: '' }, backState()));
    const closeSheet = () => set({ sheet: null, confirm: '', qStep: 'main', qSearch: '' });
    const pendingOthers = ACC.apv ? s.apvs.filter((a) => a.state === 'pending' && !isOwn(a)) : [];
    const ST = { nahraty: ['ok', 'Nahratý'], expirovany: ['bad', 'Expirovaný'], nenahraty: ['grey', 'Nenahratý'] };
    const FLOW = { draft: ['blue', 'Neodoslané zmeny'], pending: ['warn', 'Čaká na schválenie'] };
    const ownApv = (pid) => s.apvs.find((a) => a.plId === pid && a.state === 'pending' && isOwn(a));
    const tabRoot = ['home', 'pls', 'plc', 'ai', 'more'].indexOf(sc) >= 0;
    const dark = tabRoot || sc === 'pv';
    const plLed = isLedDev(pl.dev);
    // zariadenie s viacerými displejmi: každá snímka patrí jednému displeju (x.d)
    const partsOf = (p) => PARTS[p.dev] || null;
    const partBy = (dev, d) => { const ps = PARTS[dev]; return ps ? (ps.find((q) => q[0] === d) || ps[ps.length - 1]) : null; };
    const rdev = (p, x) => { const q = partBy(p.dev, x.d); return q ? q[2] : p.dev; };
    const thW = (p, x) => { const q = partBy(p.dev, x.d); return String(q ? q[3] : DEV[p.dev][3]); };
    const stW = (p, x) => { const q = partBy(p.dev, x.d); return q ? q[4] : DEV[p.dev][4]; };
    const partName = (p, x) => { const q = partBy(p.dev, x.d); return q ? q[1] : ''; };
    const plTotem = !!partsOf(pl);
    const insertSl = (p, sl) => { const ps = partsOf(p); if (!ps || !sl.d) return p.slides.concat([sl]); const ord = (d) => ps.findIndex((q) => q[0] === d); const a = p.slides.slice(); let i = a.length; for (let k = 0; k < a.length; k++) { if (ord(a[k].d) > ord(sl.d)) { i = k; break; } } a.splice(i, 0, sl); return a; };
    const prvOf = (p, w3) => { const ps = partsOf(p); if (!ps) { const x = p.slides[0]; return x ? [Object.assign({}, x, { dev: p.dev, w: String(fw(DEV[p.dev][2])), r: '14' })] : []; } return ps.map((q) => { const x = p.slides.find((z) => z.d === q[0]); return x ? Object.assign({}, x, { dev: q[2], w: String(w3), r: '3' }) : null; }).filter(Boolean); };
    const stackS = (p) => partsOf(p) ? 'display:flex;flex-direction:column;gap:4px;padding:6px;background:#1B2020;border-radius:10px' : '';
    // playlist nahratý na miesta, pre ktoré je určený
    const deliver = (places, p) => places.map((x) => p.where.indexOf(x.id) >= 0 ? Object.assign({}, x, { pl: p.id, st: 'up', temp: null }) : x);
    const deliveredT = (p, ids) => '„' + p.name + '“ sa už prehráva: ' + shortList(names(ids)) + '.';

    // ---------- úprava playlistu ----------
    const logSlide = (lg, sid, title) => {
      if (lg.some((x) => x[2] === 'a' + sid)) return lg.map((x) => x[2] === 'a' + sid ? [x[0], 'Pridaná snímka „' + title + '“', x[2]] : x);
      return lg.filter((x) => x[2] !== 'm' + sid).concat([['mod', 'Upravená snímka „' + title + '“', 'm' + sid]]);
    };
    const mutate = (pid, fn) => set({ pls: s.pls.map((p) => p.id === pid ? Object.assign({}, fn(p), { flow: 'draft' }) : p) });
    const updSlide = (sid, patch) => mutate(pl.id, (p) => { const slides = p.slides.map((x) => x.id === sid ? Object.assign({}, x, patch) : x); const t = slides.find((x) => x.id === sid); return Object.assign({}, p, { slides, log: logSlide(p.log, sid, t ? t.title : '') }); });
    const newSl = (kind, title, text, durn, bg, ex) => Object.assign({ id: self.nid(), kind, title, text, dur: durn, bg, img: '', imgName: '', ledSize: 'M', ledAlign: 'left', ledCol: '', ledBg: '', d: '' }, ex || {});
    const delSlide = (sid) => {
      mutate(pl.id, (p) => { const t = p.slides.find((x) => x.id === sid); const added = p.log.some((x) => x[2] === 'a' + sid); const lg = p.log.filter((x) => x[2] !== 'a' + sid && x[2] !== 'm' + sid); return Object.assign({}, p, { slides: p.slides.filter((x) => x.id !== sid), log: added ? lg : lg.concat([['del', 'Zmazaná snímka „' + (t ? t.title : '') + '“', 'd' + sid]]) }); });
      say('Snímka je zmazaná.');
    };
    const moveSlide = (i, d) => mutate(pl.id, (p) => { const a = p.slides.slice(); const t = a[i]; a[i] = a[i + d]; a[i + d] = t; return Object.assign({}, p, { slides: a, log: p.log.filter((x) => x[2] !== 'o').concat([['ord', 'Zmenené poradie snímok', 'o']]) }); });
    const pushSlide = (pid, sl, logT, extra) => set(Object.assign({ pls: s.pls.map((p) => p.id === pid ? Object.assign({}, p, { slides: insertSl(p, sl), flow: 'draft', log: p.log.concat([['add', logT, 'a' + sl.id]]) }) : p), slId: sl.id, sheet: null }, extra || {}));
    const toEditor = { screen: 'sl', stack: s.stack.concat(sc), reorder: false, confirm: '' };
    const addPhotoSlide = (pid, file, galNext, goEdit) => {
      const sl = newSl('photo', file.title, '', 10, '#1A1F1F', { img: file.col, imgName: file.name });
      pushSlide(pid, sl, 'Pridaná snímka „' + file.title + '“ (' + file.name + ')', Object.assign({ gal: galNext }, goEdit ? toEditor : {}));
    };
    const bumpGal = (gal, fid, pname) => gal.map((g) => g.id === fid ? Object.assign({}, g, { used: g.used + 1, usedIn: g.usedIn.concat([pname]) }) : g);
    const NEWC = ['#7FA65A', '#6C8EAD', '#C27C4A', '#8A6CAD'];
    const makeFile = (kind) => {
      const n = s.gal.length + 1;
      if (kind === 'cam') return { id: 'g' + n + 'x', name: 'IMG_' + ((d) => d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') + '_' + String(d.getHours()).padStart(2, '0') + String(d.getMinutes()).padStart(2, '0'))(new Date()) + (n > 1 ? '_' + n : '') + '.jpg', title: Tx('Nová fotka'), type: 'img', size: '2,1 MB', used: 0, usedIn: [], folder: 'Z telefónu', col: NEWC[n % 4] };
      if (kind === 'ph') return { id: 'g' + n + 'x', name: 'foto-z-telefonu-' + n + '.jpg', title: Tx('Fotka z telefónu'), type: 'img', size: '1,6 MB', used: 0, usedIn: [], folder: 'Z telefónu', col: NEWC[(n + 1) % 4] };
      return { id: 'g' + n + 'x', name: 'novy-spot-' + n + '.mp4', title: Tx('Nový spot'), type: 'vid', size: '9,4 MB', dur: '0:12', used: 0, usedIn: [], folder: 'Reklamy', col: '#2F62B0' };
    };
    const sendApv = () => {
      const lg = pl.log.length ? pl.log : [['mod', 'Úpravy v playliste', 'x']];
      const a = { id: 'a' + self.nid(), plId: pl.id, name: pl.name, author: ACC.name, acc: s.role, when: 'teraz', own: false, state: 'pending', note: '', changes: lg.map((x) => [x[0], x[1]]), valid: 'Platnosť: ihneď po schválení' };
      set({ apvs: [a].concat(s.apvs), pls: s.pls.map((p) => p.id === pl.id ? Object.assign({}, p, { flow: 'pending', log: [] }) : p), reorder: false });
      say('Odoslané na schválenie. Dáme vám vedieť, keď ho správca DP Riečany schváli.');
    };
    const withdraw = () => { set({ apvs: s.apvs.filter((a) => !(a.plId === pl.id && isOwn(a) && a.state === 'pending')), pls: s.pls.map((p) => p.id === pl.id ? Object.assign({}, p, { flow: 'draft' }) : p) }); say('Vzaté späť. Playlist môžete znova upravovať.'); };

    // ---------- hlavička ----------
    const act = (label, d, fn, badge) => ({ label, d, fn, isIcon: true, isText: false, hasBadge: !!badge, badge: badge || '' });
    const openPrev = (pid) => set({ screen: 'pv', stack: s.stack.concat(sc), pvPl: pid, pvI: 0, pvT: 0, pvE: 0, pvPlay: true, sheet: null, reorder: false });
    let hdTitle = 'Info Designer', hdSub = 'DP Riečany', hdActs = [], hdLogo = false;
    if (sc === 'home') { hdLogo = true; hdActs = ACC.apv ? [act('Schvaľovanie – čaká ' + pendingOthers.length, IC.bell, () => nav('apv', { apvTab: 'pending' }), pendingOthers.length ? String(pendingOthers.length) : '')] : ACC.partner ? [act('Odoslané na schválenie', IC.bell, () => nav('apv', { apvTab: 'pending' }), '')] : []; }
    else if (sc === 'pls') { hdTitle = 'Playlisty'; hdSub = ''; }
    else if (sc === 'pl') { hdTitle = pl.name; hdSub = DEV[pl.dev][1]; hdActs = [act('Náhľad playlistu', IC.eye, () => openPrev(pl.id))]; }
    else if (sc === 'sl') { hdTitle = plLed ? 'Upraviť text' : 'Upraviť snímku'; hdSub = pl.name; hdActs = [{ label: 'Hotovo', d: '', fn: goBack, isIcon: false, isText: true, hasBadge: false, badge: '' }]; }
    else if (sc === 'apv') { hdTitle = ACC.apv ? 'Schvaľovanie' : 'Odoslané na schválenie'; hdSub = ''; }
    else if (sc === 'ad') { hdTitle = 'Schválenie zmien'; hdSub = ''; }
    else if (sc === 'gal') { hdTitle = 'Galéria'; hdSub = ''; }
    else if (sc === 'more') { hdTitle = 'Viac'; hdSub = ''; }
    else if (sc === 'plc') { hdTitle = 'Miesta'; hdSub = ''; }
    else if (sc === 'set') { hdTitle = 'Nastavenia'; hdSub = ''; }
    else if (sc === 'hist') { hdTitle = 'História správ'; hdSub = ''; }
    else if (sc === 'ai') { hdTitle = 'AI asistent'; hdSub = ''; }
    else if (sc === 'pv') { hdTitle = 'Náhľad'; hdSub = (plById(s.pvPl) || pl).name; }

    // ---------- rýchle správy: kam ----------
    const devIds = withDev.map((p) => p.id);
    const grpIds = (g) => withDev.filter((p) => p.g === g).map((p) => p.id);
    const sameSet = (a, b) => a.length === b.length && a.every((x) => b.indexOf(x) >= 0);
    const tgtN = (m) => m.all ? devIds.length : m.ids.length;
    const tgtLabel = (m) => {
      if (m.all) return 'Všetky miesta';
      for (let g = 0; g < GRP.length; g++) if (sameSet(m.ids, grpIds(g))) return GRP[g];
      return m.ids.length === 1 ? placeName(m.ids[0]) : nPlaces(m.ids.length);
    };
    const PRIO = { warn: ['Výstraha', 'warn'], info: ['Oznam', 'blue'] };
    const POS = { top: 'horný pás', bottom: 'dolný pás', full: 'celá obrazovka' };

    // ---------- DOMOV ----------
    const qaRows = s.qa.map((m) => ({
      k: PRIO[m.prio][1], prioT: PRIO[m.prio][0], text: m.text, meta: POS[m.pos] + ' · ' + (m.until || DURS[m.dur][1]) + ' · ' + tgtLabel(m),
      canCancel: ACC.pub || m.acc === s.role, cancel: () => { set({ qa: s.qa.filter((x) => x.id !== m.id), qh: [Object.assign({}, m, { when: 'Dnes ' + HM() + ' · zrušená' })].concat(s.qh) }); say('Správa je zrušená a z displejov zmizne do pár sekúnd.'); }
    }));
    const openQuick = () => set({ sheet: 'quick', qStep: 'main', qSearch: '', qTplAll: false });
    const effPl = (pc) => plById(pc.temp ? pc.temp.pl : pc.pl);
    // úprava playlistu, ktorý sa práve prehráva na mieste
    const editAtPlace = (pid) => { const pc = placeById(pid); const ep = effPl(pc); if (!ep) return; nav('pl', { plId: ep.id }); if (ep.where.length > 1) say('Zmeny sa prejavia na všetkých ' + ep.where.length + ' miestach, kde sa playlist prehráva.'); };
    const swForPlace = (pid) => { const pc = placeById(pid); const ep = effPl(pc); set({ sheet: 'sw', sw: { step: 'pl', from: 'pl', dev: pc.dev, places: [pid], pl: ep ? ep.id : '', dur: 'today' } }); };
    const swForPl = (plid) => set({ sheet: 'sw', sw: { step: 'pc', from: 'pc', dev: (plById(plid) || {}).dev, places: [], pl: plid, dur: 'today' } });
    const ledLook = (d) => isLedDev(d) || !!PARTS[d];
    const tile = (p) => { const f = p && p.slides[0]; return ledLook(p ? p.dev : '') ? '#050505' : GRAD(f ? (f.kind === 'photo' ? f.img : f.bg) : '#C9D2D2'); };
    const nowIds = SCOPE ? withDev.filter((p, i, arr) => { const e = effPl(p); return e && arr.findIndex((q) => (effPl(q) || {}).id === e.id) === i; }).slice(0, 4).map((p) => p.id) : ['hsv', 'snp', 'asa', 't1'];
    const nowRows = nowIds.map((id) => { const pc = placeById(id); const ep = effPl(pc); return { thS: 'width:48px;height:48px;border-radius:10px;flex:none;background:' + tile(ep), place: pc.name, plName: ep ? ep.name : '—', temp: !!pc.temp, until: pc.temp ? pc.temp.until : '', change: () => swForPlace(id), canSw: ACC.pub, changeA: 'Prepnúť playlist na mieste: ' + pc.name, canEdit: !!ep, edit: () => editAtPlace(id), editA: 'Upraviť playlist: ' + (ep ? ep.name : '') }; });
    const pcOnN = withDev.filter((p) => p.on).length;
    const expN = withDev.filter((p) => p.st === 'exp').length;
    const qhRows = s.qh.map((h) => ({ againA: 'Poslať znova: ' + h.text, text: h.text, meta: h.when + ' · ' + tgtLabel(h) + ' · ' + PRIO[h.prio][0], again: () => set({ sheet: 'quick', qStep: 'main', qSearch: '', quick: { text: h.text, prio: h.prio, pos: h.pos, dur: h.dur, all: h.all, ids: h.ids.slice() } }) }));

    // ---------- PLAYLISTY ----------
    const cnt = (k) => vPls.filter((p) => p.st === k).length;
    const plChips = [['all', 'Všetko', vPls.length], ['nahraty', 'Nahratý', cnt('nahraty')], ['expirovany', 'Expirovaný', cnt('expirovany')], ['nenahraty', 'Nenahratý', cnt('nenahraty')]].map((c) => ({ label: c[1], n: c[2], on: s.filt === c[0], pick: () => set({ filt: c[0] }) }));
    const ql = s.q.trim().toLowerCase();
    const plList = vPls.filter((p) => (s.filt === 'all' || p.st === s.filt) && (!ql || p.name.toLowerCase().indexOf(ql) >= 0));
    const plRows = plList.map((p) => ({
      open: () => nav('pl', { plId: p.id }), thS: 'width:52px;height:52px;border-radius:12px;flex:none;font-weight:700;font-size:17px;display:flex;align-items:center;justify-content:center;color:' + (ledLook(p.dev) ? '#FFB000' : '#fff') + ';background:' + tile(p), nSl: String(p.slides.length),
      name: p.name, devT: DEV[p.dev][1], meta: slMeta(p) + ' · ' + nWhere(p.where.length), stK: ST[p.st][0], stT: ST[p.st][1], touch: p.touch, hasFlow: p.flow !== 'none', flowK: (FLOW[p.flow] || ['', ''])[0], flowT: (FLOW[p.flow] || ['', ''])[1]
    }));
    const createPl = (dev) => { const id = 'p' + self.nid(); const first = PARTS[dev] ? [newSl('clock', Tx('Čas a dátum'), 'y', 10, '#050505', { d: 'cas' }), newSl('deps', Tx('Odchody'), 'Linky 3 · 5 · 14', 20, '#050505', { d: 'odch' })] : []; const p = { id, name: Tx('Nový playlist'), dev, st: 'nenahraty', slides: first, where: [], flow: 'draft', plan: 'Plán ešte nie je nastavený', touch: false, log: [], mine: s.role }; set({ pls: [p].concat(s.pls), screen: 'pl', plId: id, stack: s.stack.concat(sc), sheet: null }); say('Playlist pre „' + DEV[dev][1] + '“ je vytvorený.'); };

    // ---------- DETAIL PLAYLISTU ----------
    const locked = pl.flow === 'pending';
    const mineApv = ownApv(pl.id);
    const otherApv = s.apvs.find((a) => a.plId === pl.id && a.state === 'pending' && !isOwn(a));
    const canEdit = !locked;
    const slRows = pl.slides.map((x, i) => ({
      open: () => locked ? openPrev(pl.id) : nav('sl', { slId: x.id }), aria: 'Upraviť: ' + x.title, dev: rdev(pl, x), w: thW(pl, x), kind: x.kind, title: x.title, text: x.text, bg: x.bg, img: x.img, ledSize: x.ledSize, ledAlign: x.ledAlign, ledCol: x.ledCol, ledBg: x.ledBg,
      meta: (plTotem ? partName(pl, x) + ' · ' : '') + KIND[x.kind] + (x.kind === 'clock' ? '' : ' · ' + x.dur + ' s'), showMove: s.reorder && canEdit, up: () => moveSlide(i, -1), upOff: i === 0 || (pl.slides[i - 1].d || '') !== (x.d || ''), down: () => moveSlide(i, 1), downOff: i === pl.slides.length - 1 || (pl.slides[i + 1].d || '') !== (x.d || ''),
      delK: s.confirm === 'd' + x.id ? 'd' : '', delLbl: s.confirm === 'd' + x.id ? 'Potvrdiť zmazanie snímky' : 'Zmazať snímku', del: () => { if (s.confirm === 'd' + x.id) { set({ confirm: '' }); delSlide(x.id); } else { set({ confirm: 'd' + x.id }); say('Ťuknite na kôš ešte raz a snímka sa zmaže.'); } },
      showChev: !(s.reorder && canEdit)
    }));
    const BLANK = { id: 0, kind: 'info', title: '', text: '', dur: 10, bg: '#0E8080', img: '', imgName: '', ledSize: 'M', ledAlign: 'left', ledCol: '', ledBg: '', d: '' };
    const curSl = pl.slides[0] || BLANK;
    const upload = (p, toastT) => { set({ pls: s.pls.map((x) => x.id === p.id ? Object.assign({}, x, { st: 'nahraty' }) : x), places: deliver(s.places, p) }); say(toastT); if (p.where.length) notify(deliveredT(p, p.where)); };
    const publishNow = () => {
      const n = pl.where.length;
      set({ pls: s.pls.map((p) => p.id === pl.id ? Object.assign({}, p, n ? { flow: 'none', st: 'nahraty', log: [] } : { flow: 'none', log: [] }) : p), places: n ? deliver(s.places, pl) : s.places, reorder: false });
      say(n ? 'Zverejnené. Playlist sa nahráva na ' + nPlaces(n) + '.' : 'Zverejnené. Ťuknite na „Nahrať na zariadenia“ a vyberte miesta.');
      if (n) notify(deliveredT(pl, pl.where));
    };
    let mainAct;
    if (pl.flow === 'pending') mainAct = mineApv ? { k: '', label: 'Vziať späť', fn: withdraw } : ACC.apv ? { k: 'p', label: 'Otvoriť schválenie', fn: () => otherApv && nav('ad', { adId: otherApv.id, apvNote: '' }) } : { k: '', label: 'Čaká na schválenie správcom', fn: () => say('Playlist schvaľuje správca DP Riečany.') };
    else if (pl.flow === 'draft') mainAct = ACC.pub ? { k: 'p', label: 'Zverejniť', fn: publishNow } : { k: 'p', label: 'Odoslať na schválenie', fn: sendApv };
    else if (!ACC.pub) mainAct = { k: '', label: 'Náhľad', fn: () => openPrev(pl.id) };
    else if (pl.st === 'nenahraty') mainAct = { k: 'p', label: 'Nahrať na zariadenia', fn: () => pl.where.length ? upload(pl, 'Playlist sa nahráva na ' + nPlaces(pl.where.length) + '.') : swForPl(pl.id) };
    else if (pl.st === 'expirovany') mainAct = { k: 'p', label: 'Predĺžiť platnosť', fn: () => { set({ pls: s.pls.map((p) => p.id === pl.id ? Object.assign({}, p, { st: 'nahraty', plan: 'Po–Pi 6:00–22:00 · do 31. 12.' }) : p) }); say('Platnosť je predĺžená do 31. 12.'); } };
    else mainAct = { k: 'p', label: 'Prehrať na mieste…', fn: () => swForPl(pl.id) };
    const lockT = mineApv ? 'Playlist ste odoslali na schválenie, preto sa nedá upravovať. Ak chcete niečo zmeniť, vezmite ho späť.' : 'Playlist čaká na schválenie, preto sa nedá upravovať.';
    const whereT = pl.where.length ? names(pl.where).join(' · ') : 'Zatiaľ sa neprehráva na žiadnom mieste.';
    const openAdd = () => set({ sheet: 'add', addMode: 'slide' });
    // zoznam vytvorených snímok pre zariadenie playlistu: snímky zo všetkých playlistov + samostatné
    const libAll = []; const libSeen = {};
    s.pls.forEach((p) => p.slides.forEach((x) => { const k = p.dev + '|' + (x.d || '') + '|' + x.title; if (x.kind !== 'clock' && !libSeen[k]) { libSeen[k] = 1; libAll.push(Object.assign({}, x, { dev: p.dev, from: p.id === pl.id ? '' : 'z playlistu: ' + p.name, own: p.id === pl.id })); } }));
    s.libX.forEach((x) => { const k = x.dev + '|' + (x.d || '') + '|' + x.title; if (!libSeen[k]) { libSeen[k] = 1; libAll.push(Object.assign({}, x, { from: 'samostatná snímka', own: false })); } });
    const lql = s.libQ.trim().toLowerCase();
    const libRows = libAll.filter((x) => x.dev === pl.dev && !x.own && (!lql || x.title.toLowerCase().indexOf(lql) >= 0)).map((x) => ({
      dev: rdev(pl, x), w: thW(pl, x), kind: x.kind, title: x.title, text: x.text, bg: x.bg, img: x.img, ledSize: x.ledSize, ledAlign: x.ledAlign, ledCol: x.ledCol, ledBg: x.ledBg, meta: (plTotem ? partName(pl, x) + ' · ' : '') + KIND[x.kind] + ' · ' + x.dur + ' s', from: x.from, aria: 'Pridať snímku ' + x.title,
      pick: () => { const sl = newSl(x.kind, x.title, x.text, x.dur, x.bg, { img: x.img, imgName: x.imgName, ledSize: x.ledSize, ledAlign: x.ledAlign, ledCol: x.ledCol, ledBg: x.ledBg, d: x.d || '' }); pushSlide(pl.id, sl, 'Pridaná snímka „' + x.title + '“ (zo zoznamu snímok)', { libQ: '' }); say('Snímka „' + x.title + '“ je pridaná na koniec playlistu.'); }
    }));
    const openLib = () => set({ sheet: 'lib', libQ: '' });
    const addLed = () => { const sl = newSl('led', Tx('Nový text'), '', 10, '#050505', { ledSize: pl.dev === 'vehicle' ? 'L' : 'M' }); pushSlide(pl.id, sl, 'Pridaná snímka „Nový text“', toEditor); };
