chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(["prodDomains", "stageDomains", "liveDomains"], function(data) {
    if (!data.liveDomains) {
      chrome.storage.sync.set({ liveDomains: [] });
    }
    if (!data.prodDomains) {
      chrome.storage.sync.set({ prodDomains: [] });
    }
    if (!data.stageDomains) {
      chrome.storage.sync.set({ stageDomains: [] });
    }
  });
});
