(() => {
  const emptyState = () => ({
    hasCompanion: false,
    stage: null,
    name: '',
    adoptedAt: null,
    ageMinutes: 0,
    remainingGrowthMinutes: 0,
    fedCount: 0,
    diet: null,
    canineEncounterRisk: 'normal',
    howlCanEscape: false
  });

  window.DDWolf = {
    stateKey: 'ad_no_wolf',
    pupId: '',
    adultId: '',
    growthMinutes: 0,
    meatIds: [],
    adopt: () => false,
    hasCompanion: () => false,
    stage: () => null,
    name: () => '',
    ageMinutes: () => 0,
    remainingGrowthMinutes: () => 0,
    availableMeat: () => [],
    feed: () => ({ ok: false, message: '' }),
    randomBehavior: () => null,
    getEncounterRisk: (_enemyId, baseWeight = 1) => Math.max(0, Number(baseWeight) || 0),
    combatHowl: () => ({ canEscape: false, text: '' }),
    updateAge: () => false,
    getState: emptyState,
    reset: () => {}
  };
})();