(() => {
  "use strict";

  window.HMW = window.HMW || {};
  const HMW = window.HMW;

  const getElements = () => ({
    status: document.getElementById("hudStatus"),
    menu: document.getElementById("quickMenu"),
    toggle: document.getElementById("menuButton"),
    log: document.getElementById("quickLogButton"),
    load: document.getElementById("quickLoadButton"),
    save: document.getElementById("quickSaveButton")
  });

  const setOpen = (open) => {
    const { status, menu, toggle } = getElements();
    if (!status || !menu || !toggle) return;

    status.hidden = open;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const toggleMenu = () => {
    const { menu } = getElements();
    if (!menu) return;
    setOpen(menu.hidden);
  };

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target.closest?.("#menuButton");
      if (!target) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      toggleMenu();
    },
    true
  );

  document.addEventListener("DOMContentLoaded", () => {
    const { log, load, save } = getElements();

    log?.addEventListener("click", () => {
      setOpen(false);
      document.getElementById("logButton")?.click();
    });

    load?.addEventListener("click", () => {
      setOpen(false);
      HMW.saveManager?.open?.();
    });

    save?.addEventListener("click", () => {
      setOpen(false);
      HMW.saveManager?.open?.();
    });
  });

  HMW.quickMenu = {
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: toggleMenu
  };
})();
