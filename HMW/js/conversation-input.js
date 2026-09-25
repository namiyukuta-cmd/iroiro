(() => {
  'use strict';
  const H = window.HMW;
  const G = H.Game;
  const targets = {
    supportPersonTalk: 'support_named', homelessTalk: 'homeless_named',
    policeTalk: 'police_named', thugTalk: 'thug_named', clerkTalk: 'clerk'
  };
  for (const [method, characterId] of Object.entries(targets)) {
    const original = G[method];
    if (typeof original !== 'function') continue;
    G[method] = function (...args) {
      original.apply(this, args);
      const body = document.getElementById('modal-body');
      if (!body || !document.getElementById('modal-backdrop').classList.contains('open')) return;
      body.querySelector('.conversation-input')?.remove();
      const form = document.createElement('form');
      form.className = 'conversation-input';
      const label = document.createElement('label');
      label.htmlFor = 'conversation-text';
      label.textContent = '話したいことを入力';
      const input = document.createElement('textarea');
      input.id = 'conversation-text';
      input.rows = 3;
      input.maxLength = 4000;
      input.placeholder = 'ここに会話を入力してください';
      input.style.cssText = 'display:block;width:100%;box-sizing:border-box;font-size:16px;min-height:72px;resize:none;margin:6px 0';
      const pending = H.state.pendingDialogue;
      if (pending?.characterId === characterId) input.value = pending.rawText;
      const status = document.createElement('p');
      status.setAttribute('role', 'status');
      status.style.cssText = 'font-size:12px;margin:6px 0';
      status.textContent = '自由文の自動分析は未接続です。入力した発言は原文のまま記録できます。';
      const submit = document.createElement('button');
      submit.type = 'submit';
      submit.className = 'modal-btn';
      submit.textContent = '発言を記録';
      const copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'modal-btn';
      copy.textContent = '分析依頼をコピー';
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (!input.value.trim()) { status.textContent = '会話を入力してください。'; return; }
        const rawText = input.value;
        const previous = H.state.pendingDialogue;
        if (previous?.characterId === characterId && previous.rawText === rawText && previous.status === 'awaiting_analysis') {
          status.textContent = 'この発言は記録済みです。返答には分析JSONが必要です。'; return;
        }
        H.state.pendingDialogue = { characterId, rawText, day: H.state.day, slot: H.state.slot, location: H.state.location, status: 'awaiting_analysis' };
        H.addHistory(`発言（${H.DATA.people[characterId]?.name || characterId}へ／返答待ち）：${rawText}`);
        status.textContent = '発言を記録しました。返答には分析JSONが必要です。保存はセーブボタンから行えます。';
      });
      copy.addEventListener('click', async () => {
        if (!input.value.trim()) { status.textContent = '会話を入力してください。'; return; }
        const request = `HMWの会話分析をしてください。相手ID：${characterId}。以下は主人公の発言です。原文をrawTextに保持し、analysisVersion、intents、emotions、focusConcepts、boundaries、claims、questionsを持つ分析JSONを返してください。原文にない主人公の心理・行動やNPCの返答・事実を作らないでください。\n発言：${input.value}`;
        try { await navigator.clipboard.writeText(request); status.textContent = '分析依頼をコピーしました。'; }
        catch { status.textContent = 'コピーできませんでした。入力欄の文章を選択してコピーしてください。'; input.focus(); input.select(); }
      });
      form.append(label, input, submit, copy, status);
      body.prepend(form);
    };
  }
})();
