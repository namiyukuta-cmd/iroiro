window.HOUSE_DATA = {
  cols: 10,
  rows: 12,
  startMoney: 5000,
  base: {
    floor:  { label: "床", price: 50 },
    wall:   { label: "壁", price: 80 },
    door:   { label: "扉", price: 120, requires: "wall" },
    window: { label: "窓", price: 100, requires: "wall" }
  },
  furniture: {
    bed:    { label: "寝", name: "ベッド", price: 300 },
    table:  { label: "卓", name: "机", price: 180 },
    sofa:   { label: "ソ", name: "ソファ", price: 350 },
    stove:  { label: "台", name: "台所", price: 280 },
    toilet: { label: "厠", name: "トイレ", price: 240 }
  },
  goals: [
    {
      title: "小さな一軒家",
      reward: 1200,
      requirements: { floor: 18, wall: 10, door: 1, window: 2, bed: 1, table: 1 }
    },
    {
      title: "暮らせる家",
      reward: 1800,
      requirements: { floor: 28, wall: 14, door: 1, window: 3, bed: 1, table: 1, stove: 1, toilet: 1 }
    },
    {
      title: "くつろげる家",
      reward: 2500,
      requirements: { floor: 36, wall: 18, door: 2, window: 4, bed: 1, table: 1, sofa: 1, stove: 1, toilet: 1 }
    }
  ]
};