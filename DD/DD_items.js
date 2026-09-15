window.DDItems = {
  items: {
    meat_bird: {
      id: 'meat_bird',
      name: '鳥肉',
      category: 'food',
      foodGroup: '肉',
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
      source: '鹿',
      image: 'asset/item/meat_deer.png',
      quantity: { type: 'weight', unit: 'kg', relative: 'large' },
      perishable: true,
      spoil: { enabled: true, duration: null }
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
      zones: ['forest'],
      gatherable: true,
      perishable: false
    },
    mushroom: {
      id: 'mushroom',
      name: 'キノコ',
      category: 'food',
      foodGroup: '野菜',
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
  },

  get(id) {
    return this.items[id] || null;
  },

  byZone(zoneId) {
    return Object.values(this.items).filter(item =>
      item.gatherable && Array.isArray(item.zones) && item.zones.includes(zoneId)
    );
  }
};
