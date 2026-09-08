(() => {
  "use strict";

  window.HMW = window.HMW || {};

  const createInitialState = () => ({
    meta: {
      gameId: "HMW",
      stateVersion: 5,
      saveId: null,
      createdAt: null,
      updatedAt: null
    },

    world: {
      day: 1,
      time: "morning",
      weather: "clear",
      locationId: null
    },

    player: {
      name: "",
      age: null,
      money: 0,

      condition: {
        health: 80,
        hunger: 35,
        hygiene: 40,
        warmth: 50,
        wetness: 0,
        fatigue: 25
      },

      workAccess: {
        identityDocument: false,
        phone: false,
        bankAccount: false,
        contactAddress: false
      },

      survival: {
        movementCount: 0,
        movesThisSlot: 0,
        lastProcessedDay: 1
      },

      employment: {
        currentJobId: null,
        workHistory: [],
        search: {
          day: 1,
          slotKey: "1:morning",
          attemptsToday: 0,
          attemptsThisSlot: 0,
          discoveredJobIds: [],
          applications: [],
          accepted: []
        }
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
