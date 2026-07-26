import { sendToBackground } from '@shared/messaging';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_idle',
  main() {
    console.log('AI Code Extractor Pro content script loaded.');

    // Listen for messages from the popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('Content script received:', request);

      handleContentMessage(request)
        .then((response) => {
          sendResponse({ success: true, data: response });
        })
        .catch((error) => {
          console.error('Error in content script:', error);
          sendResponse({ success: false, error: error.message });
        });

      return true; // Keep channel open for async response
    });
  },
});

interface ContentMessagePayload {
  type: string;
  payload?: unknown;
}

/**
 * Handle messages specific to content script
 */
async function handleContentMessage(request: ContentMessagePayload): Promise<unknown> {
  const { type, payload } = request;

  switch (type) {
    case 'EXTRACT_VISIBLE_CODE':
      return extractCodeFromPage();

    case 'GET_PAGE_METADATA':
      return getPageMetadata();

    default:
      // Forward to background for processing
      return await sendToBackground(request as any);
  }
}

/**
 * Extract code blocks from the current page
 */
function extractCodeFromPage(): {
  codeBlocks: Array<{ content: string; language?: string }>;
  platform: string;
} {
  const codeBlocks: Array<{ content: string; language?: string }> = [];

  // Look for common code block containers
  const selectors = [
    'pre code', // Standard <pre><code> blocks
    'code.hljs', // Highlight.js
    '[class*="code-block"]', // Custom code block classes
    '[class*="prism-code"]', // Prism
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      const content = element.textContent?.trim();
      if (content && content.length > 0) {
        // Try to detect language from class names
        const className = element.className || '';
        const languageMatch = className.match(/language-(\w+)/i);
        const language = languageMatch ? languageMatch[1] : undefined;

        codeBlocks.push({
          content,
          language,
        });
      }
    });
  });

  return {
    codeBlocks,
    platform: detectPlatform(),
  };
}

/**
 * Detect which AI platform we're on
 */
function detectPlatform(): string {
  const hostname = window.location.hostname;

  if (hostname.includes('chatgpt.com') || hostname.includes('openai.com')) {
    return 'chatgpt';
  } else if (hostname.includes('claude.ai')) {
    return 'claude';
  } else if (hostname.includes('gemini.google.com')) {
    return 'gemini';
  } else if (hostname.includes('deepseek.com')) {
    return 'deepseek';
  } else if (hostname.includes('devin.ai')) {
    return 'devin';
  } else if (hostname.includes('grok.com') || hostname.includes('x.com/grok')) {
    return 'grok';
  } else if (hostname.includes('perplexity.ai')) {
    return 'perplexity';
  } else if (hostname.includes('copilot.microsoft.com')) {
    return 'copilot';
  }

  return 'unknown';
}

/**
 * Get metadata about the current page
 */
function getPageMetadata(): { title: string; url: string; platform: string } {
  return {
    title: document.title,
    url: window.location.href,
    platform: detectPlatform(),
  };
}
