(() => {
  const zones = {
    forest: {
      label: '森',
      cards: [
        { type: 'item', icon: '👜', title: '木の実', text: '木の実を見つけた。', itemId: 'nuts', minutes: 20 },
        { type: 'item', icon: '👜', title: '木の枝', text: '使えそうな木の枝を見つけた。', itemId: 'branch', minutes: 20 },
        { type: 'item', icon: '👜', title: '蔓', text: '丈夫そうな蔓を見つけた。', itemId: 'vine', minutes: 20 },
        { type: 'item', icon: '👜', title: 'キノコ', text: 'キノコを見つけた。', itemId: 'mushroom', minutes: 20 },
        { type: 'item', icon: '👜', title: '薬草', text: '薬草になりそうな草を見つけた。', itemId: 'herb', minutes: 20 },
        { type: 'none', icon: '', title: '', text: '何も見つからなかった。' },
        { type: 'none', icon: '', title: '', text: '何も見つからなかった。' },
        { type: 'item', icon: '👜', title: '木の枝', text: '使えそうな木の枝を見つけた。', itemId: 'branch', minutes: 20 }
      ],
      encounters: [
        { type: 'enemy', icon: '⚔', title: '狼', text: '狼がこちらに気づいた。', enemyId: 'wolf' },
        { type: 'enemy', icon: '⚔', title: '野犬', text: '野犬が唸りながら近づいてくる。', enemyId: 'wild_dog' }
      ]
    },
    plain: {
      label: '平原',
      cards: [
        { type: 'hunt', icon: '🏹', title: '鹿', text: '鹿を見つけた。', animalId: 'deer' },
        { type: 'hunt', icon: '🏹', title: 'ウサギ', text: 'ウサギを見つけた。', animalId: 'rabbit' },
        { type: 'hunt', icon: '🏹', title: '鳥', text: '鳥を見つけた。', animalId: 'bird' },
        { type: 'item', icon: '👜', title: '薬草', text: '薬草になりそうな草を見つけた。', itemId: 'herb', minutes: 20 },
        { type: 'item', icon: '👜', title: '木の実', text: '食べられそうな木の実を見つけた。', itemId: 'nuts', minutes: 20 },
        { type: 'none', icon: '', title: '', text: '何も見つからなかった。' },
        { type: 'none', icon: '', title: '', text: '何も見つからなかった。' },
        { type: 'none', icon: '', title: '', text: '風が草を揺らしている。何もいない。' }
      ],
      encounters: [
        { type: 'enemy', icon: '⚔', title: '野犬', text: '野犬がこちらを狙っている。', enemyId: 'wild_dog' }
      ]
    },
    river: {
      label: '川',
      cards: [
        { type: 'fish', icon: '🐟', title: '魚', text: '浅瀬に魚を見つけた。', fishHp: 2, minutes: 10 },
        { type: 'fish', icon: '🐟', title: '魚', text: '水面近くに魚がいる。', fishHp: 2, minutes: 10 },
        { type: 'item', icon: '👜', title: '河原の石', text: '使えそうな小石を見つけた。', itemId: 'pebble', minutes: 10 },
        { type: 'item', icon: '👜', title: '河原の石', text: '丸い小石を見つけた。', itemId: 'pebble', minutes: 10 },
        { type: 'item', icon: '👜', title: '流木', text: '乾いた流木を見つけた。', itemId: 'branch', minutes: 15 },
        { type: 'none', icon: '', title: '', text: '水音だけが聞こえる。何も見つからなかった。' },
        { type: 'none', icon: '', title: '', text: '何も見つからなかった。' },
        { type: 'fish', icon: '🐟', title: '魚', text: '石陰に魚がいる。', fishHp: 2, minutes: 10 }
      ],
      encounters: [
        { type: 'enemy', icon: '⚔', title: '野犬', text: '水辺にいた野犬がこちらへ向かってくる。', enemyId: 'wild_dog' }
      ]
    }
  };

  const placeNames = {
    northForest: '北の森',
    deepForest: '深い森',
    plain: '開けた平原',
    river: '川辺',
    forest: '森'
  };

  window.DDPointConfig = {
    battleUnlockEventId: 'return_with_meat_01',
    encountersPerDeck: 1,
    zones,
    placeNames
  };
})();