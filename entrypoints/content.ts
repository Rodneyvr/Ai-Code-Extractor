export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    console.log('AI Code Extractor Pro content script loaded.');

    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Content script received:', request);
      sendResponse({ status: 'ok' });
    });
  },
});