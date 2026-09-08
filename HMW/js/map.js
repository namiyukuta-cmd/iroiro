(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const layout = {
    labor_office:        { x: 18, y: 8 },
    station_front:       { x: 50, y: 14 },
    police_station:      { x: 82, y: 8 },
    convenience_store:   { x: 12, y: 31 },
    shopping_street:     { x: 34, y: 31 },
    public_toilet:       { x: 50, y: 43 },
    park:                 { x: 68, y: 31 },
    residential_alley:   { x: 28, y: 55 },
    charity_center:      { x: 72, y: 55 },
    underpass:            { x: 64, y: 69 },
    riverside:            { x: 48, y: 81 },
    industrial_street:   { x: 25, y: 93 },
    recycling_yard:      { x: 75, y: 93 }
  };

  const edgeKeys = () => {
    const seen = new Set();
    const edges = [];

    Object.entries(HMW.worldData?.locations || {}).forEach(([fromId, location]) => {
      (location.connections || []).forEach((toId) => {
        if (!layout[fromId] || !layout[toId]) return;
        const key = [fromId, toId].sort().join("::");
        if (seen.has(key)) return;
        seen.add(key);
        edges.push([fromId, toId]);
      });
    });

    return edges;
  };

  const addStyles = () => {
    if (document.getElementById("hmwMapStyles")) return;

    const style = document.createElement("style");
    style.id = "hmwMapStyles";
    style.textContent = `
      .hmw-map-wrap {
        position: relative;
        width: 100%;
        height: 620px;
        min-height: 620px;
        overflow: hidden;
        border: 1px solid #c9c2b7;
        border-radius: 14px;
        background: #f1ede5;
      }

      .hmw-map-lines {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .hmw-map-lines line {
        stroke: #aaa196;
        stroke-width: 0.8;
      }

      .hmw-map-node {
        position: absolute;
        transform: translate(-50%, -50%);
        min-width: 86px;
        min-height: 46px;
        padding: 6px 9px;
        border: 1px solid #b9b1a5;
        border-radius: 11px;
        background: #fffdf8;
        font-size: 17px;
        line-height: 1.2;
        text-align: center;
        z-index: 2;
      }

      .hmw-map-node.is-current {
        border: 3px solid #29241f;
        font-weight: 800;
        background: #e7e1d6;
      }

      .hmw-map-node.is-reachable {
        border: 2px solid #55504a;
      }

      .hmw-map-node:disabled {
        opacity: 0.62;
        color: #5f5a54;
      }

      .hmw-map-help {
        margin: 0 0 10px;
        font-size: 17px;
        line-height: 1.55;
      }

      @media (max-width: 420px) {
        .hmw-map-wrap {
          height: 660px;
          min-height: 660px;
        }

        .hmw-map-node {
          min-width: 78px;
          max-width: 108px;
          font-size: 17px;
        }
      }
    `;
    document.head.append(style);
  };

  const moveTo = (locationId) => {
    if (HMW.app?.moveTo) {
      HMW.app.moveTo(locationId);
      return;
    }

    const currentId = HMW.state?.world?.locationId;
    const current = HMW.worldData?.locations?.[currentId];
    if (!current?.connections?.includes(locationId)) return;

    HMW.state.world.locationId = locationId;
    HMW.app?.render?.();
  };

  const openMap = () => {
    const modalLayer = document.getElementById("modalLayer");
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");
    if (!modalLayer || !modalTitle || !modalContent) return;

    const currentId = HMW.state?.world?.locationId || HMW.worldData?.defaultStartLocationId;
    const current = HMW.worldData?.locations?.[currentId];
    const reachable = new Set(current?.connections || []);

    modalTitle.textContent = "マップ";
    modalContent.replaceChildren();

    const help = document.createElement("p");
    help.className = "hmw-map-help";
    help.textContent = "現在地は太枠。今いる場所から直接行ける場所はタップできます。";
    modalContent.append(help);

    const map = document.createElement("div");
    map.className = "hmw-map-wrap";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "hmw-map-lines");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");

    edgeKeys().forEach(([fromId, toId]) => {
      const from = layout[fromId];
      const to = layout[toId];
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", from.x);
      line.setAttribute("y1", from.y);
      line.setAttribute("x2", to.x);
      line.setAttribute("y2", to.y);
      svg.append(line);
    });

    map.append(svg);

    Object.entries(layout).forEach(([locationId, position]) => {
      const location = HMW.worldData?.locations?.[locationId];
      if (!location) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = "hmw-map-node";
      button.textContent = location.name;
      button.style.left = `${position.x}%`;
      button.style.top = `${position.y}%`;

      if (locationId === currentId) {
        button.classList.add("is-current");
        button.disabled = true;
      } else if (reachable.has(locationId)) {
        button.classList.add("is-reachable");
        button.addEventListener("click", () => moveTo(locationId));
      } else {
        button.disabled = true;
      }

      map.append(button);
    });

    modalContent.append(map);
    modalLayer.hidden = false;
  };

  const installMapButton = () => {
    addStyles();

    const button = document.getElementById("mapButton");
    if (!button || button.dataset.mapBound === "true") return;

    button.dataset.mapBound = "true";
    button.addEventListener("click", openMap);
  };

  HMW.openMap = openMap;
  document.addEventListener("DOMContentLoaded", installMapButton);
})();
