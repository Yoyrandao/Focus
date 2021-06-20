import { application } from '../lib/application';
import { sendMessage } from '../lib/messaging';
import { getStorageItem, setStorageItem } from '../lib/storage';
import { ChromeEvent, Rule, LocalStorageRulesKey } from '../lib/types';
import { extendUrl, isValidUrl, extractDomainAndName } from '../lib/url';

/*
 * Helpful functions
 */

const callback = () => {
  // change to redirect to custom page
  return {
    cancel: true,
  };
};

/*
 * Additional functions
 */

const registerBlockingRules = (rules: Rule[]): void => {
  const rulesLinks = rules
    .map((x) => extendUrl(x.link))
    .filter((x) => x !== undefined)
    .map((x) => x as string);

  chrome.webRequest.onBeforeRequest.addListener(
    callback,
    {
      urls: rulesLinks,
    },
    ['blocking'],
  );
};

const handleSettingRules = (): void => {
  const data: Rule[] = getStorageItem<Rule[]>(LocalStorageRulesKey) || [];

  if (data?.length === 0) {
    if (chrome.webRequest.onBeforeRequest.hasListeners()) {
      chrome.webRequest.onBeforeRequest.removeListener(callback);
    }

    return;
  }

  registerBlockingRules(data);
};

const handleAddingCurrent = () => {
  const data: Rule[] = getStorageItem<Rule[]>(LocalStorageRulesKey) || [];

  application.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab) {
      return;
    }

    if (!isValidUrl(tab.url || '')) {
      return;
    }

    const [domain, name]: string[] = extractDomainAndName(tab.url || '');
    data.push({
      link: domain,
      name: name.toUpperCase(),
    });

    setStorageItem(LocalStorageRulesKey, data);
    registerBlockingRules(data);

    sendMessage('SET_LOCALLY');

    return;
  });
};

/*
 * Application Event Handling
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
application.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  const event = message as ChromeEvent;

  if (!event) return;

  switch (event.type) {
    case 'SET_RULES':
      handleSettingRules();
      break;

    case 'ADD_CURRENT':
      handleAddingCurrent();
      break;

    default:
      return;
  }
});

application.runtime.onInstalled.addListener(() => {
  console.log('Background worker instantiated.');
});
