function copyStringToClipboard(str) {

    var el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style = {position: "absolute", left: "-9999px"};
    document.body.appendChild(el);

    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
}

var arr = [];
document.querySelectorAll('#se-box > div.suggest-div > div.suggest-panel > div.suggest-content .sug')
    .forEach(item => {
        console.log(item.innerText);
        if (arr.indexOf(item.innerText) < 0) {
            arr.push(item.innerText)
        }
    });
copyStringToClipboard(JSON.stringify(arr));