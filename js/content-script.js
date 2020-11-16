console.log('这是content script!');
var dropArr = [];

if (document.location.href.startsWith('https://www.zhihu.com/question')) {
    view_day();
}
if (document.location.href.startsWith('https://www.zhihu.com/search')) {
    let sid = setInterval(function () {
        clearInterval(sid);
        listenChanged()
    }, 1000)

}

function listenChanged() {
    // 选择需要观察变动的节点
    const targetNode = document.querySelector('#SearchMain > div > div > div');

    // 观察器的配置（需要观察什么变动）
    const config = {childList: true, subtree: true};

    // 当观察到变动时执行的回调函数
    const callback = function (mutationsList, observer) {

        // Use traditional 'for loops' for IE 11
        for (let mutation of mutationsList) {
            // console.log(mutation.type);
            if (mutation.type === 'childList') {
                tag();
            }
        }
    };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);
}

function view_day() {
    if (document.querySelector('#root > div > main > div > meta:nth-child(6)') == null) {
        return;
    }
    let dateCreated = document.querySelector('#root > div > main > div > meta:nth-child(6)').content;
    let dateTimestamp = new Date(dateCreated).valueOf(); //1603251465000
    let days = (new Date().valueOf() - dateTimestamp) / (1000 * 60 * 60 * 24);
    let hours = (new Date().valueOf() - dateTimestamp) / (1000 * 60 * 60);
    console.log(days);
    console.log(hours);

    let cs_view = '#root > div > main > div > div:nth-child(10) > div:nth-child(2) > div > div.QuestionHeader-content > div.QuestionHeader-side > div > div > div > div:nth-child(2) > div > strong';
    if (document.querySelector(cs_view) == null) {
        return;
    }
    let viewCount = document.querySelector(cs_view).title;
    console.log(viewCount);

    let vd = Math.round(viewCount / days)
    let vh = Math.round(viewCount / hours)


    let days_html = '<div class="NumberBoard-item"><div class="NumberBoard-itemInner"><div class="NumberBoard-itemName">' + Math.round(days) + '天</div><strong class="NumberBoard-itemValue Tag" title="' + vd + '">' + vd + '</strong></div></div>';
    let hour_html = '<div class="NumberBoard-item"><div class="NumberBoard-itemInner"><div class="NumberBoard-itemName">' + Math.round(hours) + '时</div><strong class="NumberBoard-itemValue Tag" title="' + vh + '">' + vh + '</strong></div></div>';

    let ele = document.querySelector('#root > div > main > div > div:nth-child(10) > div:nth-child(2) > div > div.QuestionHeader-content > div.QuestionHeader-side > div > div > div');
    // let ele = document.querySelector('#root > div > main > div > div:nth-child(10) > div:nth-child(2) > div > div.QuestionHeader-content > div.QuestionHeader-side');
    appendHtml(ele, days_html);
    appendHtml(ele, hour_html);

}

function appendHtml(elem, value) {
    var node = document.createElement("div"),
        fragment = document.createDocumentFragment(),
        childs = null,
        i = 0;
    node.innerHTML = value;
    childs = node.childNodes;
    for (; i < childs.length; i++) {
        fragment.appendChild(childs[i]);
    }
    elem.appendChild(fragment);
    childs = null;
    fragment = null;
    node = null;
}


// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
    if (request.cmd === 'iBtnQuestionInfo') {
        qInfo();
        sendResponse('我收到你的消息了：' + JSON.stringify(request));

    } else if (request.cmd === 'iBtnBaiduDrop') {
        dropArr = [];
        lsc('#form', () => {
            let drs = document.querySelector('#form > div > ul');
            if (drs !== null) {
                drs.childNodes.forEach(item => {
                    let kw = item.getAttribute('data-key');
                    console.log(kw);
                    if (dropArr.indexOf(kw) < 0) {
                        dropArr.push(kw);
                    }
                })
            }
        });
        sendResponse('我收到你的消息了：' + JSON.stringify(request));

    } else if (request.cmd === 'iBtnBaiduDropMobile') {
        dropArr = [];
        let cs = '#index-box > div > div.suggest-panel > div.suggest-content';
        lsc(cs, () => {
            let drs = document.querySelector(cs).querySelectorAll('button');
            if (drs !== null) {
                drs.forEach(item => {
                    console.log(item.innerText)
                    if (dropArr.indexOf(item.innerText) < 0) {
                        dropArr.push(item.innerText);
                    }
                })
            }
        });
        sendResponse('我收到你的消息了：' + JSON.stringify(request));

    } else if (request.cmd === 'iBtnBaiduDropCSV') {

        console.log("download 下拉词 csv");
        let content = dropArr.join("\n");
        downLoad(content, "下拉词.csv");
        sendResponse('我收到你的消息了：' + JSON.stringify(request));

    } else if (request.cmd === 'iBtnBaiduDropCSVMobile') {

        console.log("download Mobile 下拉词 csv");
        let content = dropArr.join("\n");
        downLoad(content, "Mobile下拉词.csv");
        sendResponse('我收到你的消息了：' + JSON.stringify(request));

    } else if (request.cmd === 'sim') {
        sim();
        sendResponse('我收到你的消息了：' + JSON.stringify(request));

    } else if (request.cmd === 'tag') {
        tag();
        sendResponse('我收到你的消息了：' + JSON.stringify(request));

    } else if (request.cmd === 'iBtnReplace') {
        replaceGoodcard();
        sendResponse('我收到你的消息了：' + JSON.stringify(request));
    } else {
        console.log(JSON.stringify(request));
        sendResponse('我收到你的消息了：' + JSON.stringify(request));
    }
});

function sim() {
    let count = 0;
    let title_arr = [];
    let list = document.querySelectorAll('#SearchMain > div > div > div h2 .Highlight');
    list.forEach(item => {
        if (title_arr.indexOf(item.innerText) < 0 && count < 5) {
            title_arr.push(item.innerText);
            count++;
        }
        console.log(item.innerText);

    });

    let obj = {};
    obj.content = document.querySelector('.Popover input').value;
    obj.list = title_arr;
    postJson('http://127.0.0.1:8090/sim/compare', obj, score);
}

function score(json) {
    console.log(json);
    if (json !== undefined && json.code === 0) {
        console.log("score");
        let list = document.querySelectorAll('#SearchMain > div > div > div h2 .Highlight');
        for (let i = json.data.length - 1; i >= 0; i--) {
            let index = json.data[i].log_id;
            let score = json.data[i].score;
            if (score < 0.5) {
                let em = document.createElement("em");
                em.innerText = '【' + score + '】';
                list[index].append(em);
            } else {
                let em = document.createElement("span");
                em.innerText = '【' + score + '】';
                list[index].append(em);
            }

        }
    }
}

function postJson(url, obj, parse) {
    fetch(url, {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            console.log(response);
            parse(response)
        });
}

function tag() {
    let A = "【回答】";
    let P = "【文章】";
    let AnswerItemList = document.querySelectorAll(".AnswerItem");
    if (AnswerItemList != null) {
        for (let i = AnswerItemList.length - 1; i >= 0; i--) {
            let spanA = document.createElement('span');
            spanA.setAttribute("class", "Button--red");
            spanA.innerText = A;
            if (AnswerItemList[i].querySelector('.Button--red') === null) {
                AnswerItemList[i].querySelector('.ContentItem-title').firstChild.prepend(spanA);
            }
        }
    }
    let ArticleItemList = document.querySelectorAll(".ArticleItem");
    if (ArticleItemList !== null) {
        for (let i = ArticleItemList.length - 1; i >= 0; i--) {
            let spanP = document.createElement('span');
            spanP.setAttribute("class", "Button--green");
            spanP.innerText = P;
            if (ArticleItemList[i].querySelector('.Button--green') === null) {
                ArticleItemList[i].querySelector('.ContentItem-title').prepend(spanP);
            }
        }
    }
}


function lsc(cs, parse) {
    console.log(lsc, cs);

    // 选择需要观察变动的节点
    const targetNode = document.querySelector(cs);


    // 观察器的配置（需要观察什么变动）
    const config = {characterData: true, attributes: true, childList: true, subtree: true,};

    // 当观察到变动时执行的回调函数
    const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        console.log('callback');

        for (let mutation of mutationsList) {
            console.log(mutation.type);
            parse();
        }
    };

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);
}


//copy
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

function replaceGoodcard() {
    let itemList = document.querySelectorAll('div[class="RichText-MCNLinkCardContainer"]');
    for (var i = itemList.length - 1; i >= 0; i--) {
        let item = itemList[i];
        let source = item.firstElementChild.getAttribute('data-mcn-source');
        if (source == undefined) {
            continue;
        }
        let skuid = item.firstElementChild.getAttribute('data-mcn-skuid');
        let title = item.querySelector('.MCNLinkCard-title').innerText;
        let content = source + "/" + skuid + "\n" + title;
        console.log(content);

        item.firstChild.remove()
        let a = document.createElement('a');
        a.setAttribute('class', "MCNLinkCard");
        a.setAttribute('href', "https://item.jd.com/" + skuid + ".html");
        a.setAttribute('target', "_blank");
        a.innerText = content;
        item.append(a);

    }
}

function downLoad(content, filename) {
    var ele = document.createElement('a');
    ele.download = filename;
    ele.style.display = 'none';
    var blob = new Blob([content]);
    ele.href = URL.createObjectURL(blob);
    document.body.appendChild(ele);
    ele.click();
    document.body.removeChild(ele);
};
