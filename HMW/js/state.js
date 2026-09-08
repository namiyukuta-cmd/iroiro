(() => {
  "use strict";

  window.HMW = window.HMW || {};

  const createInitialState = () => ({
    meta: {
      gameId: "HMW",
      stateVersion: 1,
      saveId: null,
      createdAt: null,
      updatedAt: null
    },

    world: {
      day: 1,
      time: "morning",
      weather: null,
      locationId: null
    },

    player: {
      name: "",
      age: null,
      money: 0,

      condition: {
        health: null,
        hunger: null,
        hygiene: null,
        warmth: null,
        wetness: null,
        fatigue: null
      },

      sleepingPlaceId: null,
      inventory: []
    },

    relationships: {},

    events: {
      active: [],
      completed: []
    },

    history: []
  });

  const clone = (value) => JSON.parse(JSON.stringify(value));

  window.HMW.createInitialState = createInitialState;
  window.HMW.state = createInitialState();

  window.HMW.resetState = () => {
    window.HMW.state = createInitialState();
    return window.HMW.state;
  };

  window.HMW.getStateSnapshot = () => clone(window.HMW.state);
})();
