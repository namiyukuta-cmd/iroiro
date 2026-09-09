(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const getHardBlockReason = () => {
    const player = HMW.state?.player;
    const c = player?.condition || {};
    if (!player) return "状態を読み込めない。";
    if (player.lifeStatus === "dead") return "死亡している。";
    if (player.lifeStatus === "collapsed") return "倒れていて移動できない。";
    if ((c.health ?? 100) <= 10) return "体力が落ちすぎていて歩けない。";
    if ((c.hunger ?? 0) >= 100) return "空腹が限界で歩けない。";
    if ((c.fatigue ?? 0) >= 100) return "疲労が限界で歩けない。";
    if ((c.warmth ?? 100) <= 0) return "身体が冷え切っていて歩けない。";
    return null;
  };

  const isForcedMove = () => {
    const gate = HMW.state?.player?.progression?.eventGate;
    return Boolean(
      gate?.forcedMoveFrom &&
      gate.forcedMoveFrom === HMW.state?.world?.locationId
    );
  };

  const normalMoveBlocked = () => !isForcedMove() && Boolean(getHardBlockReason());

  const showBlocked = () => {
    const reason = getHardBlockReason() || "今は移動できない。";
    const layer = document.getElementById("modalLayer");
    const title = document.getElementById("modalTitle");
    const content = document.getElementById("modalContent");
    if (!layer || !title || !content) return;

    title.textContent = "移動できない";
    content.replaceChildren();
    const p = document.createElement("p");
    p.textContent = reason;
    p.style.margin = "0";
    p.style.lineHeight = "1.65";
    content.append(p);
    layer.hidden = false;
  };

  const enforce = () => {
    const reason = getHardBlockReason();
    const forced = isForcedMove();
    const hardBlocked = Boolean(reason) && !forced;

    const moveButton = document.querySelector('[data-flow-slot="3"]');
    if (moveButton) {
      if (hardBlocked) {
        if (moveButton.textContent !== "移動できない") moveButton.textContent = "移動できない";
        if (!moveButton.disabled) moveButton.disabled = true;
        moveButton.onclick = null;
        moveButton.dataset.hmwHardMoveBlocked = "true";
      } else if (moveButton.dataset.hmwHardMoveBlocked === "true") {
        delete moveButton.dataset.hmwHardMoveBlocked;
        // 通常時の再設定は flow-ui 側に任せる。
        setTimeout(() => HMW.flowUI?.render?.(), 0);
      }
    }

    const mapButton = document.getElementById("mapButton");
    if (mapButton) {
      if (hardBlocked) {
        mapButton.disabled = true;
        mapButton.dataset.hmwHardMoveBlocked = "true";
      } else if (mapButton.dataset.hmwHardMoveBlocked === "true") {
        delete mapButton.dataset.hmwHardMoveBlocked;
        if (mapButton.dataset.eventGateDisabled !== "true") mapButton.disabled = false;
      }
    }

    const title = document.getElementById("modalTitle");
    const content = document.getElementById("modalContent");
    const layer = document.getElementById("modalLayer");
    if (hardBlocked && layer && !layer.hidden && title?.textContent === "移動" && content) {
      title.textContent = "移動できない";
      content.replaceChildren();
      const p = document.createElement("p");
      p.textContent = reason;
      p.style.margin = "0";
      p.style.lineHeight = "1.65";
      content.append(p);
    }
  };

  const wrapMoveFunction = (holder, key) => {
    if (!holder || typeof holder[key] !== "function") return;
    const original = holder[key];
    if (original.__hmwMovementGuardWrapped) return;

    const guarded = function (...args) {
      if (normalMoveBlocked()) {
        showBlocked();
        enforce();
        return false;
      }
      return original.apply(this, args);
    };
    guarded.__hmwMovementGuardWrapped = true;
    holder[key] = guarded;
  };

  const installWrappers = () => {
    wrapMoveFunction(HMW.lifeLoop, "moveTo");
    wrapMoveFunction(HMW.flowUI, "moveTo");
    wrapMoveFunction(HMW.app, "moveTo");
    wrapMoveFunction(HMW.flowUI, "openMove");
  };

  document.addEventListener("click", (event) => {
    const closeTarget = event.target.closest?.("#modalCloseButton, [data-close-modal]");
    if (closeTarget) {
      setTimeout(() => {
        installWrappers();
        enforce();
      }, 0);
      return;
    }

    if (!normalMoveBlocked()) return;

    const flowMove = event.target.closest?.('[data-flow-slot="3"]');
    const mapMove = event.target.closest?.("#mapButton, .hmw-map-node");
    const modalMove = event.target.closest?.("#modalContent .action-button");
    const modalTitle = document.getElementById("modalTitle")?.textContent?.trim();

    if (!flowMove && !mapMove && !(modalMove && modalTitle === "移動")) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    showBlocked();
    enforce();
  }, true);

  document.addEventListener("click", () => {
    setTimeout(() => {
      installWrappers();
      enforce();
    }, 1);
  });

  document.addEventListener("DOMContentLoaded", () => {
    installWrappers();
    enforce();

    const actionArea = document.getElementById("actionArea");
    const modalLayer = document.getElementById("modalLayer");
    const observer = new MutationObserver(() => {
      queueMicrotask(() => {
        installWrappers();
        enforce();
      });
    });
    if (actionArea) observer.observe(actionArea, { subtree: true, childList: true, attributes: true });
    if (modalLayer) observer.observe(modalLayer, { subtree: true, childList: true, attributes: true });
  });

  HMW.movementGuard = {
    enforce,
    getHardBlockReason,
    normalMoveBlocked
  };
})();
