(() => {
  const hungerText = document.getElementById('hungerText');
  const hungerFill = document.getElementById('hungerFill');
  const message = document.getElementById('message');
  const morningButton = document.getElementById('untilMorning');
  const sleepButtons = [...document.querySelectorAll('[data-minutes]')];

  function refreshHunger() {
    const state = window.DDNeeds?.getState?.() || { playerHunger: 0, maxHunger: 100 };
    hungerText.textContent = `空腹 ${state.playerHunger} / ${state.maxHunger}`;
    hungerFill.style.width = `${Math.max(0, Math.min(100, state.playerHunger))}%`;
  }

  function sleep(minutes, label) {
    const value = Math.max(1, Math.floor(Number(minutes) || 0));
    if (window.DDTime) DDTime.advance(value, 'sleep');
    window.DDNeeds?.syncTime?.('sleep');
    refreshHunger();
    message.textContent = `${label}。${value}分経過した。`;
  }

  function minutesUntilSeven() {
    const state = window.DDTime?.getState?.() || { minuteOfDay: 7 * 60 };
    const target = 7 * 60;
    const now = Number(state.minuteOfDay || 0);
    if (now < target) return target - now;
    return 1440 - now + target;
  }

  sleepButtons.forEach(button => {
    button.addEventListener('click', () => {
      const minutes = Number(button.dataset.minutes || 0);
      sleep(minutes, button.textContent.replace('寝る', '寝た'));
    });
  });

  morningButton.addEventListener('click', () => {
    const minutes = minutesUntilSeven();
    sleep(minutes, '朝7時まで寝た');
  });

  window.addEventListener('ddneedschange', refreshHunger);
  refreshHunger();
})();