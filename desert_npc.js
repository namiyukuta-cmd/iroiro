// 砂漠都市生活 専用NPCデータ
// category は "客" / "NPC" / "家族"

window.DESERT_NPC_DATA = {
  protagonist: {
    id: "protagonist_safira",
    name: "サフィラ"
  },

  categories: ["客", "NPC", "家族"],

  rules: {
    firstCustomer: {
      source: "貸主の紹介",
      referrerId: "npc_landlord_01",
      customerId: null,
      notes: "サフィラが最初に取る客は、貸主が紹介して連れてくる客。客本人の詳細は未設定。"
    }
  },

  characters: [
    {
      id: "npc_landlord_01",
      category: "NPC",
      name: "貸主",
      role: "部屋の貸主",
      location: "サフィラが借りている部屋のある建物",
      relation: "サフィラに狭い一部屋を貸している",
      status: "生存",
      tags: ["貸主", "住居", "慈悲", "最初の客の紹介者"],
      notes: "サフィラに部屋を貸し、その代わり、宿を必要とする者をサフィラの部屋に泊め、もてなすよう求めた。サフィラが最初に取る客は、この貸主の紹介で来る。"
    },
    {
      id: "family_sister_01",
      category: "家族",
      name: "姉",
      role: "サフィラの少し歳上の姉",
      location: "遠方",
      relation: "サフィラの姉",
      status: "生存",
      tags: ["姉", "家族", "商人の息子", "縁談"],
      notes: "父親が従事していた商人の息子と心を通わせていた。サフィラの一言をきっかけに彼と引き離され、遠方の足の悪い元兵士に嫁がされた。"
    },
    {
      id: "family_father_01",
      category: "家族",
      name: "父",
      role: "サフィラの父",
      location: "別の貧しい土地",
      relation: "サフィラの父",
      status: "生存",
      tags: ["父", "家族", "商人の従業員", "追放"],
      notes: "商人のもとで働いていた。一家の件の後、身持ちの悪い娘と口の軽い娘を育てた罪とされ、妻とともに別の貧しい土地へ追放された。"
    },
    {
      id: "family_mother_01",
      category: "家族",
      name: "母",
      role: "サフィラの母",
      location: "別の貧しい土地",
      relation: "サフィラの母",
      status: "生存",
      tags: ["母", "家族", "追放"],
      notes: "一家の件の後、身持ちの悪い娘と口の軽い娘を育てた罪とされ、夫とともに別の貧しい土地へ追放された。"
    }
  ]
};

window.getDesertNpcById = function(id) {
  return window.DESERT_NPC_DATA.characters.find(character => character.id === id) || null;
};

window.getDesertNpcsByCategory = function(category) {
  return window.DESERT_NPC_DATA.characters.filter(character => character.category === category);
};
