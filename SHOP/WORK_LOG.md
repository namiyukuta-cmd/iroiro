# SHOP 作業記録

このファイルには、`iroiro/SHOP` で行った作業内容を時系列で追記する。
今後、SHOP関連の修正・変更・確認を行ったら、その都度ここへ追記する。

## 2026-09-23

### 対象
- リポジトリ: `namiyukuta-cmd/iroiro`
- フォルダ: `SHOP/`
- 対象画面: `SHOP_top.html`
- 初期場面: `小門外・底辺区`
- Kenshiではない。SHOP画面を対象とする。

### 確認したファイル
- `SHOP/SHOP_top.html`
- `SHOP/SHOP_data.js`
- `SHOP/SHOP_app.js`
- 関連: `SHOP/SHOP_action.js`, `SHOP/SHOP_items.js`, `SHOP/SHOP_save.js`

### 確認した直近の復元内容
- 09/19に受け入れ済みだった町画面配置へ戻す方針を確認。
- 町画面を上下に分割せず、同一画面全面に5レイヤーを重ねる構造。
  1. 遠景
  2. 家
  3. 背景NPC
  4. 選択可能NPC・屋台
  5. 主人公
- 拾えるアイテム表示は維持。
- 「行動」画面は維持。

### outerPoor の配置
- 家:
  - left -8 / bottom 24 / height 38
  - left 76 / bottom 24 / height 38 / flip
  - left 20 / bottom 25 / height 21 / flip
  - left 59 / bottom 25 / height 21
- 背景NPC:
  - 老人: left 13 / bottom 10 / height 18
  - 運び屋: left 84 / bottom 10 / height 18
- 選択可能:
  - 屋台: left 48 / bottom 3 / height 26
  - 物乞い: left 28 / bottom 2 / height 24
- 拾得物:
  - rag: left 66 / bottom 8
  - bottle: left 10 / bottom 6

### 今回提示した修正コード
- `SHOP_top.html`
  - `.scene-layer` を `position:absolute; inset:0;` に統一。
  - far/house/backgroundNpc/interactive/player のz-indexを設定。
  - scene-objectと選択NPCの表示設定を確認。
  - `#saveStatus:empty{display:none;}` を追加候補として提示。
- `SHOP_data.js`
  - `outerPoor` の09/19配置値を提示。
- `SHOP_app.js`
  - `renderScene()` を5レイヤー重ね方式で提示。
  - 既存の `town` / `people` データ互換を維持。
  - pickupをinteractiveレイヤーへ描画。

### 継続ルール
- SHOP関連で作業したら、このファイルへ作業内容を追記する。
- 別ゲームのコードと混同しない。


### 人物を上へ移動する調整案
- 対象: `SHOP/SHOP_data.js` の `outerPoor.objects`
- 目的: 現在の画面より人物を少し上へ配置し、比較画像の9:19画面に近づける。
- CSSではなく各人物データの `bottom` 値を上げる。
- 推奨値:
  - 老人: `bottom:10` → `bottom:16`
  - 運び屋: `bottom:10` → `bottom:16`
  - 物乞い: `bottom:2` → `bottom:8`
- 屋台は人物ではないため `bottom:3` のまま。
