(() => {
  const INVENTORY_KEY = 'dd_session_inventory_v1';

  const items = {
    meat_bird: {
      id: 'meat_bird',
      name: '鳥肉',
      category: 'food',
      foodGroup: '肉',
      foodType: 'meat',
      edible: false,
      requiresCooking: true,
      cookingName: '焼いた鳥肉',
      hungerRestore: 100,
      source: '鳥',
      image: 'asset/item/meat_chicken.png',
      quantity: { type: 'weight', unit: 'kg', relative: 'small' },
      perishable: true,
      spoil: { enabled: true, duration: null }
    },
    meat_rabbit: {
      id: 'meat_rabbit',
      name: 'うさぎ肉',
      category: 'food',
      foodGroup: '肉',
      foodType: 'meat',
      edible: false,
      requiresCooking: true,
      cookingName: '焼いたウサギ肉',
      hungerRestore: 100,
      source: 'ウサギ',
      image: 'asset/item/meat_rabbit.png',
      quantity: { type: 'weight', unit: 'kg', relative: 'medium' },
      perishable: true,
      spoil: { enabled: true, duration: null }
    },
    meat_deer: {
      id: 'meat_deer',
      name: '鹿肉',
      category: 'food',
      foodGroup: '肉',
      foodType: 'meat',
      edible: false,
      requiresCooking: true,
      cookingName: '焼いた鹿肉',
      hungerRestore: 100,
      source: '鹿',
      image: 'asset/item/meat_deer.png',
      quantity: { type: 'weight', unit: 'kg', relative: 'large' },
      perishable: true,
      spoil: { enabled: true, duration: null }
    },
    wolf_pup: {
      id: 'wolf_pup',
      name: '狼の子（？）',
      category: 'special',
      kind: 'companion',
      description: '頼りなく「みゅう、みゅう」と鳴く、狼らしい小さな子。完全肉食。',
      unique: true,
      perishable: false
    },
    wolf_companion: {
      id: 'wolf_companion',
      name: '狼（？）',
      category: 'special',
      kind: 'companion',
      description: '2日を経て大きくなった狼らしい獣。完全肉食。',
      unique: true,
      perishable: false
    },
    branch: {
      id: 'branch',
      name: '木の枝',
      category: 'material',
      zones: ['forest'],
      gatherable: true,
      uses: ['弓', '矢', '薪', '籠'],
      perishable: false
    },
    wood_arrow: {
      id: 'wood_arrow',
      name: '木の矢',
      category: 'ammo',
      kind: 'arrow',
      description: '木の枝を削って作った簡素な矢。',
      perishable: false
    },
    vine: {
      id: 'vine',
      name: '蔓',
      aliases: ['蔦'],
      category: 'material',
      zones: ['forest'],
      gatherable: true,
      uses: ['弓弦', '紐'],
      perishable: false
    },
    nuts: {
      id: 'nuts',
      name: '木の実',
      category: 'food',
      foodGroup: '野菜',
      foodType: 'other',
      edible: true,
      requiresCooking: false,
      hungerRestore: 100,
      zones: ['forest'],
      gatherable: true,
      perishable: false
    },
    mushroom: {
      id: 'mushroom',
      name: 'キノコ',
      category: 'food',
      foodGroup: '野菜',
      foodType: 'other',
      edible: false,
      requiresCooking: true,
      cookingName: '焼きキノコ',
      hungerRestore: 100,
      zones: ['forest'],
      gatherable: true,
      perishable: true,
      spoil: { enabled: true, duration: null }
    },
    pebble: {
      id: 'pebble',
      name: '小石',
      category: 'material',
      zones: ['forest', 'river', 'plain'],
      gatherable: true,
      uses: [],
      perishable: false
    },
    river_fish: {
      id: 'river_fish',
      name: '川魚',
      category: 'food',
      foodGroup: '魚',
      foodType: 'fish',
      edible: false,
      requiresCooking: true,
      cookingName: '焼き魚',
      hungerRestore: 100,
      zones: ['river'],
      gatherable: true,
      quantity: { type: 'weight', unit: 'kg' },
      perishable: true,
      spoil: { enabled: true, duration: null }
    },
    herb: {
      id: 'herb',
      name: '薬草',
      category: 'material',
      zones: ['forest', 'plain'],
      gatherable: true,
      uses: [],
      perishable: true,
      spoil: { enabled: true, duration: null }
    }
  };

  function loadInventory() {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(INVENTORY_KEY) || '{}');
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
      const clean = {};
      Object.entries(parsed).forEach(([id, count]) => {
        const value = Math.max(0, Math.floor(Number(count) || 0));
        if (items[id] && value > 0) clean[id] = items[id].unique ? 1 : value;
      });
      return clean;
    } catch (_) {
      return {};
    }
  }

  let inventory = loadInventory();

  function syncInventory() {
    try {
      sessionStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
    } catch (_) {}
  }

  function emitChange() {
    window.dispatchEvent(new CustomEvent('ddinventorychange', {
      detail: { inventory: { ...inventory } }
    }));
  }

  const api = {
    items,
    inventoryKey: INVENTORY_KEY,

    get(id) {
      return items[id] || null;
    },

    byZone(zoneId) {
      return Object.values(items).filter(item =>
        item.gatherable && Array.isArray(item.zones) && item.zones.includes(zoneId)
      );
    },

    add(id, amount = 1) {
      if (!items[id]) return 0;
      const value = Math.max(0, Math.floor(Number(amount) || 0));
      if (!value) return inventory[id] || 0;

      if (items[id].unique) {
        inventory[id] = 1;
      } else {
        inventory[id] = (inventory[id] || 0) + value;
      }

      syncInventory();
      emitChange();
      return inventory[id];
    },

    remove(id, amount = 1) {
      if (!items[id]) return 0;
      const value = Math.max(0, Math.floor(Number(amount) || 0));
      const next = Math.max(0, (inventory[id] || 0) - value);
      if (next > 0) inventory[id] = next;
      else delete inventory[id];
      syncInventory();
      emitChange();
      return next;
    },

    count(id) {
      return inventory[id] || 0;
    },

    getInventory() {
      return Object.entries(inventory)
        .filter(([, count]) => count > 0)
        .map(([id, count]) => ({ item: items[id], count }));
    },

    clearInventory() {
      inventory = {};
      try { sessionStorage.removeItem(INVENTORY_KEY); } catch (_) {}
      emitChange();
    }
  };

  window.DDItems = api;
})();