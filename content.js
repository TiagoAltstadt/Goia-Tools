function createFloatingBadge(text, bottomOffset = 50, bgColor = 'rgba(135, 206, 250, 0.9)') {
  const badge = document.createElement("div");
  badge.className = "floating-badge";
  badge.style.bottom = `${bottomOffset}px`;
  badge.style.backgroundColor = bgColor;
  badge.innerHTML = text;

  document.body.appendChild(badge);

  // Make the badge draggable
  makeDraggable(badge);
}

function makeDraggable(el) {
  let isDragging = false;
  let offsetX, offsetY;

  el.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - el.getBoundingClientRect().left;
      offsetY = e.clientY - el.getBoundingClientRect().top;
      el.style.position = "absolute";
  });

  document.addEventListener("mousemove", (e) => {
      if (isDragging) {
          el.style.left = `${e.clientX - offsetX}px`;
          el.style.top = `${e.clientY - offsetY}px`;
      }
  });

  document.addEventListener("mouseup", () => {
      isDragging = false;
  });
}

function displayLocaleBadge() {
  const htmlTag = document.querySelector("html");
  if (htmlTag) {
      const lang = htmlTag.getAttribute("lang");
      if (lang) {
          createFloatingBadge(`Locale: ${lang}`, "rgba(135, 206, 250, 0.9)", 50);
      }
  }
}

chrome.storage.sync.get(["prodDomains", "stageDomains", "liveDomains"], function (data) {
  const currentDomain = window.location.hostname;

  // Remove domain checking and badge creation
  // Example: If you need a static badge or specific logic, adjust here

  // Display locale badge
  displayLocaleBadge();
});
