const userText = document.getElementById("userText");
let text = userText.value;

userText.addEventListener("input", () => {
  text = userText.value;
});
