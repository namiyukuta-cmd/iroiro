const userText = document.getElementById("userText");
let text = userText.value;

// 入力するたびに最新の文章を取得します。
userText.addEventListener("input", () => {
  text = userText.value;
});
