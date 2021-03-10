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
	sendMessageToContentScript({cmd:'iBtnQuestionInfo'}, null)
});//相似度检查

$('#iBtnBaiduDrop').click(e => {
	sendMessageToContentScript({cmd:'iBtnBaiduDrop'}, null)
});

$('#iBtnBaiduDropMobile').click(e => {
	sendMessageToContentScript({cmd:'iBtnBaiduDropMobile'}, null)
});
$('#iBtnSogouDrop').click(e => {
	sendMessageToContentScript({cmd:'iBtnSogouDrop'}, null)
});

$('#iBtnSogouDropMobile').click(e => {
	sendMessageToContentScript({cmd:'iBtnSogouDropMobile'}, null)
});

//Google
$('#iBtnGoogleDrop').click(e => {
	sendMessageToContentScript({cmd:'iBtnGoogleDrop'}, null)
});

$('#iBtnGoogleDropMobile').click(e => {
	sendMessageToContentScript({cmd:'iBtnGoogleDropMobile'}, null)
});

$('#iBtnDownloadDropCSV').click(e => {
	sendMessageToContentScript({cmd:'iBtnDownloadDropCSV'}, null)
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
