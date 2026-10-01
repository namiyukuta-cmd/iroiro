(() => {
  const newGameButton = document.getElementById("newGameButton");
  const continueButton = document.getElementById("continueButton");

  newGameButton?.addEventListener("click", () => {
    console.log("初めから");
  });

  continueButton?.addEventListener("click", () => {
    console.log("続きから");
  });
})();
