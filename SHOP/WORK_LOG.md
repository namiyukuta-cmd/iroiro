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


### 2026-09-23 人物位置を上へ調整
- `SHOP/SHOP_data.js` の `outerPoor` を実際に更新。
- 老人: `bottom 10 → 16`
- 運び屋: `bottom 10 → 16`
- 物乞い: `bottom 2 → 8`
- 屋台は `bottom 3` のまま変更なし。
- 目的: 比較画像の9:19画面に近い高さへ人物を移動。


### 2026-09-23 人物位置変更が画面に反映されない件
- GitHub上の `SHOP_data.js` では人物位置変更済みであることを確認。
  - 老人: `bottom:16`
  - 運び屋: `bottom:16`
  - 物乞い: `bottom:8`
- 画面側が以前のJSを読み続ける可能性があるため、キャッシュ破棄用バージョンを更新。
- `SHOP_top.html` の `SHOP_BUILD` と各JSの `?v=` を `20260923-1325-person-up` に変更。
- `SHOP_data.js` の newGame / continueGame の build パラメータも同じ値へ更新。


### 2026-09-23 比較画像の右側配置へ合わせて再調整
- 左の現行画面と右の9:19参考画像を画像上で比較。
- 単純に `bottom` を上げるだけでは一致しないことを確認。
- 人物は「位置」だけでなく「大きさ」も右画像と異なっていたため、`left` / `bottom` / `height` をまとめて調整。
- `outerPoor` の変更:
  - 老人: `left 13 → 15`, `bottom 16 → 20`, `height 18 → 15`
  - 運び屋: `left 84 → 83`, `bottom 16 → 20`, `height 18 → 15`
  - 物乞い: `left 28` 維持, `bottom 8 → 16`, `height 24 → 21`
  - 屋台: `left 48 → 49`, `bottom 3 → 16`, `height 26 → 25`
- 家・遠景は変更なし。
- キャッシュ対策として build を `20260923-1332-match-reference` に更新。


### 2026-09-23 行動画面を10:55参考画像へ合わせて修正
- 現行13:37画像と参考10:55画像を比較。
- 現行は、操作ボタンが浮きUI・中央タイトル非表示・人物が小さなCSS製の足だけ・壺が下すぎる状態だった。
- `SHOP_top.html` を以下のように変更。
  - 行動画面を `auto / 28% / 残り` の3段構成へ戻した。
  - 上段を独立した操作帯にし、「戻る / 物乞い(中央タイトル) / 物乞い・物を売るボタン」を表示。
  - ボタンを丸いピル型から参考画像の角丸四角へ戻した。
  - CSSだけの小さい足表示を廃止。
  - `npc_beggar_01.png` を2体使い、上部レーンで大きくクロップして人物の下半身が見える構成へ変更。
  - 左27% / 右73% に配置し、右側は左右反転。
  - 壺を `bottom:14%` から `top:31%` へ変更し、参考画像のように上へ移動。
- buildを `20260923-1342-action-reference` に更新してキャッシュを破棄。
