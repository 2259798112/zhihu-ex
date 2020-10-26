
function parse(url){

    fetch(url, {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(res => res.text())
        .catch(error => console.error('Error:', error))
        .then(response => {
            // console.log(response);
            let domparser = new DOMParser();
            let doc = domparser.parseFromString(response, 'text/html');
            let initData = doc.querySelector('#js-initialData').innerText;
            let data = JSON.parse(initData);
            // console.log(data);
            let urls = url.split('/');
            let span = parseInitData(data,urls[urls.length -1 ]);
            document.querySelector('meta[content="'+url+'"]').parentNode.prepend(span);
        });
}


function parseInitData(json,id) {
    let q = json.initialState.entities.questions[id];

    let now = new Date().valueOf();
    let days = Math.round((now - (1000 * q.created)) / (1000 * 60 * 60 * 24));

    let answerCount = q.answerCount;
    let visitCount = q.visitCount;
    let dv = Math.round(visitCount/days);

    // console.log(days);
    // console.log(answerCount);
    // console.log(visitCount);
    // console.log(dv);

    let answers = json.initialState.entities.answers;
    let defaultAnswerVoteCount = '';
    for (let key in answers)
    {
        let vc =  answers[key].voteupCount;
        defaultAnswerVoteCount += vc + ',';

    }
    console.log(defaultAnswerVoteCount)
    
    let div = document.createElement("div");
    div.setAttribute("class" ,"done");

    questionInfoTag(div,'天',days);
    questionInfoTag(div,'回答',answerCount);
    questionInfoTag(div,'日增',dv);
    questionInfoTag(div,'浏览',visitCount);
    // questionInfoTag(div,'5答',defaultAnswerVoteCount);

    return div;
}

function questionInfoTag(ele,key, value) {
    //<button aria-label="赞同 56 " type="button" class="Button VoteButton VoteButton--up">赞同 56</button>
    let span_day = document.createElement("span");
    span_day.setAttribute('class','Button Button--blue');
    if (key === '回答' && value < 5){
        span_day.setAttribute('class','Button Button--red');
    }
    span_day.innerText = key +' : '+ value;

    ele.append(span_day);
}

function qInfo() {

    let qList = document.querySelectorAll('#SearchMain div[itemprop="zhihu:question"]')
    qList.forEach(item =>{
        //item 没有 .done
        if(item.querySelector('.done') == null){

            let url = item.querySelector('meta[itemprop="url"]').content;
            console.log(url);
            parse(url);

        }else {

        }

    })

}