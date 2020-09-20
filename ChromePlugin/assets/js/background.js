chrome.runtime.onMessage.addListener(function(request, sender, callback){
    chrome.downloads.download({url: request.url});
    callback('Started Download');
  });
  