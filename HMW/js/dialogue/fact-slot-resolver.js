(() => {
  "use strict";

  window.HMW = window.HMW || {};
  HMW.Dialogue = HMW.Dialogue || {};

  const text = value =>
    value === undefined || value === null ? "" : String(value);

  HMW.Dialogue.resolveFactSlots = function resolveFactSlots({
    analysis = {},
    characterFacts = {}
  } = {}) {
    const questions = Array.isArray(analysis.questions) ? analysis.questions : [];
    const q = questions[0] || {};
    const out = {};

    const set = (meaningId, slots) => {
      out[meaningId] = {
        ...(out[meaningId] || {}),
        ...slots
      };
    };

    if (characterFacts.currentLocation) {
      set("STATE_CURRENT_LOCATION", {
        SUBJECT: "I",
        BE: "am",
        LOCATION: text(characterFacts.currentLocation)
      });
    }

    if (characterFacts.name) {
      set("STATE_IDENTITY_NAME", {
        NAME: text(characterFacts.name)
      });
    }

    const role = characterFacts.jobRole ?? characterFacts.role;
    if (role) {
      set("STATE_IDENTITY_ROLE", {
        ARTICLE: "",
        ROLE: text(role)
      });
      set("STATE_JOB_ROLE", {
        ROLE: text(role)
      });
    }

    if (characterFacts.origin) {
      set("STATE_ORIGIN", { PLACE: text(characterFacts.origin) });
    }

    if (characterFacts.destination) {
      set("STATE_DESTINATION", { PLACE: text(characterFacts.destination) });
    }

    if (characterFacts.workLocation) {
      set("STATE_WORK_LOCATION", { PLACE: text(characterFacts.workLocation) });
    }

    if (characterFacts.relationshipStatus) {
      set("STATE_RELATIONSHIP_STATUS", {
        RELATIONSHIP: text(characterFacts.relationshipStatus)
      });
    }

    if (characterFacts.feelingsTowardHeroine) {
      set("STATE_FEELINGS_TOWARD_HEROINE", {
        FEELINGS: text(characterFacts.feelingsTowardHeroine)
      });
    }

    if (characterFacts.returnTime !== undefined) {
      set("STATE_RETURN_TIME", {
        SUBJECT: "I",
        TIME: text(characterFacts.returnTime)
      });
    }

    if (characterFacts.availableTime !== undefined) {
      set("STATE_AVAILABLE_TIME", {
        SUBJECT: "I",
        BE: "am",
        AVAILABILITY: "available",
        TIME: text(characterFacts.availableTime)
      });
    }

    if (q.kind === "possession" && q.target) {
      const value = characterFacts.possessions?.[q.target];
      if (value === true) {
        set("CONFIRM_POSSESSION", {
          SUBJECT: "I",
          OBJECT: text(q.target)
        });
      } else if (value === false) {
        set("DENY_POSSESSION", {
          SUBJECT: "I",
          OBJECT: text(q.target)
        });
      } else if (typeof value === "number") {
        set("STATE_QUANTITY", {
          SUBJECT: "I",
          QUANTITY: text(value),
          OBJECT: text(q.target)
        });
      }
    }

    if (q.kind === "capability" && (q.action || q.target)) {
      const action = q.action || q.target;
      set("CONFIRM_CAPABILITY", {
        SUBJECT: "I",
        VERB_BASE: text(action),
        OBJECT: ""
      });
      set("DENY_CAPABILITY", {
        SUBJECT: "I",
        VERB_BASE: text(action),
        OBJECT: ""
      });
    }

    if (q.kind === "price" && q.target) {
      const price = characterFacts.prices?.[q.target] ?? characterFacts.price;
      if (price !== undefined) {
        set("STATE_PRICE", { AMOUNT: text(price) });
      }
    }

    if (q.kind === "quantity" && q.target) {
      const quantity =
        characterFacts.quantities?.[q.target] ?? characterFacts.quantity;
      if (quantity !== undefined) {
        set("STATE_COUNT", {
          QUANTITY: text(quantity),
          OBJECT: text(q.target)
        });
      }
    }

    return out;
  };
})();