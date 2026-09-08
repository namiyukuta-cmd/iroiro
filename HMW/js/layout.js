(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const DEFAULT_CONDITION = {
    health: 80,
    hunger: 35,
    hygiene: 40,
    warmth: 50,
    wetness: 0,
    fatigue: 25
  };

  const WEATHER_ICONS = {
    clear: "☀️",
    cloudy: "☁️",
    rain: "🌧️",
    heavyRain: "🌧️",
    cold: "❄️"
  };

  const isNumber = (value) => typeof value === "number" && Number.isFinite(value);

  const ensureCondition = () => {
    HMW.state.player = HMW.state.player || {};
    HMW.state.player.condition = HMW.state.player.condition || {};

    Object.entries(DEFAULT_CONDITION).forEach(([key, value]) => {
      if (!isNumber(HMW.state.player.condition[key])) {
        HMW.state.player.condition[key] = value;
      }
    });
  };

  const setText = (id, value) => {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value);
  };

  const renderWeatherIcon = () => {
    const weatherId = HMW.state?.world?.weather;
    setText("weatherValue", WEATHER_ICONS[weatherId] || "―");
  };

  const renderConditionPanel = () => {
    if (!HMW.state?.player) return;

    ensureCondition();
    const condition = HMW.state.player.condition;

    setText("healthValue", condition.health);
    setText("hungerValue", condition.hunger);
    setText("hygieneValue", condition.hygiene);
    setText("warmthValue", condition.warmth);
    setText("wetnessValue", condition.wetness);
    setText("fatigueValue", condition.fatigue);
    renderWeatherIcon();

    const sleepingPlaceId = HMW.state.player.sleepingPlaceId;
    const sleepingPlace = sleepingPlaceId
      ? HMW.getLocation?.(sleepingPlaceId)?.name || sleepingPlaceId
      : "未定";

    setText("sleepingPlaceValue", sleepingPlace);
  };

  const hideDuplicateStatusEntry = () => {
    const content = document.getElementById("modalContent");
    if (!content) return;

    [...content.querySelectorAll("button")].forEach((button) => {
      if (button.textContent.trim() === "状態") {
        button.hidden = true;
      }
    });
  };

  const installRefreshHooks = () => {
    const watchedIds = [
      "dayValue",
      "timeValue",
      "moneyValue",
      "locationName"
    ];

    const targets = watchedIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (targets.length) {
      const observer = new MutationObserver(() => renderConditionPanel());
      targets.forEach((target) => observer.observe(target, {
        childList: true,
        characterData: true,
        subtree: true
      }));
    }

    document.addEventListener("click", () => {
      setTimeout(() => {
        renderConditionPanel();
        hideDuplicateStatusEntry();
      }, 0);
    });
  };

  HMW.renderConditionPanel = renderConditionPanel;
  HMW.renderWeatherIcon = renderWeatherIcon;

  document.addEventListener("DOMContentLoaded", () => {
    renderConditionPanel();
    installRefreshHooks();
  });
})();
