chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({'disabledSites': []})
    chrome.storage.sync.set({'status': 'enabled'})
})