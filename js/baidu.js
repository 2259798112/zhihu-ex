let arr = [];
document.querySelectorAll('#index-box > div > div.suggest-panel > div.suggest-content .sug')
    .forEach(item => {
        console.log(item.innerText);
        if (arr.indexOf(item.innerText) < 0) {
            arr.push(item.innerText)
        }
    });