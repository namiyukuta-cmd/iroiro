window.DDSurvivalConfig = {
  hunting: {
    onFailure: 'return_home',
    description: '獲物を仕留められなかった場合、その狩りは終了して小屋へ帰る。'
  },

  gathering: {
    available: ['木の実']
  },

  food: {
    groups: ['野菜', '肉', '魚'],
    rules: {
      vegetableOnlyAllowed: true,
      longTermImbalance: {
        enabled: true,
        exampleEffect: {
          stat: 'maxHp',
          amount: -1
        },
        triggerDays: null,
        description: '野菜ばかりでも食べられるが、長期的な偏りが続くと最大体力が下がるなどの影響が出る。'
      }
    }
  },

  forestHome: {
    home: '小屋',
    movement: {
      type: 'grid',
      center: '小屋',
      rangeCells: null,
      description: '隠れ住む森では、小屋周辺をマス目単位で移動する。移動可能範囲もマス目で管理する。'
    }
  }
};
