// 砂漠都市生活 専用NPCデータ
// category は "客" または "NPC"

window.DESERT_NPC_DATA = {
  categories: ["客", "NPC"],

  characters: [
    {
      id: "npc_landlord_01",
      category: "NPC",
      name: "貸主",
      role: "部屋の貸主",
      location: "主人公が借りている部屋のある建物",
      relation: "主人公に狭い一部屋を貸している",
      status: "生存",
      tags: ["貸主", "住居", "慈悲"],
      notes: "主人公に部屋を貸し、その代わり、宿を必要とする者を主人公の部屋に泊め、もてなすよう求めた。"
    }
  ]
};

window.getDesertNpcById = function(id) {
  return window.DESERT_NPC_DATA.characters.find(character => character.id === id) || null;
};

window.getDesertNpcsByCategory = function(category) {
  return window.DESERT_NPC_DATA.characters.filter(character => character.category === category);
};
