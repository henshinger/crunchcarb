var selectedText;

chrome.contextMenus.create({
	"title": chrome.i18n.getMessage("app_rightclicktext"),
	"contexts": ["selection"]
});
chrome.contextMenus.onClicked.addListener(function(info, tab) {
	readSelectionAndSendIt(info.selectionText);
});

chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.executeScript(
		{code: "window.getSelection().toString();"},
		function(selection) {readSelectionAndSendIt(selection[0])}
	);
});


function readSelectionAndSendIt(selectedText) {
	if (selectedText.length == 0) {return};
	//console.log(selectedText);
	var newURL = "https://henshinger.github.io/crunchcarb/extension.html#"+encodeURI(selectedText);
  	chrome.tabs.create({ url: newURL });
}
