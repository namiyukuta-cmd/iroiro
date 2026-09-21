(() => {
  const actionGrid = document.getElementById('actionGrid');
  const partyPanel = document.getElementById('partyPanel');
  const partyNote = document.getElementById('partyNote');
  if (!actionGrid || !partyPanel) return;

  const SKILL_LIMIT = 7;
  let arranging = false;

  const style = document.createElement('style');
  style.id = 'ddQuickUiFourSlotStyle';
  style.textContent = `
    #actionGrid{display:block!important}
    .quickUiLabel{height:11px;display:flex;align-items:center;font-size:9px;font-weight:1000;color:#66615a;letter-spacing:.02em}
    .quickUiLabel.skillLabel{margin-top:1px}
    .quickSlotRow{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}
    .skillSlotRow{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}
    .quickSlotRow .actionTile{height:42px}
    .quickSlotRow .actionIcon{font-size:20px}
    .quickSlotRow .slotType{font-size:7px;line-height:1;font-weight:1000;color:#77736c;margin-bottom:1px}
    .quickSlotRow .actionCount{font-size:8px}
    .skillSlotRow .actionTile{height:38px}
    #partyPanel.wolfMode .skillSlotRow{margin-top:1px}
    #ownedInventory{margin-top:5px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:3px;align-content:start}
    #ownedInventory:empty{display:none}
    .ownedItem{position:relative;min-width:0;height:43px;border:1px solid #bdb8ae;border-radius:7px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2px 1px;overflow:hidden}
    .ownedItemIcon{font-size:18px;line-height:1}
    .ownedItemName{max-width:100%;margin-top:2px;font-size:7px;font-weight:900;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .ownedItemCount{position:absolute;right:2px;top:2px;min-width:16px;height:14px;padding:0 3px;border-radius:999px;background:#24231f;color:#fff;font-size:7px;font-weight:1000;display:grid;place-items:center}
    @media (max-width:370px){
      #ownedInventory{grid-template-columns:repeat(6,minmax(0,1fr));gap:2px}
      .ownedItem{height:38px}
      .ownedItemIcon{font-size:16px}
      .ownedItemName{font-size:6px}
    }
    @media (max-width:370px){
      .quickSlotRow{gap:3px}
      .skillSlotRow{gap:2px}
      .quickSlotRow .actionTile{height:40px}
      .skillSlotRow .actionTile{height:36px}
    }
  `;
  document.head.appendChild(style);

  function makeLabel(text, className) {
    const label = document.createElement('div');
    label.className = `quickUiLabel ${className}`;
    label.textContent = text;
    return label;
  }

  function makeRow(className) {
    const row = document.createElement('div');
    row.className = className;
    return row;
  }

  function addSlotType(tile, text) {
    tile.querySelector('.slotType')?.remove();
    const type = document.createElement('span');
    type.className = 'slotType';
    type.textContent = text;
    tile.prepend(type);
    return tile;
  }

  function makeEmptySlot(kind, label) {
    const slot = document.createElement('div');
    slot.className = `actionTile emptyActionSlot ${kind}`;
    slot.setAttribute('aria-hidden', 'true');
    addSlotType(slot, label);
    const icon = document.createElement('span');
    icon.className = 'actionIcon';
    icon.textContent = '·';
    slot.appendChild(icon);
    return slot;
  }

  function arrowCount() {
    return (window.DDItems?.getInventory?.() || [])
      .filter(entry => entry?.item?.kind === 'arrow')
      .reduce((sum, entry) => sum + Math.max(0, Number(entry.count || 0)), 0);
  }

  function makeBowTile() {
    const bow = window.DDHuntConfig?.equipment?.bow;
    if (!bow) return makeEmptySlot('quickSlot', '武器');
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'actionTile quickSlot quickUiSynthetic equipmentTile';
    tile.dataset.action = 'equipment:bow';
    tile.disabled = true;
    addSlotType(tile, '武器');
    const icon = document.createElement('span');
    icon.className = 'actionIcon';
    icon.textContent = '🏹';
    const label = document.createElement('span');
    label.textContent = bow.name || '弓';
    const count = document.createElement('span');
    count.className = 'actionCount';
    count.textContent = `矢×${arrowCount()}`;
    tile.append(icon, label, count);
    return tile;
  }

  function actionId(tile) { return tile?.dataset?.action || ''; }
  function isWolfTile(id) { return id.startsWith('wolf:') || ['bite','claw','growl','guard'].includes(id); }
  function isHeroSkill(id) { return id.startsWith('hero:') || id === 'wait'; }
  function isSupportedTool(id) { return id.includes('pebble'); }
  function ownedFallbackIcon(item) {
    if (!item) return '□';
    if (item.kind === 'companion') return '🐺';
    if (item.id === 'nuts') return '🌰';
    if (item.id === 'mushroom') return '🍄';
    if (item.foodGroup === '魚') return '🐟';
    if (item.category === 'food') return '🍖';
    if (item.kind === 'arrow') return '➶';
    if (item.kind === 'bow' || item.id === 'bow') return '🏹';
    return '◆';
  }

  function renderOwnedInventory() {
    const box = document.getElementById('ownedInventory');
    if (!box) return;
    const entries = window.DDItems?.getInventory?.() || [];
    box.innerHTML = '';
    entries.forEach(({item,count}) => {
      const cell = document.createElement('div');
      cell.className = 'ownedItem';
      cell.title = item?.name || 'アイテム';

      if (item?.image) {
        const img = document.createElement('img');
        img.className = 'ownedItemIcon';
        img.src = item.image;
        img.alt = item.name || '';
        img.style.width = '22px';
        img.style.height = '22px';
        img.style.objectFit = 'contain';
        img.onerror = () => {
          img.replaceWith(Object.assign(document.createElement('span'), {className:'ownedItemIcon', textContent:ownedFallbackIcon(item)}));
        };
        cell.appendChild(img);
      } else {
        const icon = document.createElement('span');
        icon.className = 'ownedItemIcon';
        icon.textContent = ownedFallbackIcon(item);
        cell.appendChild(icon);
      }

      const name = document.createElement('span');
      name.className = 'ownedItemName';
      name.textContent = item?.name || '不明';
      cell.appendChild(name);

      const badge = document.createElement('span');
      badge.className = 'ownedItemCount';
      badge.textContent = item?.unique ? '1' : String(Number(count || 0));
      cell.appendChild(badge);

      box.appendChild(cell);
    });
  }

  function skillPriority(tile) {
    const id = actionId(tile).replace('hero:', '').replace('wolf:', '');
    const order = { strike:0,bite:0,claw:1,guard:2,growl:3,flee:4,wait:9 };
    return order[id] ?? 5;
  }

  function arrange() {
    if (arranging) return;
    arranging = true;
    observer.disconnect();
    actionGrid.querySelectorAll('.quickUiLabel,.quickUiSynthetic,.emptyActionSlot,.quickSlotRow,.skillSlotRow').forEach(node => {
      if (node.classList.contains('quickSlotRow') || node.classList.contains('skillSlotRow')) {
        [...node.children].forEach(child => {
          if (child.classList.contains('actionTile') && !child.classList.contains('quickUiSynthetic') && !child.classList.contains('emptyActionSlot')) actionGrid.appendChild(child);
        });
      }
      node.remove();
    });
    const tiles = [...actionGrid.querySelectorAll(':scope > .actionTile')];
    const wolfMode = partyPanel.classList.contains('wolfMode') || tiles.some(tile => isWolfTile(actionId(tile)));
    actionGrid.classList.toggle('wolfLayout', wolfMode);
    const skills=[], toolCandidates=[];
    tiles.forEach(tile => {
      tile.hidden=false;
      tile.classList.remove('quickSlot','skillSlot');
      const id=actionId(tile);
      if (wolfMode || isWolfTile(id) || isHeroSkill(id)) { tile.classList.add('skillSlot'); skills.push(tile); }
      else if (isSupportedTool(id)) { tile.classList.add('quickSlot'); toolCandidates.push(tile); }
    });
    skills.sort((a,b)=>skillPriority(a)-skillPriority(b));
    const visibleSkills=skills.slice(0,SKILL_LIMIT), visibleTools=toolCandidates.slice(0,2);
    actionGrid.innerHTML='';
    if(!wolfMode){
      actionGrid.appendChild(makeLabel('装備・すぐ使う','quickLabel'));
      const quickRow=makeRow('quickSlotRow');
      quickRow.appendChild(makeBowTile());
      quickRow.appendChild(makeEmptySlot('quickSlot','防具'));
      const tool1=visibleTools[0]; if(tool1){addSlotType(tool1,'道具1');quickRow.appendChild(tool1)}else quickRow.appendChild(makeEmptySlot('quickSlot','道具1'));
      const tool2=visibleTools[1]; if(tool2){addSlotType(tool2,'道具2');quickRow.appendChild(tool2)}else quickRow.appendChild(makeEmptySlot('quickSlot','道具2'));
      actionGrid.appendChild(quickRow);
    }
    actionGrid.appendChild(makeLabel(wolfMode?'能力':'行動・スキル','skillLabel'));
    const skillRow=makeRow('skillSlotRow');
    visibleSkills.forEach(tile=>skillRow.appendChild(tile));
    for(let i=visibleSkills.length;i<SKILL_LIMIT;i++)skillRow.appendChild(makeEmptySlot('skillSlot',''));
    actionGrid.appendChild(skillRow);
    if(partyNote) partyNote.textContent=wolfMode?'狼（？）の能力。戦闘中は使える能力だけ明るく表示する。':'武器1・防具1・道具2。下段は行動・スキル。';
    renderOwnedInventory();
    observer.observe(actionGrid,{childList:true,subtree:true});
    arranging=false;
  }

  const observer=new MutationObserver(()=>queueMicrotask(arrange));
  observer.observe(actionGrid,{childList:true,subtree:true});
  window.addEventListener('ddinventorychange',()=>queueMicrotask(arrange));
  window.addEventListener('ddwolfchange',()=>queueMicrotask(arrange));
  queueMicrotask(arrange);
})();
