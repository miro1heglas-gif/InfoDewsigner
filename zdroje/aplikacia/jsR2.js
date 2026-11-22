
    // ---------- EDITOR SNÍMKY ----------
    const ed = pl.slides.find((x) => x.id === s.slId) || BLANK;
    const upd = (patch) => updSlide(ed.id, patch);
    const swatch = (c, label, cur, patchKey, show) => ({ label, on: cur === c, pick: () => upd({ [patchKey]: c }), s: 'display:block;width:30px;height:30px;border-radius:50%;background:' + (show || c) + ';box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)' });
    const BGN = ['Tyrkysová', 'Tmavá tyrkysová', 'Tmavomodrá', 'Modrá', 'Fialová', 'Oranžová', 'Červená', 'Čierna'];
    const bgSw = BG.map((c, i) => swatch(c, 'Pozadie: ' + BGN[i], ed.bg, 'bg'));
    const LEDC = [['', 'Predvolená (jantárová)', '#FFB000'], ['#4CFF4C', 'Zelená', '#4CFF4C'], ['#FF4040', 'Červená', '#FF4040'], ['#FFFFFF', 'Biela', '#FFFFFF'], ['#34D8FF', 'Azúrová', '#34D8FF']];
    const LEDB = [['', 'Bez farby (čierne)', '#050505'], ['#E07A2B', 'Oranžové pole', '#E07A2B'], ['#C8322B', 'Červené pole', '#C8322B'], ['#2E9E4F', 'Zelené pole', '#2E9E4F'], ['#2F62B0', 'Modré pole', '#2F62B0'], ['#FFD27A', 'Žlté pole', '#FFD27A']];
    const ledColSw = LEDC.map((c) => swatch(c[0], 'Text: ' + c[1], ed.ledCol, 'ledCol', c[2]));
    const ledBgSw = LEDB.map((c) => swatch(c[0], c[1], ed.ledBg, 'ledBg', c[2]));
    const ledSizes = ['XS', 'S', 'M', 'L', 'XL'].map((z) => ({ label: z, on: ed.ledSize === z, pick: () => upd({ ledSize: z }) }));
    const ledAligns = [['left', 'Vľavo'], ['center', 'Stred'], ['right', 'Vpravo']].map((z) => ({ label: z[1], on: ed.ledAlign === z[0], pick: () => upd({ ledAlign: z[0] }) }));
    const edR = rdev(pl, ed); const edLedR = isLedR(edR);
    const edLedText = edLedR && ed.kind === 'led';
    const edClock = ed.kind === 'clock';
    const flag = (ch) => String(ed.text || '').indexOf(ch) >= 0;
    const flip = (ch) => upd({ text: flag(ch) ? String(ed.text).replace(ch, '') : String(ed.text || '') + ch });
    const clkOpts = [['n', 'Dátum', true], ['s', 'Sekundy', false], ['w', 'Deň v týždni', false], ['y', 'Rok', false]].filter((o) => o[0] === 'n' || o[0] === 's' || !flag('n')).map((o) => ({ title: o[1], on: o[2] ? !flag(o[0]) : flag(o[0]), toggle: () => flip(o[0]) }));
    const edPart = partBy(pl.dev, ed.d);
    const delEd = () => { if (s.confirm === 'ed') { const sid = ed.id; set(Object.assign({ confirm: '' }, backState())); delSlide(sid); } else { set({ confirm: 'ed' }); say('Ťuknite ešte raz a snímka sa zmaže.'); } };

    // ---------- SCHVAĽOVANIE ----------
    const AS = { pending: ['warn', 'Čaká'], approved: ['ok', 'Schválené'], returned: ['blue', 'Vrátené'], rejected: ['bad', 'Zamietnuté'] };
    const apvMine = ACC.apv ? s.apvs : s.apvs.filter(isOwn);
    const pendAll = apvMine.filter((a) => a.state === 'pending');
    const doneAll = apvMine.filter((a) => a.state !== 'pending');
    const apvTabs = [['pending', 'Čaká (' + pendAll.length + ')'], ['done', 'Vybavené (' + doneAll.length + ')']].map((t) => ({ label: t[1], on: s.apvTab === t[0], pick: () => set({ apvTab: t[0] }) }));
    const apvRows = (s.apvTab === 'pending' ? pendAll : doneAll).map((a) => { const p = plById(a.plId) || { where: [], dev: 'lcd' }; return { open: () => nav('ad', { adId: a.id, apvNote: '' }), name: a.name, by: isOwn(a) ? 'Odoslané vami · ' + a.when : a.author + ' · ' + a.when, k: AS[a.state][0], stT: isOwn(a) && a.state === 'pending' ? 'Odoslané vami' : AS[a.state][1], devT: DEV[p.dev][1], nChg: a.changes.length + ' ' + plural(a.changes.length, ['zmena', 'zmeny', 'zmien']), nPl: nPlaces(p.where.length) }; });
    const at = (list, e) => { const tot = list.reduce((a, x) => a + x.dur, 0); if (!tot) return null; let t = e % tot; for (let k = 0; k < list.length; k++) { if (t < list[k].dur) return list[k]; t -= list[k].dur; } return list[0]; };
    const ad = s.apvs.find((a) => a.id === s.adId) || s.apvs[0];
    const adPl = plById(ad.plId) || pl;
    const CHG = { add: ['add', '+'], del: ['del', '−'], mod: ['mod', '~'], ord: ['ord', '↕'] };
    const adCanAct = ad.state === 'pending' && !isOwn(ad) && ACC.apv;
    const decide = (state, doneT, toastT) => {
      const approved = state === 'approved';
      set(Object.assign({ apvs: s.apvs.map((a) => a.id === ad.id ? Object.assign({}, a, { state, note: s.apvNote.trim(), doneT }) : a), pls: s.pls.map((p) => p.id === ad.plId ? Object.assign({}, p, approved ? { st: 'nahraty', flow: 'none' } : { flow: state === 'returned' ? 'draft' : 'none' }) : p), places: approved ? deliver(s.places, adPl) : s.places, apvTab: 'pending', apvNote: '', sheet: null }, backState()));
      say(toastT);
      if (approved && adPl.where.length) notify(deliveredT(adPl, adPl.where));
    };
    const adObj = {
      name: ad.name, by: isOwn(ad) ? 'Odoslané vami · ' + ad.when : ad.author + ' · ' + ad.when, k: AS[ad.state][0], stT: isOwn(ad) && ad.state === 'pending' ? 'Odoslané vami' : AS[ad.state][1], devT: DEV[adPl.dev][0],
      whereT: adPl.where.length ? names(adPl.where).join(' · ') : 'Zatiaľ žiadne miesto', valid: ad.valid, doneT: ad.doneT || '', hasNote: !!(ad.note && ad.state !== 'pending'), note: ad.note || ''
    };

    // ---------- GALÉRIA ----------
    const FT = { img: ['Obrázok', IC.image], vid: ['Video', IC.film], aud: ['Zvuk', IC.music] };
    const galOk = (g, f) => f === 'all' || (f === 'unused' ? g.used === 0 : g.type === f);
    const galChips = [['all', 'Všetko'], ['img', 'Obrázky'], ['vid', 'Videá'], ['aud', 'Zvuky'], ['unused', 'Nepoužité']].map((c) => ({ label: c[1], n: s.gal.filter((g) => galOk(g, c[0])).length, on: s.galF === c[0], pick: () => set({ galF: c[0] }) }));
    const thFile = (g) => 'position:relative;width:100%;aspect-ratio:4/3;border-radius:12px;display:flex;align-items:center;justify-content:center;background:' + (g.type === 'aud' ? 'linear-gradient(135deg,#1F2323,#0B6E6E)' : GRAD(g.col));
    const galRows = s.gal.filter((g) => galOk(g, s.galF)).map((g) => ({ open: () => set({ sheet: 'gd', galId: g.id, confirm: '' }), aria: 'Detail súboru ' + g.name, thS: thFile(g), d: FT[g.type][1], hasDur: !!g.dur, dur: g.dur || '', name: g.name, size: g.size, unused: g.used === 0 }));
    const galFile = s.gal.find((g) => g.id === s.galId) || s.gal[0] || { id: '', name: '', type: 'img', size: '', folder: '', used: 0, usedIn: [], col: '#C9D2D2' };
    const gd = {
      name: galFile.name, bigS: 'width:100%;height:190px;border-radius:14px;display:flex;align-items:center;justify-content:center;flex:none;background:' + (galFile.type === 'aud' ? 'linear-gradient(135deg,#1F2323,#0B6E6E)' : GRAD(galFile.col)), d: FT[galFile.type][1], typeT: FT[galFile.type][0] + (galFile.dur ? ' · ' + galFile.dur : ''),
      size: galFile.size, folder: galFile.folder, usedT: galFile.used ? galFile.used + '×' : 'Nepoužité', hasUse: galFile.used > 0, useList: galFile.usedIn.join(' · ')
    };

    // ---------- MIESTA ----------
    const PST = { up: ['ok', 'Aktívny'], exp: ['bad', 'Expirovaný'], no: ['grey', 'Nenahratý'] };
    const pcProb = (p) => p.n > 0 && (!p.on || p.st === 'exp');
    const pcOk = (p, f) => f === 'all' || (f === 'prob' ? pcProb(p) : f === 'off' ? p.n > 0 && !p.on : f === 'none' ? p.n === 0 : p.st === f);
    const pcChips = [['all', 'Všetky'], ['prob', 'Hlásenia'], ['up', 'Aktívne'], ['exp', 'Expirované'], ['no', 'Nenahraté'], ['off', 'Offline'], ['none', 'Bez zariadenia']].map((c) => ({ label: c[1], n: vPlaces.filter((p) => pcOk(p, c[0])).length, on: s.pcF === c[0], pick: () => set({ pcF: c[0] }) }));
    const pql = s.pq.trim().toLowerCase();
    const pcList = vPlaces.filter((p) => pcOk(p, s.pcF) && (!pql || p.name.toLowerCase().indexOf(pql) >= 0));
    const devLine = (p) => p.n === 0 ? 'Bez zariadenia' : DEV[p.dev][1] + (p.g >= 0 ? ' · ' + GRP[p.g] : '');
    const pcRows = pcList.map((p) => { const ep = p.n ? effPl(p) : null; return {
      dotK: p.n === 0 ? '' : p.on ? 'ok' : 'bad', name: p.name, devT: devLine(p), plName: p.n === 0 ? 'Miesto zatiaľ nemá zariadenie' : (ep ? ep.name : 'Bez playlistu') + (p.on ? '' : ' · offline ' + p.off), hasDev: p.n > 0, offline: p.n > 0 && !p.on,
      stK: (PST[p.st] || ['grey', ''])[0], stT: (PST[p.st] || ['grey', ''])[1], temp: !!p.temp, until: p.temp ? p.temp.until : '',
      revert: () => { set({ places: s.places.map((x) => x.id === p.id ? Object.assign({}, x, { temp: null }) : x) }); say(p.name + ': vrátený pôvodný playlist.'); }, change: () => swForPlace(p.id), canSw: ACC.pub, changeA: 'Prepnúť playlist na mieste: ' + p.name, canEdit: !!ep, edit: () => editAtPlace(p.id), editA: 'Upraviť playlist: ' + (ep ? ep.name : '')
    }; });

    // ---------- NASTAVENIA A AI ----------
    const NT = [['n1', 'Čaká na schválenie', 'Keď niekto odošle playlist na schválenie'], ['n5', 'Playlist je na zariadení', 'Keď sa playlist poslaný z telefónu nahrá na zariadenie'], ['n2', 'Miesto je offline', 'Keď zariadenie na mieste prestane odpovedať'], ['n3', 'Playlist čoskoro expiruje', '3 dni pred koncom platnosti'], ['n4', 'Potvrdenie rýchlej správy', 'Po odoslaní alebo zrušení správy']];
    const notifRows = NT.map((n) => ({ title: n[1], sub: n[2], on: !!s.notif[n[0]], toggle: () => set({ notif: Object.assign({}, s.notif, { [n[0]]: !s.notif[n[0]] }) }) }));
    const AIT = [['a1', 'Návrh textu správy', 'AI navrhne stručný text správy podľa situácie (meškanie, odklon…).'], ['a2', 'Kontrola pred odoslaním', 'AI upozorní na preklepy, nečitateľné farby a chýbajúce údaje.']];
    const aiRows = AIT.map((n) => ({ title: n[1], sub: n[2], on: !!s.aiOn[n[0]], toggle: () => set({ aiOn: Object.assign({}, s.aiOn, { [n[0]]: !s.aiOn[n[0]] }) }) }));
    const AIS = {
      delay: ['Meškanie', 'info', ['Linka 5 mešká približne 10 minút. Ďakujeme za trpezlivosť.', 'Spoje linky 5 majú meškanie do 10 minút.', 'Meškanie linky 5: asi 10 minút. Sledujte odchody na tabuli.']],
      detour: ['Odklon', 'warn', ['Linka 5 je dnes odklonená cez Bulvár.', 'Odklon linky 5: zastávka Mostná sa neobsluhuje, použite Bulvár.', 'Linka 5 dnes nejde cez Mostnú. Nastúpte na zastávke Bulvár.']],
      outage: ['Výluka', 'warn', ['Električky T1 a T2 dnes nepremávajú, nahrádza ich autobus.', 'Výluka električiek T1 a T2. Náhradná doprava odchádza zo zastávky Bulvár.', 'T1 a T2 dnes nejazdia. Použite náhradný autobus.']],
      closed: ['Zatvorená zastávka', 'warn', ['Zastávka Mostná je dočasne zatvorená. Použite zastávku Bulvár.', 'Mostná: zastávka je presunutá o 50 m v smere jazdy.', 'Zastávka Mostná sa dnes neobsluhuje.']]
    };

    // ---------- NÁHĽAD ----------
    const pvPl = plById(s.pvPl) || pl;
    const pvSl = pvPl.slides[Math.min(s.pvI, Math.max(0, pvPl.slides.length - 1))];
    const pvSegs = pvPl.slides.map((x, i) => ({ s: 'flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,.25);overflow:hidden', f: 'display:block;height:100%;background:#2BD0D0;width:' + (i < s.pvI ? 100 : i === s.pvI ? Math.round(100 * s.pvT / x.dur) : 0) + '%' }));
    const pvTot = !!partsOf(pvPl);
    const pvStep = (d) => pvTot ? set({ pvE: Math.max(0, (s.pvE || 0) + d * 5) }) : set({ pvI: (s.pvI + d + pvPl.slides.length) % Math.max(1, pvPl.slides.length), pvT: 0 });
    const pvObj = pvSl || BLANK;
    const pvParts = pvTot ? partsOf(pvPl).map((q) => { const x = at(pvPl.slides.filter((z) => z.d === q[0]), s.pvE || 0); return x ? Object.assign({}, x, { dev: q[2], w: '112', r: '3' }) : null; }).filter(Boolean) : (pvSl ? [Object.assign({}, pvSl, { dev: pvPl.dev, w: String(isPort(pvPl.dev) ? 230 : fw(358)), r: '10' })] : []);

    // ---------- RÝCHLA SPRÁVA ----------
    const Q = s.quick;
    const setQ = (o) => set({ quick: Object.assign({}, Q, o) });
    // šablóny rýchlej správy: zobrazí sa prvých päť, ostatné až po ťuknutí na „Viac“
    const QTPL = [['Meškanie', 'Linka 5 mešká približne 10 minút. Ďakujeme za trpezlivosť.', 'warn', 'bottom'], ['Odklon', 'Linka 5 je dnes odklonená. Zastávka je dočasne presunutá.', 'warn', 'top'], ['Výpadok', 'Pre technickú poruchu je premávka obmedzená. Sledujte pokyny personálu.', 'warn', 'full'], ['Info', 'Od pondelka platí nový cestovný poriadok.', 'info', 'bottom'], ['Výluka', 'Električky T1 a T2 nepremávajú, nahrádza ich autobus.', 'warn', 'full'],
      ['Zatvorená zastávka', 'Zastávka Mostná je dočasne zatvorená. Použite zastávku Bulvár.', 'warn', 'top'], ['Náhradná doprava', 'Náhradná doprava odchádza zo zastávky Bulvár.', 'info', 'bottom'], ['Bezplatná doprava', 'Dnes je doprava pre deti zadarmo.', 'info', 'bottom'], ['Podujatie', 'Dnes od 18:00 je Hlavná ulica uzavretá pre podujatie. Spoje idú obchádzkou.', 'info', 'bottom']];
    const TPL_N = 5;
    const QTPL_ON = QTPL;
    const qTplRest = Math.max(0, QTPL_ON.length - TPL_N);
    const qTpls = (s.qTplAll ? QTPL_ON : QTPL_ON.slice(0, TPL_N)).map((c) => ({ label: c[0], pick: () => setQ({ text: Tx(c[1]), prio: c[2], pos: c[3] }) }));
    const qPrios = [['info', 'Oznam'], ['warn', 'Výstraha']].map((c) => ({ label: c[1], on: Q.prio === c[0], pick: () => setQ({ prio: c[0] }) }));
    const qPoss = [['top', 'Horný pás'], ['bottom', 'Dolný pás'], ['full', 'Celá obrazovka']].map((c) => ({ label: c[1], on: Q.pos === c[0], pick: () => setQ({ pos: c[0] }) }));
    const qDurs = ['m15', 'h1', 'day', 'rev'].map((k) => ({ label: DURS[k][0], on: Q.dur === k, pick: () => setQ({ dur: k }) }));
    const qSel = Q.all ? devIds : Q.ids;
    const setSel = (ids) => setQ(ids.length === devIds.length ? { all: true, ids: [] } : { all: false, ids });
    const qGrps = GRP.map((g, i) => { const gi = grpIds(i); const on = gi.length > 0 && gi.every((x) => qSel.indexOf(x) >= 0); return { label: g + ' (' + gi.length + ')', on, pick: () => setSelOrd(on ? qSel.filter((x) => gi.indexOf(x) < 0) : qSel.concat(gi.filter((x) => qSel.indexOf(x) < 0))) }; });
    const qsl = s.qSearch.trim().toLowerCase();
    // vybrané miesta hore: poradie sa určí pri otvorení zoznamu a pri výbere skupiny (jednotlivé ťuknutie zoznam nepreskladá)
    const snapOrd = (sel) => withDev.filter((p) => sel.indexOf(p.id) >= 0).concat(withDev.filter((p) => sel.indexOf(p.id) < 0)).map((p) => p.id);
    const ordIx = (id) => { const k = (s.qOrd || []).indexOf(id); return k < 0 ? 1e6 : k; };
    const withDevO = s.qOrd ? withDev.slice().sort((a, b) => ordIx(a.id) - ordIx(b.id)) : withDev;
    const toTop = () => setTimeout(() => { try { const e = document.querySelector('.sheet .sheet-b'); if (e) e.scrollTop = 0; } catch (x) {} }, 30);
    const setSelOrd = (ids) => { set({ quick: Object.assign({}, Q, ids.length === devIds.length ? { all: true, ids: [] } : { all: false, ids }), qOrd: snapOrd(ids) }); toTop(); };
    const qPcs = withDevO.filter((p) => !qsl || p.name.toLowerCase().indexOf(qsl) >= 0).map((p) => { const on = qSel.indexOf(p.id) >= 0; return { name: p.name, sub: DEV[p.dev][1] + (p.g >= 0 ? ' · ' + GRP[p.g] : '') + (p.on ? '' : ' · offline'), on, pick: () => setSel(on ? qSel.filter((x) => x !== p.id) : qSel.concat([p.id])) }; });
    const qN = qSel.length;
    const qSend = () => {
      if (!Q.text.trim() || !qN) return;
      const m = { id: 'q' + self.nid(), text: Q.text.trim(), prio: Q.prio, pos: Q.pos, dur: Q.dur, until: DURS[Q.dur][1], all: SCOPE ? false : Q.all, ids: SCOPE && Q.all ? devIds.slice() : Q.ids.slice(), acc: s.role };
      set({ qa: [m].concat(s.qa), sheet: null, qStep: 'main', qSearch: '', qTplAll: false, quick: Object.assign({}, Q, { text: '' }) });
      say('Správa je odoslaná na ' + nPlaces(qN) + ' a zobrazí sa do pár sekúnd.');
    };

    // ---------- PREPNUTIE PLAYLISTU ----------
    const W = s.sw;
    const setW = (o) => set({ sw: Object.assign({}, W, o) });
    const swPlObj = plById(W.pl);
    const swDev = W.dev || (W.from === 'pl' ? (placeById(W.places[0]) || {}).dev : (swPlObj || {}).dev);
    const swPlsRows = vPls.filter((p) => p.slides.length && p.dev === swDev && p.st !== 'expirovany').map((p) => ({ name: p.name, meta: slMeta(p) + ' · ' + ST[p.st][1], on: W.pl === p.id, pick: () => setW({ pl: p.id }) }));
    const swPcs = withDev.filter((p) => p.dev === swDev).map((p) => { const ep = effPl(p); return { name: p.name, sub: (ep ? ep.name : 'Bez playlistu') + (p.on ? '' : ' · offline'), on: W.places.indexOf(p.id) >= 0, pick: () => setW({ places: W.places.indexOf(p.id) >= 0 ? W.places.filter((x) => x !== p.id) : W.places.concat([p.id]) }) }; });
    const swAll = withDev.filter((p) => p.dev === swDev).map((p) => p.id);
    const swToggle = (ids) => { const on = ids.length > 0 && ids.every((x) => W.places.indexOf(x) >= 0); setW({ places: on ? W.places.filter((x) => ids.indexOf(x) < 0) : W.places.concat(ids.filter((x) => W.places.indexOf(x) < 0)) }); };
    const swGrps = [['Všetky', swAll]].concat(GRP.map((g, i) => [g, withDev.filter((p) => p.dev === swDev && p.g === i).map((p) => p.id)])).filter((x) => x[1].length > 0 && (x[0] === 'Všetky' ? swAll.length > 1 : true))
      .map((x) => ({ label: x[0] + ' (' + x[1].length + ')', on: x[1].every((id) => W.places.indexOf(id) >= 0), pick: () => swToggle(x[1]) }));
    const swDurs = Object.keys(SWD).map((k) => ({ label: SWD[k][0], sub: SWD[k][1], on: W.dur === k, pick: () => setW({ dur: k }) }));
    const UNTIL = { today: 'do 23:59', h1: 'do ' + HM(60), h4: 'do ' + HM(240), rev: 'do odvolania' };
    const swPlaces = shortList(names(W.places));
    const swApply = () => {
      if (!swPlObj) return;
      set({ places: s.places.map((p) => W.places.indexOf(p.id) >= 0 ? Object.assign({}, p, { temp: { pl: W.pl, until: UNTIL[W.dur] } }) : p), sheet: null });
      const n = W.places.length;
      say('Odoslané – „' + swPlObj.name + '“ sa prepne na ' + n + ' ' + (n === 1 ? 'mieste' : 'miestach') + ' ' + UNTIL[W.dur] + '.');
      notify(deliveredT(swPlObj, W.places));
    };
    const swTitle = W.step === 'pl' ? 'Čo prehrávať' : W.step === 'pc' ? 'Kde prehrávať' : 'Ako dlho';
    const swSub = W.step === 'pl' ? 'Miesto: ' + swPlaces : W.step === 'pc' ? 'Playlist: ' + (swPlObj ? swPlObj.name : '') : 'Po skončení sa vráti pôvodný plán prehrávania.';
    const swSub2 = W.step === 'pl' ? 'Ponúkajú sa len playlisty pre zariadenie ' + (DEV[swDev] || [''])[1] + '.' : W.step === 'pc' ? 'Ponúkajú sa len miesta so zariadením ' + (DEV[swDev] || [''])[1] + '.' : '';
    const swBtn = W.step === 'dur' ? 'Použiť na ' + W.places.length + ' ' + plural(W.places.length, ['mieste', 'miestach', 'miestach']) : 'Ďalej';
    const swNext = () => { if (W.step === 'dur') swApply(); else setW({ step: W.step === 'pl' ? 'pc' : 'dur' }); };

    // ---------- PRIDANIE FOTKY / NAHRATIE ----------
    const gmode = s.addMode === 'gallery';
    const addFile = (kind) => {
      const f = makeFile(kind);
      if (gmode) { set({ gal: s.gal.concat([f]), sheet: null }); say('Súbor „' + f.name + '“ je nahratý do galérie.'); return; }
      const f2 = Object.assign({}, f, { used: 1, usedIn: [pl.name] });
      addPhotoSlide(pl.id, f2, s.gal.concat([f2]), true);
      say('Fotka je pridaná na koniec playlistu. Upravte popis a trvanie.');
    };
    const addOpts = [
      { d: IC.camera, title: 'Odfotiť', sub: 'Otvorí fotoaparát telefónu', pick: () => addFile('cam') },
      { d: IC.image, title: 'Z fotiek v telefóne', sub: 'Vyberte hotovú fotku', pick: () => addFile('ph') },
      gmode ? { d: IC.upload, title: 'Zo súborov', sub: 'Video z telefónu', pick: () => addFile('vid') } : { d: IC.list, title: 'Z galérie', sub: 'Obrázky a videá už nahraté v systéme', pick: () => set({ sheet: 'pick', pickMode: 'add' }) }
    ];
    const pickRows = s.gal.filter((g) => g.type !== 'aud').map((g) => ({ aria: 'Vybrať ' + g.name, thS: thFile(g), d: FT[g.type][1], name: g.name, size: g.size, pick: () => {
      if (s.pickMode === 'replace') { set({ pls: s.pls.map((p) => p.id === pl.id ? Object.assign({}, p, { flow: 'draft', slides: p.slides.map((x) => x.id === ed.id ? Object.assign({}, x, { img: g.col, imgName: g.name }) : x), log: logSlide(p.log, ed.id, ed.title) }) : p), gal: bumpGal(s.gal, g.id, pl.name), sheet: null }); say('Obrázok je zmenený na „' + g.name + '“.'); }
      else { addPhotoSlide(pl.id, g, bumpGal(s.gal, g.id, pl.name), true); say('Fotka je pridaná na koniec playlistu. Upravte popis a trvanie.'); }
    } }));
    const isNewPl = s.sheet === 'newpl'; const isLang = s.sheet === 'lang'; const isAcc = s.sheet === 'acc';
    const curLang = WL ? WL.get() : 'sk';
    const pickAcc = (k) => { set({ role: k, sheet: null, screen: 'home', stack: [], reorder: false, confirm: '', pcF: 'all', pq: '', filt: 'all', q: '', apvTab: 'pending', toast: '' }); say('Prepnuté na účet ' + MACC[k].name + '.'); };
    const lsRows = isAcc ? Object.keys(MACC).map((k) => ({ name: MACC[k].name, meta: MACC[k].role + ' · ' + MACC[k].desc, d: k === s.role ? IC.tick : IC.none, pick: () => pickAcc(k) })) : isLang ? (WL ? WL.list : ['sk']).map((k) => ({ name: WL ? WL.names[k] : 'Slovenčina', meta: '', d: k === curLang ? IC.tick : IC.none, pick: () => { if (WL) WL.set(k); set({ sheet: null }); } })) : isNewPl
      ? Object.keys(DEV).map((k) => ({ d: IC.next, name: DEV[k][0], meta: PARTS[k] ? 'Tri displeje pod sebou – čas a dátum, odchody, e-papier' : isLedDev(k) ? 'Texty a odchody na LED tabuli' : 'Fotky, texty a odchody', pick: () => createPl(k) }))
      : vPls.filter((p) => p.flow !== 'pending' && !isLedDev(p.dev) && !PARTS[p.dev]).map((p) => ({ d: IC.plus, name: p.name, meta: DEV[p.dev][1] + ' · ' + slMeta(p), pick: () => { addPhotoSlide(p.id, galFile, bumpGal(s.gal, galFile.id, p.name), false); say('Pridané do playlistu „' + p.name + '“. ' + (ACC.pub ? 'Nezabudnite ho zverejniť.' : 'Nezabudnite ho odoslať na schválenie.')); } }));
    const gdDelete = () => {
      if (s.confirm === 'gd') { set({ gal: s.gal.filter((g) => g.id !== galFile.id), sheet: null, confirm: '' }); say('Súbor „' + galFile.name + '“ je zmazaný.'); } else set({ confirm: 'gd' });
    };

    const tabs = [['home', 'Domov', IC.home], ['pls', 'Playlisty', IC.list], ['plc', 'Miesta', IC.pin], ['ai', 'AI asistent', IC.spark], ['more', 'Viac', IC.more]].map((t) => ({ label: t[1], d: t[2], cur: tabOf === t[0] ? 'page' : false, pick: () => goTab(t[0]), hasBadge: t[0] === 'more' && pendingOthers.length > 0, badge: String(pendingOthers.length) }));
    const myPend = pendAll.length;
    const moreRows = [
      { d: IC.users, title: 'Prepnúť účet', sub: ACC.name + ' · ' + ACC.role, hasBadge: false, badge: '', open: () => set({ sheet: 'acc' }) }
    ].concat(ACC.apv ? [{ d: IC.check, title: 'Schvaľovanie', sub: pendingOthers.length ? pendingOthers.length + ' ' + plural(pendingOthers.length, ['playlist čaká', 'playlisty čakajú', 'playlistov čaká']) + ' na schválenie' : 'Nič nečaká na schválenie', hasBadge: pendingOthers.length > 0, badge: String(pendingOthers.length), open: () => nav('apv', { apvTab: 'pending' }) }]
      : ACC.partner ? [{ d: IC.check, title: 'Odoslané na schválenie', sub: myPend ? myPend + ' ' + plural(myPend, ['playlist čaká', 'playlisty čakajú', 'playlistov čaká']) + ' na schválenie' : 'Nič nečaká na schválenie', hasBadge: false, badge: '', open: () => nav('apv', { apvTab: 'pending' }) }] : []).concat([
      { d: IC.image, title: 'Galéria', sub: 'Obrázky, videá a zvuky, nahratie a zmazanie', hasBadge: false, badge: '', open: () => nav('gal') },
      { d: IC.msg, title: 'História správ', sub: 'Skončené a zrušené rýchle správy, poslať znova', hasBadge: false, badge: '', open: () => nav('hist') },
      { d: IC.spark, title: 'Nastavenie AI asistenta', sub: 'Návrh textu rýchlej správy a kontrola pred odoslaním', hasBadge: false, badge: '', open: () => nav('aiset') },
      { d: IC.gear, title: 'Nastavenia', sub: 'Vzhľad, upozornenia a úložisko', hasBadge: false, badge: '', open: () => nav('set') },
      { d: IC.globe, title: 'Jazyk: ' + (WL ? WL.name() : 'Slovenčina'), sub: 'Jazyk aplikácie', hasBadge: false, badge: '', open: () => set({ sheet: 'lang' }) }
    ]);
    const pvDev = pvPl.dev;

    // ---------- AI ASISTENT: chat ----------
    const AIQ = { delay: 'Napíš správu o meškaní', detour: 'Napíš správu o odklone', outage: 'Napíš správu o výluke', closed: 'Napíš správu o zatvorenej zastávke' };
    const AIH = { delay: 'Návrhy správy o meškaní:', detour: 'Návrhy správy o odklone:', outage: 'Návrhy správy o výluke:', closed: 'Návrhy správy o zatvorenej zastávke:' };
    const AIK = {
      delay: ['mesk', 'zpozd', 'opozn', 'delay', 'late', 'verspat'],
      detour: ['odklon', 'objizd', 'objazd', 'detour', 'umleit'],
      outage: ['vyluk', 'nepremav', 'nejazd', 'nejezd', 'outage', 'ausfall', 'sperrung', 'wylacz'],
      closed: ['zatvoren', 'uzavret', 'zavren', 'closed', 'zamkniet', 'geschlossen', 'gesperrt']
    };
    const aiNorm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const aiAny = (q, ws) => ws.some((w) => q.indexOf(w) >= 0);
    const aiPlaces = (q) => {
      let best = 0; const hit = [];
      vPlaces.forEach((p) => { const n = aiNorm(p.name).split(/[^a-z0-9]+/).filter((w) => w.length >= 4).filter((w) => q.indexOf(w.slice(0, 5)) >= 0).length; if (n > best) { best = n; hit.length = 0; } if (n && n === best) hit.push(p.id); });
      return hit.slice(0, 8);
    };
    const aiAnswer = (raw) => {
      const q = aiNorm(raw); const words = q.split(/[^a-z0-9]+/);
      if (aiAny(q, ['schval', 'approv', 'zatwierdz', 'genehmig', 'freigab'])) return { kind: 'apv' };
      const sit = Object.keys(AIK).find((k) => aiAny(q, AIK[k]));
      if (sit) return s.aiOn.a1 ? { kind: 'draft', sit } : { kind: 'aioff' };
      if (aiAny(q, ['napis', 'navrh', 'write', 'draft', 'napisz', 'schreib', 'formul'])) return s.aiOn.a1 ? { kind: 'sitask' } : { kind: 'aioff' };
      if (aiAny(q, ['expir', 'vyprs', 'abgelauf', 'wygas'])) return { kind: 'exp' };
      if (aiAny(q, ['hlasen', 'offline', 'problem', 'porucha', 'nefung', 'alert', 'storung', 'zglosz', 'meldung', 'nedzia'])) return { kind: 'prob' };
      if (aiAny(q, ['zobrazen', 'na displej', 'displayed', 'on display', 'wyswietl', 'angezeigt'])) return { kind: 'qa' };
      const ids = aiPlaces(q);
      if (ids.length) return { kind: 'play', ids };
      if (aiAny(q, ['hra', 'prehrav', 'bezi', 'playing', 'hraje', 'odtwarz', 'lauft', 'spielt'])) return { kind: 'noplace' };
      if (aiAny(q, ['pomoc', 'help', 'co vies', 'co umis', 'hilfe', 'what can'])) return { kind: 'help' };
      if (aiAny(q, ['dakuj', 'diky', 'dekuj', 'thank', 'dziek', 'danke', 'vdaka'])) return { kind: 'thanks' };
      if (words.some((w) => ['ahoj', 'cau', 'hello', 'hallo', 'hi', 'zdravim', 'czesc'].indexOf(w) >= 0) || aiAny(q, ['dobry den', 'dzien dobry', 'guten tag'])) return { kind: 'hi' };
      return { kind: 'fallback' };
    };
    const aiScroll = () => setTimeout(() => { try { const el = document.getElementById('ai-chat'); if (el) el.scrollTop = el.scrollHeight; } catch (e) {} }, 40);
    const aiAsk = (text, chip) => {
      const t = String(text || '').trim(); if (!t || s.aiTyping) return;
      const ans = aiAnswer(t); const n = s.aiChat.length;
      set({ aiChat: s.aiChat.concat([{ id: n + 1, who: 'me', text: t, chip: !!chip }]), aiQ: '', aiTyping: true }); aiScroll();
      clearTimeout(self._tai); self._tai = setTimeout(() => { const c = self.state.aiChat; self.setState({ aiTyping: false, aiChat: c.concat([Object.assign({ id: c.length + 1, who: 'ai' }, ans)]) }); aiScroll(); }, 650);
    };
    const aiUse = (sit, t) => () => set({ sheet: 'quick', qStep: 'main', qSearch: '', quick: Object.assign({}, s.quick, { text: Tx(t), prio: AIS[sit][1], pos: AIS[sit][1] === 'warn' ? 'top' : 'bottom' }) });
    const aiItemP = (p) => { const ep = p.n ? effPl(p) : null; return { name: p.name, sub: p.n === 0 ? 'Miesto zatiaľ nemá zariadenie' : (ep ? ep.name : 'Bez playlistu') + (p.on ? '' : ' · offline ' + p.off), canTap: !!ep, noTap: !ep, tap: () => { if (ep) editAtPlace(p.id); }, aria: ep ? 'Upraviť playlist: ' + ep.name : '' }; };
    const aiBuild = (m) => {
      const base = { id: m.id, who: m.who, me: m.who === 'me', meChip: m.who === 'me' && !!m.chip, meTyped: m.who === 'me' && !m.chip, ai: m.who === 'ai', text: '', items: [], sugg: [], acts: [], note: '' };
      if (m.who === 'me') return Object.assign(base, { text: m.text });
      const r = base; const A = (label, fn) => r.acts.push({ label, fn });
      if (m.kind === 'draft') { r.text = AIH[m.sit]; r.sugg = AIS[m.sit][2].map((t) => ({ text: t, use: aiUse(m.sit, t) })); r.note = 'Tlačidlo Použiť otvorí rýchlu správu s týmto textom. Pred odoslaním ho môžete upraviť.'; }
      else if (m.kind === 'sitask') { r.text = 'O čom má byť správa? Vyberte situáciu.'; Object.keys(AIS).forEach((k) => A(AIS[k][0], () => aiAsk(AIQ[k], true))); }
      else if (m.kind === 'aioff') { r.text = 'Návrh textu správy je vypnutý v nastavení AI asistenta.'; A('Otvoriť nastavenie', () => nav('aiset')); }
      else if (m.kind === 'prob') { const ps = vPlaces.filter(pcProb); if (!ps.length) r.text = 'Všetky miesta sú v poriadku.'; else { r.text = 'Tieto miesta majú hlásenie:'; r.items = ps.map((p) => Object.assign(aiItemP(p), { sub: p.on ? 'Expirovaný playlist' : 'offline ' + p.off })); A('Zobraziť v Miestach', () => set({ screen: 'plc', stack: [], sheet: null, pcF: 'prob', pq: '' })); } }
      else if (m.kind === 'exp') { const ps = vPls.filter((p) => p.st === 'expirovany'); if (!ps.length) r.text = 'Žiadny playlist neexpiroval.'; else { r.text = 'Tieto playlisty expirovali:'; r.items = ps.map((p) => ({ name: p.name, sub: DEV[p.dev][1], canTap: true, noTap: false, tap: () => nav('pl', { plId: p.id }), aria: 'Upraviť playlist: ' + p.name })); A('Zobraziť v Playlistoch', () => set({ screen: 'pls', stack: [], sheet: null, filt: 'expirovany', q: '' })); } }
      else if (m.kind === 'play') { r.text = 'Na týchto miestach sa teraz prehráva:'; r.items = m.ids.map(placeById).filter(Boolean).filter((p) => vPlaces.indexOf(p) >= 0).map(aiItemP); }
      else if (m.kind === 'noplace') r.text = 'Ktoré miesto myslíte? Napíšte jeho názov, napríklad Hlavná stanica alebo Nemocnica.';
      else if (m.kind === 'apv') {
        if (ACC.apv) { if (!pendingOthers.length) r.text = 'Nič nečaká na schválenie.'; else { r.text = 'Na schválenie čaká:'; r.items = pendingOthers.map((a) => ({ name: a.name, sub: a.author + ' · ' + a.when, canTap: true, noTap: false, tap: () => nav('ad', { adId: a.id, apvNote: '' }), aria: a.name })); A('Otvoriť schvaľovanie', () => nav('apv', { apvTab: 'pending' })); } }
        else if (ACC.partner) { if (!pendAll.length) r.text = 'Nič nečaká na schválenie.'; else { r.text = 'Na schválenie ste odoslali:'; r.items = pendAll.map((a) => ({ name: a.name, sub: a.when, canTap: false, noTap: true, tap: () => {}, aria: '' })); A('Otvoriť schvaľovanie', () => nav('apv', { apvTab: 'pending' })); } }
        else r.text = 'Zmeny zverejňujete priamo, schvaľovanie robí správca.';
      }
      else if (m.kind === 'qa') { if (!qaRows.length) r.text = 'Teraz nie je zobrazená žiadna rýchla správa.'; else { r.text = 'Na displejoch sú teraz tieto správy:'; r.items = qaRows.map((x) => ({ name: x.text, sub: x.prioT + ' · ' + x.meta, canTap: false, noTap: true, tap: () => {}, aria: '' })); } A('Nová rýchla správa', openQuick); }
      else if (m.kind === 'help') r.text = 'Viem napísať text rýchlej správy, nájsť miesta s hlásením, povedať, čo sa kde prehráva, a ukázať, čo čaká na schválenie alebo je zobrazené.';
      else if (m.kind === 'thanks') r.text = 'Rado sa stalo. Ak treba, pýtajte sa ďalej.';
      else if (m.kind === 'hi') r.text = 'Dobrý deň. S čím vám pomôžem?';
      else r.text = 'Tomuto zatiaľ nerozumiem. Skúste jednu z otázok nad poľom na písanie.';
      return Object.assign(r, { hasItems: r.items.length > 0, hasSugg: r.sugg.length > 0, hasActs: r.acts.length > 0, hasNote: !!r.note });
    };
    const aiMsgs = s.aiChat.map(aiBuild);
    const aiChipQ = ['Napíš správu o meškaní', 'Napíš správu o odklone', 'Ktoré miesta majú hlásenie?', 'Čo sa hrá na Hlavnej stanici?', 'Ktoré playlisty expirovali?'].concat(ACC.apv || ACC.partner ? ['Čo čaká na schválenie?'] : []).concat(['Ktoré správy sú zobrazené?']);
    const aiChips = aiChipQ.map((t) => ({ label: t, ask: () => aiAsk(t, true) }));

    return {
      ic: IC, meName: ACC.name, meIni: ACC.ini, meRole: ACC.role + ' · ' + (ACC.partner ? 'zmluvný partner DP Riečany' : ME.org), homeHi: ACC.first ? 'Dobrý deň, ' + ACC.first : 'Dobrý deň', canSwPl: ACC.pub,
      themeAttr: s.theme === 'dark' || s.theme === 'auto' ? s.theme : 'light',
      fdHome: s.fdark && !s.fdOk, fdSet: s.fdark || s.samsung, fdHide: () => { set({ fdOk: true }); try { localStorage.setItem('wz_m_fdark_ok', '1'); } catch (e) {} },
      themeOpts: [['light', 'Svetlý'], ['dark', 'Tmavý'], ['auto', 'Podľa telefónu']].map((t) => ({ label: t[1], on: s.theme === t[0], pick: () => { set({ theme: t[0] }); try { localStorage.setItem('wz_m_theme', t[0]); } catch (e) {} } })), homeDate: ((d) => DOWN[d.getDay()] + ' ' + d.getDate() + '. ' + MONG[d.getMonth()])(new Date()) + ' · DP Riečany',
      hdS: 'background:' + (dark ? 'var(--hddk)' : 'var(--sf)') + ';color:' + (dark ? '#fff' : 'var(--tx)') + ';' + (dark ? '' : 'border-bottom:1px solid var(--ln)'),
      subS: 'color:' + (dark ? '#B4C6C6' : 'var(--mut)'),
      hasBack: !tabRoot, goBack, hdLogo, hdTitle, hasSub: !!hdSub, hdSub, hdActs, tabs,
      s_home: sc === 'home', s_pls: sc === 'pls', s_pl: sc === 'pl', s_sl: sc === 'sl', s_apv: sc === 'apv', s_ad: sc === 'ad', s_gal: sc === 'gal', s_more: sc === 'more', s_hist: sc === 'hist', s_plc: sc === 'plc', s_set: sc === 'set', s_ai: sc === 'ai', s_aiset: sc === 'aiset', s_pv: sc === 'pv',
      sh_quick: s.sheet === 'quick', sh_sw: s.sheet === 'sw', sh_add: s.sheet === 'add', sh_pick: s.sheet === 'pick', sh_gd: s.sheet === 'gd', sh_lib: s.sheet === 'lib', sh_list: s.sheet === 'gpl' || isNewPl || isLang || isAcc,
      closeSheet, bgClose: (e) => { if (e && e.target === e.currentTarget) closeSheet(); }, hasToast: !!s.toast, toast: s.toast, hasPush: !!s.push, pushTitle: s.push ? s.push.title : '', pushText: s.push ? s.push.text : '', closePush: () => set({ push: null }),
      // domov
      openQuick, hasQa: qaRows.length > 0, qa: qaRows, hasPend: pendingOthers.length > 0, goApprovals: () => nav('apv', { apvTab: 'pending' }), pendT: pendingOthers.map((a) => a.name).slice(0, 2).join(' · ') + (pendingOthers.length > 2 ? ' · …' : ''), pendN: String(pendingOthers.length),
      nowRows, pcOn: String(pcOnN), pcDev: String(withDev.length), goPlaces: () => set({ screen: 'plc', stack: [], sheet: null, reorder: false, confirm: '', pq: '', pcF: withDev.some(pcProb) ? 'prob' : 'all' }), pcBarS: 'height:100%;border-radius:4px;background:#2E9E4F;width:' + (withDev.length ? Math.round(100 * pcOnN / withDev.length) : 0) + '%',
      pcOff: withDev.filter((p) => !p.on).map((p) => ({ name: p.name, since: p.off })), pcHasExp: expN > 0, pcExpT: expN + ' ' + plural(expN, ['miesto má', 'miesta majú', 'miest má']) + ' expirovaný playlist', qh: qhRows, qhHas: qhRows.length > 0, qhEmpty: qhRows.length === 0,
      // playlisty
      q: s.q, setQ: (e) => set({ q: e.target.value }), plChips, plRows, plEmpty: plRows.length === 0, newPl: () => set({ sheet: 'newpl' }),
      // detail playlistu
      hasSlides: pl.slides.length > 0, noSlides: pl.slides.length === 0, prvParts: prvOf(pl, 104), prvS: stackS(pl), noSlidesT: plTotem ? 'Playlist zatiaľ nemá žiadnu snímku. Pridajte snímku zo zoznamu.' : plLed ? 'Playlist zatiaľ nemá žiadnu snímku. Pridajte text alebo snímku zo zoznamu.' : 'Playlist zatiaľ nemá žiadnu snímku. Pridajte fotku alebo snímku zo zoznamu.',
      plNotLed: !plLed && !plTotem, plDevT: DEV[pl.dev][0],
      openPrev: () => openPrev(pl.id), plStK: ST[pl.st][0], plStT: ST[pl.st][1], plTouch: pl.touch, plHasFlow: pl.flow !== 'none', plFlowK: (FLOW[pl.flow] || ['', ''])[0], plFlowT: (FLOW[pl.flow] || ['', ''])[1],
      plMeta: slMeta(pl), locked, lockT, swFromPl: () => swForPl(pl.id), whereT, planT: pl.plan, slCount: String(pl.slides.length), canReorder: canEdit && pl.slides.length > 1, toggleReorder: () => set({ reorder: !s.reorder, confirm: '' }), reorderT: s.reorder ? 'Hotovo' : 'Upraviť poradie',
      slRows, canAddLcd: canEdit && !plLed && !plTotem, canAddLed: canEdit && plLed, canAddTotem: canEdit && plTotem, openAdd, addLed, mainAct,
      openLib, libRows, libEmpty: libRows.length === 0, libEmptyT: lql ? 'Žiadna snímka nezodpovedá hľadaniu.' : 'Pre toto zariadenie zatiaľ nie je v zozname žiadna ďalšia snímka.', libQ: s.libQ, setLibQ: (e) => set({ libQ: e.target.value }), libDevT: 'Pre zariadenie: ' + DEV[pl.dev][1],
      // editor
      ed, edRdev: edR, edW: String(edPart ? edPart[5] : isPort(pl.dev) ? 190 : fw(338)), edDevT: DEV[pl.dev][0] + (edPart ? ' · ' + edPart[1] : ''), edClock, clkOpts, edHasDur: !edClock, edLedField: edLedR && !edClock, setTitle: (e) => upd({ title: e.target.value }), setText: (e) => upd({ text: e.target.value }),
      edLcd: !edLedR, edLedText, edLedLen: ed.title.length + ' znakov' + (edR === 'vehicle' ? ' · dlhší text po tabuli beží' : ' · dlhší text sa zalomí do riadkov'),
      edHasText: ed.kind === 'deps' || (!edLedR && ed.kind === 'info'), edTextLbl: ed.kind === 'deps' ? 'Zobrazené linky' : 'Text snímky', edTextRows: ed.kind === 'deps' ? 1 : 3,
      edIsPhoto: !edLedR && ed.kind === 'photo', edImgS: 'display:block;width:56px;height:56px;border-radius:10px;flex:none;background:' + GRAD(ed.img || '#C9D2D2'), edImgName: ed.imgName || 'bez obrázka', openPickReplace: () => set({ sheet: 'pick', pickMode: 'replace' }),
      edHasBg: !edLedR && ed.kind !== 'photo', bgSw, durMinus: () => upd({ dur: Math.max(5, ed.dur - 5) }), durPlus: () => upd({ dur: Math.min(120, ed.dur + 5) }),
      edLed: edLedR, edFieldLbl: ed.kind === 'deps' ? 'Pole za číslom linky' : 'Pole (pozadie za textom)', ledSizes, ledAligns, ledColSw, ledBgSw,
      ledHint: ed.kind === 'deps' ? 'Číslo linky je vždy tmavé na farebnom poli.' : 'S poľom je text tmavý na farebnom podklade. Bez poľa je pozadie čierne.', delSlideEd: delEd, delEdT: s.confirm === 'ed' ? 'Potvrdiť zmazanie' : 'Zmazať snímku',
      // schvaľovanie
      apvTabs, apvRows, apvEmpty: apvRows.length === 0, apvEmptyT: s.apvTab === 'pending' ? (ACC.apv ? 'Všetko je vybavené. Nič nečaká na schválenie.' : 'Nič nečaká na schválenie.') : 'Zatiaľ tu nie je nič vybavené.',
      ad: adObj,
      adSlides: adPl.slides.map((x) => ({ dev: rdev(adPl, x), w: String(stW(adPl, x)), itemS: 'flex:none;width:' + stW(adPl, x) + 'px', kind: x.kind, title: x.title, text: x.text, bg: x.bg, img: x.img, ledSize: x.ledSize, ledAlign: x.ledAlign, ledCol: x.ledCol, ledBg: x.ledBg })), adChanges: ad.changes.map((c) => ({ k: CHG[c[0]][0], sym: CHG[c[0]][1], text: c[1] })),
      adCanAct, apvNote: s.apvNote, setApvNote: (e) => set({ apvNote: e.target.value }), adDone: ad.state !== 'pending',
      apvApprove: () => decide('approved', (ACC.f ? 'Schválila ' : 'Schválil ') + ACC.name + ' · teraz. Playlist sa nahráva na ' + nPlaces(adPl.where.length || 1) + '.', 'Schválené a zverejnené: ' + ad.name),
      apvReturn: () => decide('returned', (ACC.f ? 'Vrátila na úpravu ' : 'Vrátil na úpravu ') + ACC.name + ' · teraz.', 'Vrátené autorovi na úpravu: ' + ad.name),
      apvReject: () => decide('rejected', (ACC.f ? 'Zamietla ' : 'Zamietol ') + ACC.name + ' · teraz.', 'Zamietnuté: ' + ad.name),
      adOwn: isOwn(ad) && ad.state === 'pending', apvWithdraw: () => { set(Object.assign({ apvs: s.apvs.filter((a) => a.id !== ad.id), pls: s.pls.map((p) => p.id === ad.plId ? Object.assign({}, p, { flow: 'draft' }) : p) }, backState())); say('Vzaté späť. Playlist môžete znova upravovať.'); },
      // galéria
      galChips, galRows, galEmpty: galRows.length === 0, openUpload: () => set({ sheet: 'add', addMode: 'gallery' }),
      gd, gdUsed: galFile.used > 0, gdDelete, gdDelT: s.confirm === 'gd' ? 'Potvrdiť zmazanie' : 'Zmazať súbor', gdCanUse: galFile.type !== 'aud', gdAddToPl: () => set({ sheet: 'gpl', gplFile: galFile.id }),
      lsTitle: isAcc ? 'Prepnúť účet' : isLang ? 'Jazyk aplikácie' : isNewPl ? 'Nový playlist – pre aké zariadenie' : 'Pridať do playlistu', lsSub: isAcc ? 'Prototyp: aplikácia sa zobrazí tak, ako ju vidí vybraný účet.' : isLang ? 'Zmení sa jazyk tlačidiel, nadpisov a hlásení. Obsah playlistov a názvy miest ostávajú tak, ako ste ich napísali.' : isNewPl ? 'Playlist sa potom dá upravovať a prehrávať len na tomto type zariadenia.' : 'Súbor „' + galFile.name + '“ sa pridá ako nová snímka na koniec playlistu. Ponúkajú sa len playlisty pre displeje.', lsRows,
      // viac / miesta / nastavenia / AI
      moreRows, logout: () => say('Prototyp: odhlásenie nie je zapojené.'), pq: s.pq, setPq: (e) => set({ pq: e.target.value }), pcChips, pcRows, pcEmpty: pcRows.length === 0, pcFootT: 'Zobrazených ' + pcRows.length + ' z ' + vPlaces.length + ' miest',
      notifRows, aiRows,
      aiHi: ACC.first ? 'Dobrý deň, ' + ACC.first + '. S čím vám pomôžem?' : 'Dobrý deň. S čím vám pomôžem?', aiMsgs, aiChips, aiTyping: s.aiTyping, aiQ: s.aiQ, aiNoQ: !s.aiQ.trim() || s.aiTyping, setAiQ: (e) => set({ aiQ: e.target.value }), aiSend: () => aiAsk(s.aiQ, false), aiKey: (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); aiAsk(s.aiQ, false); } },
      // náhľad
      pvHas: pvParts.length > 0, pvNone: pvParts.length === 0, pvParts, pvWrapS: stackS(pvPl), pvDevT: DEV[pvDev][0], pvSegs: pvTot ? [] : pvSegs,
      pvCap: pvTot ? 'Tri displeje sa prehrávajú súčasne' : pvPl.slides.length ? (Math.min(s.pvI, pvPl.slides.length - 1) + 1) + '/' + pvPl.slides.length + ' · ' + pvObj.title : '', pvTime: pvTot ? mmss(s.pvE || 0) : pvPl.slides.length ? s.pvT + ' / ' + pvObj.dur + ' s' : '',
      pvPrev: () => pvStep(-1), pvNext: () => pvStep(1), pvToggle: () => set({ pvPlay: !s.pvPlay }), pvPlayLbl: s.pvPlay ? 'Pozastaviť' : 'Prehrať', pvPlayD: s.pvPlay ? IC.pause : IC.play,
      // rýchla správa
      qMain: s.qStep !== 'places', qPlaces: s.qStep === 'places', qText: Q.text, setQText: (e) => setQ({ text: e.target.value }), qHasText: !!Q.text, qClear: () => setQ({ text: '' }), qTpls, qTplMore: qTplRest > 0, qTplMoreT: s.qTplAll ? 'Menej' : 'Viac (' + qTplRest + ')', qTplAllA: s.qTplAll ? 'true' : 'false', qTplToggle: () => set({ qTplAll: !s.qTplAll }), qPrios, qPoss, qDurs,
      qTgtT: Q.all ? 'Všetky miesta (' + devIds.length + ')' : qN ? tgtLabel(Q) : 'Nie je vybrané žiadne miesto', qTgtSub: Q.all ? 'Každé miesto, ktoré má zariadenie' : qN ? shortList(names(Q.ids)) : 'Vyberte aspoň jedno miesto',
      qOpenPlaces: () => set({ qStep: 'places', qSearch: '', qOrd: snapOrd(qSel) }), qClosePlaces: () => set({ qStep: 'main', qSearch: '' }), qSearch: s.qSearch, setQSearch: (e) => set({ qSearch: e.target.value }), qGrps,
      qShowAll: !qsl, qAllOn: Q.all, qToggleAll: () => set({ quick: Object.assign({}, Q, Q.all ? { all: false, ids: [] } : { all: true, ids: [] }), qOrd: null }), qAllT: 'Všetky miesta (' + devIds.length + ')', qPcs, qPcEmpty: qPcs.length === 0,
      qPcOff: qN === 0, qPcBtn: qN ? 'Hotovo · ' + nPlaces(qN) : 'Vyberte aspoň jedno miesto', qOff: !Q.text.trim() || !qN, qSend, qSendT: !Q.text.trim() ? 'Napíšte text správy' : qN ? 'Odoslať na ' + nPlaces(qN) : 'Vyberte miesto',
      // prepnutie playlistu
      swCanBack: W.step === 'dur' || (W.step === 'pc' && W.from === 'pl'), swBack: () => setW({ step: W.step === 'dur' ? 'pc' : 'pl' }), swGrps, swTitle, swSub, swSub2, swIsPl: W.step === 'pl', swPls: swPlsRows, swIsPc: W.step === 'pc', swPcs, swIsDur: W.step === 'dur', swPlName: swPlObj ? swPlObj.name : '', swPlaces, swDurs,
      swOff: (W.step === 'pc' && W.places.length === 0) || !swPlObj, swNext, swBtn,
      addTitle: gmode ? 'Nahrať do galérie' : 'Pridať fotku', addOpts, pickFromAdd: s.pickMode === 'add', pickBack: () => set({ sheet: 'add' }), pickRows
    };
  }
}
