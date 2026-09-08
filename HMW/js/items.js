(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const clone = (value) => JSON.parse(JSON.stringify(value));

  const itemData = {
    categories: {
      food: { label: "食料" },
      drink: { label: "飲み物" },
      clothing: { label: "衣類" },
      hygiene: { label: "衛生用品" },
      medicine: { label: "手当用品" },
      scrap: { label: "廃品" },
      utility: { label: "生活用品" }
    },

    definitions: {
      food_pack: {
        name: "支援でもらった食料",
        category: "food",
        stackable: true,
        usable: true,
        sellable: false,
        notes: "支援施設などでもらう食料。"
      },

      leftover_food: {
        name: "廃棄予定の食べ物",
        category: "food",
        stackable: true,
        usable: true,
        sellable: false,
        notes: "店などから譲ってもらうことがある。"
      },

      bread: {
        name: "パン",
        category: "food",
        stackable: true,
        usable: true,
        sellable: false
      },

      bottled_water: {
        name: "水",
        category: "drink",
        stackable: true,
        usable: true,
        sellable: false
      },

      blanket: {
        name: "毛布",
        category: "clothing",
        stackable: false,
        usable: true,
        sellable: false,
        notes: "寝る時の寒さをしのぐために使える。"
      },

      jacket: {
        name: "上着",
        category: "clothing",
        stackable: false,
        usable: true,
        sellable: false
      },

      raincoat: {
        name: "雨具",
        category: "clothing",
        stackable: false,
        usable: true,
        sellable: false,
        notes: "雨による濡れを抑えるための衣類。"
      },

      soap: {
        name: "石けん",
        category: "hygiene",
        stackable: true,
        usable: true,
        sellable: false
      },

      wet_wipes: {
        name: "ウェットティッシュ",
        category: "hygiene",
        stackable: true,
        usable: true,
        sellable: false
      },

      bandage: {
        name: "手当用品",
        category: "medicine",
        stackable: true,
        usable: true,
        sellable: false
      },

      scrap_piece: {
        name: "売れそうな廃品",
        category: "scrap",
        stackable: true,
        usable: false,
        sellable: true,
        notes: "廃品回収所へ持ち込める。"
      },

      aluminum_can: {
        name: "空き缶",
        category: "scrap",
        stackable: true,
        usable: false,
        sellable: true
      },

      cardboard: {
        name: "段ボール",
        category: "utility",
        stackable: true,
        usable: true,
        sellable: false,
        notes: "敷物や簡単な風よけなどに使える。"
      },

      plastic_bottle: {
        name: "空のペットボトル",
        category: "scrap",
        stackable: true,
        usable: false,
        sellable: true
      },

      umbrella: {
        name: "傘",
        category: "utility",
        stackable: false,
        usable: true,
        sellable: false
      },

      backpack: {
        name: "リュック",
        category: "utility",
        stackable: false,
        usable: true,
        sellable: false,
        notes: "持ち物をまとめるためのバッグ。"
      }
    }
  };

  const getDefinition = (itemId) => itemData.definitions[itemId] || null;

  const getInventory = () => {
    if (!HMW.state?.player) return [];
    if (!Array.isArray(HMW.state.player.inventory)) {
      HMW.state.player.inventory = [];
    }
    return HMW.state.player.inventory;
  };

  const normalizeItem = (item, quantity = 1) => {
    if (typeof item === "string") {
      const definition = getDefinition(item);
      return {
        id: item,
        name: definition?.name || item,
        quantity: Math.max(1, quantity)
      };
    }

    const source = item && typeof item === "object" ? clone(item) : {};
    const definition = getDefinition(source.id);

    return {
      ...source,
      id: source.id || null,
      name: source.name || definition?.name || source.id || "アイテム",
      quantity: Math.max(1, Number(source.quantity) || quantity || 1)
    };
  };

  const addItem = (item, quantity = 1) => {
    const inventory = getInventory();
    const normalized = normalizeItem(item, quantity);
    const definition = getDefinition(normalized.id);

    if (normalized.id && definition?.stackable !== false) {
      const existing = inventory.find((entry) => {
        if (typeof entry === "string") return entry === normalized.id;
        return entry?.id === normalized.id;
      });

      if (existing) {
        if (typeof existing === "string") {
          const index = inventory.indexOf(existing);
          inventory[index] = normalizeItem(existing, normalized.quantity + 1);
          return clone(inventory[index]);
        }

        existing.quantity = Math.max(1, Number(existing.quantity) || 1) + normalized.quantity;
        if (!existing.name) existing.name = normalized.name;
        return clone(existing);
      }
    }

    inventory.push(normalized);
    return clone(normalized);
  };

  const getItemCount = (itemId) => {
    return getInventory().reduce((count, entry) => {
      if (typeof entry === "string") {
        return count + (entry === itemId ? 1 : 0);
      }
      if (entry?.id !== itemId) return count;
      return count + Math.max(1, Number(entry.quantity) || 1);
    }, 0);
  };

  const hasItem = (itemId, quantity = 1) => getItemCount(itemId) >= quantity;

  const removeItem = (itemId, quantity = 1) => {
    const inventory = getInventory();
    let remaining = Math.max(1, quantity);

    for (let i = inventory.length - 1; i >= 0 && remaining > 0; i -= 1) {
      const entry = inventory[i];
      const id = typeof entry === "string" ? entry : entry?.id;
      if (id !== itemId) continue;

      const currentQuantity = typeof entry === "string"
        ? 1
        : Math.max(1, Number(entry.quantity) || 1);

      if (currentQuantity <= remaining) {
        remaining -= currentQuantity;
        inventory.splice(i, 1);
      } else {
        entry.quantity = currentQuantity - remaining;
        remaining = 0;
      }
    }

    return remaining === 0;
  };

  const getInventorySummary = () => {
    return getInventory().map((entry) => {
      const normalized = normalizeItem(entry);
      const definition = getDefinition(normalized.id);
      return {
        ...normalized,
        category: definition?.category || null,
        categoryLabel: definition?.category
          ? itemData.categories[definition.category]?.label || definition.category
          : null,
        usable: definition?.usable ?? false,
        sellable: definition?.sellable ?? false
      };
    });
  };

  window.HMW.itemData = itemData;

  window.HMW.getItem = (itemId) => {
    const definition = getDefinition(itemId);
    return definition ? { id: itemId, ...clone(definition) } : null;
  };

  window.HMW.createInventoryItem = (itemId, quantity = 1, extra = {}) => {
    return normalizeItem({ id: itemId, quantity, ...clone(extra) }, quantity);
  };

  window.HMW.addItem = addItem;
  window.HMW.removeItem = removeItem;
  window.HMW.getItemCount = getItemCount;
  window.HMW.hasItem = hasItem;
  window.HMW.getInventorySummary = getInventorySummary;
})();
