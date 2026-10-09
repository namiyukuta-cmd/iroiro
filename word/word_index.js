const userText = document.getElementById("userText");
const saveButton = document.getElementById("saveText");
const saveStatus = document.getElementById("saveStatus");
const STORAGE_KEY = "iroiro.word.userText.v1";

let text = userText.value;
let savedText = null;

try {
  savedText = localStorage.getItem(STORAGE_KEY);
  if (savedText !== null) {
    userText.value = savedText;
    saveStatus.textContent = "保存した文章を読み込みました";
  }
} catch (error) {
  saveStatus.textContent = "保存データを読み込めませんでした";
}

text = userText.value;

userText.addEventListener("input", () => {
  text = userText.value;
  saveStatus.textContent = savedText === text ? "保存済み" : "未保存の変更があります";
});

saveButton.addEventListener("click", () => {
  try {
    text = userText.value;
    localStorage.setItem(STORAGE_KEY, text);
    savedText = text;
    saveStatus.textContent = "保存しました";
  } catch (error) {
    saveStatus.textContent = "保存できませんでした。ブラウザの保存設定を確認してください";
  }
});
