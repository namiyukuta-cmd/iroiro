/* Pointer and drop behavior adapted from WorthlessDrifter-rpg/js/inventory.js. */
window.RoomInventory = (() => {
  let blockedUntil = 0;
  function attach(api) {
    let drag = null;
    const areas = () => [api.room, api.storage].filter(el => el && !el.hidden && el.getClientRects().length);
    function metrics(el) {
      const r = el.getBoundingClientRect(), border = el.clientLeft;
      const target = el === api.room ? 'room' : api.currentTarget();
      const size = api.spec(target);
      return { target, size, left: r.left + border, top: r.top + border, cw: (r.width-border*2) / size.cols, ch: (r.height-border*2) / size.rows };
    }
    // Snap at the pointer center; the shown footprint is the exact drop position.
    function bestDrop(el, x, y) {
      const m = metrics(el), item = drag.tool ? null : api.getItem(drag.id);
      const dim = item ? api.dimensions(item) : (() => { return api.toolDimensions(drag.tool); })();
      const maxX = m.size.cols - dim.w, maxY = m.size.rows - dim.h;
      if (maxX < 0 || maxY < 0) return null;
      const xx = Math.max(0, Math.min(maxX, Math.round((x - m.left) / m.cw - dim.w / 2)));
      const yy = Math.max(0, Math.min(maxY, Math.round((y - m.top) / m.ch - dim.h / 2)));
      const fits = (a, b) => drag.tool ? api.toolFits(drag.tool,m.target,a,b) : api.fits(drag.id, m.target, a, b);
      if (fits(xx, yy)) return { target: m.target, x: xx, y: yy };
      return null;
    }
    function targetAt(x, y) {
      const el = document.elementFromPoint(x, y);
      if (!api.loose.closest('[hidden]') && el?.closest('#loose')) return api.loose;
      const direct=el?.closest('#storageGrid,#grid');
      if(direct && areas().includes(direct))return direct;
      return areas().find(g => {
        const r = g.getBoundingClientRect();
        return x >= r.left - 12 && x <= r.right + 12 && y >= r.top - 12 && y <= r.bottom + 12;
      });
    }
    function clearMarks() { document.querySelectorAll('.drop-over,.drop-invalid').forEach(e => e.classList.remove('drop-over','drop-invalid')); }
    function preview(target,x,y) {
      document.querySelector('.placement-preview')?.remove();
      if(!target||target===api.loose)return;
      const m=metrics(target),dim=drag.tool?api.toolDimensions(drag.tool):api.dimensions(api.getItem(drag.id));
      const pos=bestDrop(target,x,y),a=pos?.x??Math.max(0,Math.round((x-m.left)/m.cw-dim.w/2)),b=pos?.y??Math.max(0,Math.round((y-m.top)/m.ch-dim.h/2));
      const box=document.createElement('div');box.className='placement-preview '+(pos?'valid':'invalid');
      box.style.left=a*m.cw+'px';box.style.top=b*m.ch+'px';box.style.width=dim.w*m.cw+'px';box.style.height=dim.h*m.ch+'px';
      box.textContent=pos?'配置可':'配置不可';target.appendChild(box);
    }
    function cancel() {
      if (!drag) return;
      drag.source.classList.remove('drag-source'); drag.ghost?.remove(); drag = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', aborted); clearMarks();document.querySelector('.placement-preview')?.remove();api.markBlocked();
    }
    function down(e) {
      const source = e.target.closest('[data-item],.tool[data-tool]');
      if (!source || e.button > 0 || drag) return;
      drag = { source, id: source.dataset.item, tool: source.dataset.tool, pid: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
      source.setPointerCapture?.(e.pointerId);
      window.addEventListener('pointermove', move, { passive: false });
      window.addEventListener('pointerup', up); window.addEventListener('pointercancel', aborted);
    }
    function move(e) {
      if (!drag || drag.pid !== e.pointerId) return;
      if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 7) {
        drag.moved = true; drag.source.classList.add('drag-source');
        const cell=api.cellSize(),dim=drag.tool?api.toolDimensions(drag.tool):api.dimensions(api.getItem(drag.id));
        api.markBlocked(drag.id||null);drag.ghost = (drag.source.querySelector('.tool-piece')||drag.source).cloneNode(true); drag.ghost.removeAttribute('id');
        drag.ghost.classList.add('inventory-ghost'); drag.ghost.style.width=dim.w*cell.w+'px';drag.ghost.style.height=dim.h*cell.h+'px';
        document.body.appendChild(drag.ghost);
      }
      if (!drag.moved) return;
      e.preventDefault();drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';
      clearMarks(); const target = targetAt(e.clientX,e.clientY);preview(target,e.clientX,e.clientY);
      if (target) target.classList.add(target === api.loose || bestDrop(target,e.clientX,e.clientY) ? 'drop-over' : 'drop-invalid');
    }
    function up(e) {
      if (!drag || drag.pid !== e.pointerId) return;
      const d = drag;
      if (!d.moved) { cancel(); if (d.id) { blockedUntil=Date.now()+400; api.tap(d.id); } return; }
      blockedUntil=Date.now()+400;
      d.source.style.pointerEvents='none';
      const target=targetAt(e.clientX,e.clientY);
      d.source.style.pointerEvents='';
      const pos=target && target!==api.loose ? bestDrop(target,e.clientX,e.clientY) : null;
      cancel();
      if (target===api.loose && d.id) api.move(d.id,'loose');
      else if (pos) d.tool ? api.toolDrop(d.tool,pos.x,pos.y) : api.move(d.id,pos.target,pos.x,pos.y);
      else api.notify(target?'そこには入りません':'移動をキャンセルしました');
    }
    function aborted(e) { if(drag?.pid===e.pointerId){blockedUntil=Date.now()+400;cancel();} }
    api.root.addEventListener('pointerdown',down);
    api.root.addEventListener('click',e=>{if(Date.now()<blockedUntil){e.preventDefault();e.stopPropagation();}},true);
    api.root.addEventListener('keydown',e=>{const item=e.target.closest('[data-item]');if(item && (e.key==='Enter'||e.key===' ')){e.preventDefault();api.tap(item.dataset.item);}if(e.key==='Escape')cancel();});
    return { cancel };
  }
  return { attach, suppressClick:()=>Date.now()<blockedUntil };
})();
