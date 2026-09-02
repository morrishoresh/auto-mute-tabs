// Auto Mute Tabs - background logic
//
// Rule: when a tab's audio starts (audible becomes true), mute every
// other tab. Domains listed in storage under "ignoredDomains" are
// exempt from triggering this: if a tab on an ignored domain starts
// playing, other tabs are left alone.

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch (e) {
    return null;
  }
}

function isIgnored(hostname, ignoredDomains) {
  if (!hostname) return false;
  return ignoredDomains.some((d) => hostname === d || hostname.endsWith("." + d));
}

function muteOtherTabs(triggerTabId) {
  browser.tabs.query({}).then((tabs) => {
    for (const tab of tabs) {
      if (tab.id === triggerTabId) continue;
      if (!tab.audible) continue;
      if (!tab.mutedInfo || !tab.mutedInfo.muted) {
        browser.tabs.update(tab.id, { muted: true }).catch(() => {});
      }
    }
  });
}

browser.action.onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});

browser.tabs.onUpdated.addListener(
  async (tabId, changeInfo, tab) => {
    const becameAudible = changeInfo.audible === true;
    const wasUnmutedWhilePlaying =
      changeInfo.mutedInfo && changeInfo.mutedInfo.muted === false && tab.audible === true;

    if (!becameAudible && !wasUnmutedWhilePlaying) return;

    const hostname = getHostname(tab.url);
    const data = await browser.storage.local.get("ignoredDomains");
    const ignoredDomains = Array.isArray(data.ignoredDomains) ? data.ignoredDomains : [];

    if (isIgnored(hostname, ignoredDomains)) return;

    muteOtherTabs(tabId);
  },
  { properties: ["audible", "mutedInfo"] }
);
