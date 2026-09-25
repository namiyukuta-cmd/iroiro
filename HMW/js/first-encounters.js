(() => {
  'use strict';
  const H = window.HMW, G = H.Game;
  const encounters = [
    { id: 'support_named', scene: 'charity_support_first',
      present: (place, slot) => place === 'charity_center' && slot !== 3,
      narration: '受付の男性が顔を上げ、穏やかに声をかける。',
      english: "Hello. I'm Aaron. How can I help you today?",
      japanese: '「初めまして。アーロンです。今日はどのようなご用件ですか？」' },
    { id: 'homeless_named', scene: 'park_homeless_first',
      present: (place, slot) => place === 'underpass' || (place === 'park' && slot >= 2),
      narration: '荷物のそばにいた男性が、少し間を置いて声をかける。',
      english: "Haven't seen you around before. I'm Sam. Looking for somewhere to rest?",
      japanese: '「この辺じゃ見かけない顔だな。俺はサム。休める場所を探してるのか？」' },
    { id: 'police_named', scene: 'station_police_first',
      present: (place, slot) => place === 'police_station' || (place === 'station_front' && slot >= 1),
      narration: '制服の警官が、距離を取ったまま声をかける。',
      english: "Hello. I'm Mark. Is there something you need help with?",
      japanese: '「こんにちは。マークです。何かお困りですか？」' },
    { id: 'thug_named', scene: 'industrial_thug_first',
      present: (place, slot) => ['industrial_street', 'underpass'].includes(place) && slot >= 2,
      narration: '黒いジャケットの男性が視線を向ける。',
      english: "New around here? I'm Leon. What brings you here?",
      japanese: '「この辺は初めてか？ 俺はレオン。何しに来た？」' }
  ];
  function records() { return H.state.firstEncounters ||= {}; }
  function known(id) {
    const r = H.state.relationships?.[id] || {};
    return r.met === true || Number(r.lastContactDay) > 0 || Number(r.familiarity) > 0;
  }
  G.tryFirstEncounter = function () {
    if (H.state.activeEvent) return false;
    const encounter = encounters.find(e => e.present(H.state.location, H.state.slot) && !records()[e.id]?.introduced && !known(e.id));
    if (!encounter) return false;
    const r = H.state.relationships[encounter.id];
    records()[encounter.id] = { introduced: true, replied: false, day: H.state.day, location: H.state.location };
    r.met = true;
    H.state.story.seen[encounter.scene] = true;
    const esc = G.escapeHtml;
    G.openModal(H.DATA.people[encounter.id].name,
      `<p>${esc(encounter.narration)}</p><p lang="en">${esc(encounter.english)}</p><p>${esc(encounter.japanese)}</p>`, [], true);
    G.attachConversationInput(encounter.id);
    H.addHistory(`${H.DATA.people[encounter.id].name}と初対面。${encounter.japanese}`);
    return true;
  };
  G.completeFirstEncounter = function (id) {
    const encounter = records()[id];
    if (!encounter?.introduced || encounter.replied) return '';
    encounter.replied = true;
    if (id !== 'support_named' || encounter.giftGiven) return '';
    encounter.giftGiven = true;
    if (!(H.state.inventory.aaron_name_tag > 0)) H.addItem('aaron_name_tag', 1);
    H.addHistory('アーロンから名札を受け取った。');
    return 'アーロンから「名札」を受け取りました。';
  };
})();
