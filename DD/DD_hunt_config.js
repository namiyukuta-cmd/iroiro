window.DDHuntConfig = {
  equipment: {
    bow: {
      name: '粗悪な弓',
      material: '木の枝',
      description: '木の枝を多少加工した粗悪品。',
      quality: '粗悪品'
    },
    bowstring: {
      name: '粗悪な弓弦',
      material: '草の蔦',
      description: '草の蔦を雑に編んだもの。',
      quality: '粗悪品'
    },
    arrows: {
      name: '粗悪な矢',
      count: 3,
      description: '3本とも粗悪品。',
      quality: '粗悪品'
    }
  },

  animals: [
    {
      id: 'deer',
      name: '鹿',
      hp: 3,
      timing: 'wide',
      timingZoneWidth: 22,
      description: '体力が一番多い。'
    },
    {
      id: 'rabbit',
      name: 'ウサギ',
      hp: 2,
      timing: 'normal',
      timingZoneWidth: 16,
      description: '体力も素早さも普通。'
    },
    {
      id: 'bird',
      name: '鳥',
      hp: 1,
      timing: 'strict',
      timingZoneWidth: 8,
      description: '体力が一番少ないが素早く、タイミングゲージが厳しい。'
    }
  ]
};
