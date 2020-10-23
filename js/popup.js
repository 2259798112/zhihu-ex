//相似度检查
$('#iBtnSim').click(e => {
	sendMessageToContentScript({cmd:'sim'}, null)
});
//相似度检查
$('#iBtnTag').click(e => {
	sendMessageToContentScript({cmd:'tag'}, null)
});
//相似度检查
$('#iBtnReplace').click(e => {
	sendMessageToContentScript({cmd:'iBtnReplace'}, null)
});
//相似度检查
$('#iBtnQuestionInfo').click(e => {
	sendMessageToContentScript({cmd:'iBtnQuestionInfo',list:[19550546,19550629,19550657,19550835,19550845,19550859,19550943]}, null)
});

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自content-script的消息：');
	console.log(request, sender, sendResponse);
	sendResponse('我是popup，我已收到你的消息：' + JSON.stringify(request));
});


// 向content-script主动发送消息
function sendMessageToContentScript(message, callback)
{
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.sendMessage(tabId, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}


// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}