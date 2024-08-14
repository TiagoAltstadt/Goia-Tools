function createFloatingBadge(text, bgColor, bottomOffset) {
  const badge = document.createElement("div");
  badge.style.position = "fixed";
  badge.style.bottom = `${bottomOffset}px`;
  badge.style.right = "10px";
  badge.style.maxWidth = "300px";
  badge.style.backgroundColor = bgColor;
  badge.style.color = "black";
  badge.style.padding = "10px 15px";
  badge.style.borderRadius = "8px";
  badge.style.boxShadow = "0px 4px 15px rgba(0, 0, 0, 0.2)";
  badge.style.zIndex = "10000";
  badge.style.cursor = "move";
  badge.style.fontFamily = "'Nunito', sans-serif";
  badge.style.fontSize = "0.9em";
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
