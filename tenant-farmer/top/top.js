(() => {
  const newGameButton = document.getElementById("newGameButton");
  const continueButton = document.getElementById("continueButton");

  newGameButton?.addEventListener("click", () => {
    location.href = "../index.html?_nc=" + Date.now();
  });

  continueButton?.addEventListener("click", () => {
    location.href = "../index.html?_nc=" + Date.now();
  });
})();
