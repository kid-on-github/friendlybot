chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({'disabledSites': ['127.0.0.1','friendlybot.org']})
    chrome.storage.sync.set({'status': 'enabled'})
})