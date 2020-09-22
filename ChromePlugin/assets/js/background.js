chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
  if (request.isPlaylist) {
    fetch(request.url).then(r => r.text());
  } else {
    chrome.downloads.download({url: request.url});
  }
  sendResponse('Started Download...');
});
  