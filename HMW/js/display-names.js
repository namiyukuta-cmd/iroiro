(() => {
  "use strict";

  const H = window.HMW;
  if (!H?.DATA?.people) return;

  const replacements = {
    "名前付き支援員": H.DATA.people.support_named.name,
    "名前付き警官": H.DATA.people.police_named.name,
    "名前付きホームレス": H.DATA.people.homeless_named.name,
    "名前付き不良": H.DATA.people.thug_named.name
  };

  function replaceText(text) {
    let next = text;
    Object.entries(replacements).forEach(([from, to]) => {
      next = next.replaceAll(from, to);
    });
    return next;
  }

  function fixNode(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      const next = replaceText(root.nodeValue || "");
      if (next !== root.nodeValue) root.nodeValue = next;
      return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const next = replaceText(node.nodeValue || "");
      if (next !== node.nodeValue) node.nodeValue = next;
    }
  }

  fixNode(document.body);

  new MutationObserver((records) => {
    records.forEach((record) => {
      if (record.type === "characterData") fixNode(record.target);
      record.addedNodes.forEach(fixNode);
    });
  }).observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true
  });
})();