window.addEventListener('DOMContentLoaded', () => {
  const dog = document.getElementById('grayDogImage');
  if (dog && window.GRAY_DOG_IMAGE) dog.src = window.GRAY_DOG_IMAGE;
  if (!window.GrayGame?.UI) return;
  window.GrayGame.UI.init();
});