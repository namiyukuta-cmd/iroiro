(()=>{
'use strict';

const clients={
  clinic_staff:{id:'clinic_staff',name:'診療所員',affection:0,deliveries:0},
  hooded_man:{id:'hooded_man',name:'フードの男',affection:0,deliveries:0},
  mechanic:{id:'mechanic',name:'整備士',affection:0,deliveries:0},
  resident:{id:'resident',name:'住民',affection:0,deliveries:0},
  researcher:{id:'researcher',name:'研究員',affection:0,deliveries:0},
  repairer:{id:'repairer',name:'修理屋',affection:0,deliveries:0},
  requester:{id:'requester',name:'依頼人',affection:0,deliveries:0},
  tailor:{id:'tailor',name:'店主',affection:0,deliveries:0}
};

function get(id){return clients[id]||null;}
function completeDelivery(id){
  const npc=get(id);
  if(!npc)return null;
  npc.deliveries++;
  npc.affection++;
  return {...npc};
}
function all(){return Object.values(clients).map(n=>({...n}));}
function reset(){
  Object.values(clients).forEach(n=>{n.affection=0;n.deliveries=0;});
}
window.DeliveryNPC={get,completeDelivery,all,reset};
})();