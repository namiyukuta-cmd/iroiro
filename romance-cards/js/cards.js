'use strict';
const DECK=[['lips','唇',35,'M15 48Q36 24 50 36Q65 24 85 48Q66 77 50 66Q32 77 15 48ZM15 48Q50 53 85 48M30 52Q50 64 70 52'],['hand','手',0,'M36 88V67L19 47Q17 38 25 41L35 48V20Q39 10 44 20V43V13Q50 5 54 14V43V18Q62 11 64 21V45V28Q72 21 74 32V65L64 88M44 57Q55 48 64 55'],['outfit','衣装',55,'M35 12L50 23L65 12L88 28L77 47L70 41V90H30V41L23 47L12 28ZM35 12L39 38L50 23L61 38L65 12M50 23V90M54 48h1M54 62h1'],['cheek','頬',15,'M31 13Q70 4 76 39L86 53L76 57Q80 77 59 79L57 91M31 13Q14 36 28 57M59 79Q40 75 36 62M60 40h5M59 56l8 2'],['leg','足',65,'M32 10L43 49L34 79L21 84Q18 94 42 88L55 80L61 49L68 10M43 49l18 0'],['back','背中',60,'M35 12V24L12 34L24 91H77L88 34L65 24V12M26 30Q50 99 75 30M35 24Q50 32 65 24'],['ear','耳',40,'M28 63Q8 22 40 13Q77 4 80 37Q83 57 62 65Q59 91 43 84Q35 81 39 70M31 47Q22 25 46 23Q72 23 66 45L54 53Q40 44 42 60'],['neck','首',45,'M32 10Q40 37 29 49L10 59M67 10Q60 37 71 49L90 59M29 49Q48 67 71 49M10 59L18 91M90 59L82 91']];
const FEEL={calm:['穏やか','#c9cdc7'],warm:['ときめき','#dc91b0'],sad:['落ち込み','#82afc4'],angry:['怒り','#e56559'],guarded:['警戒','#9a83b4'],tense:['緊張','#c8a66c']};


// Uploaded card artwork shared with the sticker image library.
const CARD_ART={
  "lips": "../sticker/images/ce5006da1183f9f03e0ff11f24624c486e409cccd7a3fd5a231627974368fc3c.png",
  "hand": "../sticker/images/f65d3d237668fb7a1538510db90cba7f61efa811244ec7ebbf60890617f8d902.png",
  "outfit": "../sticker/images/3f66631e6f9eb9e1bf395445aa18b9cb9cdeb7362ca8cb13aa9fd963086eaa2a.png",
  "cheek": "../sticker/images/87e5c039e84914ce350e12066bd19adbb6d8c56195327a4e94983a9ed5b0ae84.png",
  "leg": "../sticker/images/24fbfdd5bb33b944d4dcfe45dc5ec86b429cb3710e6a11bfb06667137e44c466.png",
  "back": "../sticker/images/d764522a1a1a180c93a2922e24b1da533fe0f02a0d25d775e15cbdadbc70a508.png",
  "ear": "../sticker/images/4aec724a276029e92ea8723eb506c2b02a7a3893f9d8f0b7ebd68c2e1b59ad29.png",
  "neck": "../sticker/images/4bd0e2e40880acda8610f3cd00175fc646ceb850015c4e02520f55d5ea978ff0.png"
};
