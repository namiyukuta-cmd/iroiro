window.DDHuntConfig = {
  equipment: {
    bow: {
      name: '粗悪な弓',
      material: '木の枝',
      description: '木の枝を多少加工した粗悪品。',
      quality: '粗悪品',
      hitZoneBonus: 7
    },
    bowstring: {
      name: '粗悪な弓弦',
      material: '草の蔦',
      description: '草の蔦を雑に編んだもの。',
      quality: '粗悪品',
      hitZoneBonus: 5
    },
    arrows: {
      name: '粗悪な矢',
      count: 3,
      description: '3本とも粗悪品。',
      quality: '粗悪品',
      damage: 1
    }
  },

  huntRules: {
    retryHpRatio: 0.5
  },

  animals: [
    {
      id: 'deer',
      name: '鹿',
      hp: 3,
      speed: 1.2,
      description: '体力が一番多い。',
      image: 'asset/Hunt/hunt_deer_768x512.png',
      imagePosition: '28% 40%',
      imageScale: 2,
      meatItemId: 'meat_deer'
    },
    {
      id: 'rabbit',
      name: 'ウサギ',
      hp: 3,
      speed: 1.8,
      description: '体力も素早さも普通。',
      image: 'asset/Hunt/hunt_rabbit_768x512.png',
      imagePosition: '27% 44%',
      imageScale: 2.15,
      meatItemId: 'meat_rabbit'
    },
    {
      id: 'bird',
      name: '鳥',
      hp: 1,
      speed: 2.6,
      description: '体力が一番少ないが素早い。',
      image: 'asset/Hunt/hunt_bird_768x512.png',
      imagePosition: '30% 42%',
      imageScale: 2.1,
      meatItemId: 'meat_bird'
    }
  ]
};
