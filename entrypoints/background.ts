export default defineBackground(() => {
  console.log('AI Code Extractor Pro background service worker started.');

  // Listen for messages from content scripts and popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);
    sendResponse({ status: 'received' });
  });
});