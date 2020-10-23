function search(keyword){
  keyword =  encodeURI(keyword);
  fetch("https://www.zhihu.com/api/v4/search_v3?t=general&q="+keyword+"&correction=1&offset=0&limit=20&lc_idx=0&show_all_topics=0",
    {
        "headers":
        {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-ab-param": "tp_clubhyb=0;li_paid_answer_exp=0;li_vip_verti_search=0;zr_sim3=0;li_edu_page=old;tsp_hotlist_ui=1;li_panswer_topic=0;zw_sameq_sorce=999;pf_adjust=0;li_catalog_card=1;tp_dingyue_video=0;li_pl_xj=0;tp_zrec=0;se_col_boost=0;ls_video_commercial=0;li_sp_mqbk=0;qap_question_author=0;zr_rec_answer_cp=open;zr_intervene=0;tp_contents=2;zr_expslotpaid=1;tp_topic_style=0;pf_creator_card=1;li_car_meta=0;li_yxzl_new_style_a=1;zr_slotpaidexp=1;qap_question_visitor= 0;pf_profile2_tab=0;li_video_section=0;top_test_4_liguangyi=1;pf_noti_entry_num=0;li_svip_tab_search=1;se_ffzx_jushen1=0",
            "x-ab-pb": "CkLzC1IL3Au5CzgL1wrXC+ALDwuWC0sL4QsADBILJwqaC2AL7ApMC1gLcguGC+QKtAo+C88LJQoBC7ULmwv0C0ILrAsSIQABAAAAAQAAAAAAAAAABgAAAQAAAAEAAAALBQAAAQAAAA==",
            "x-api-version": "3.0.91",
            "x-app-za": "OS=Web",
            "x-requested-with": "fetch",
            "x-zse-83": "3_2.0",
            "x-zse-86": "1.0_a0FqbHu067FpHhx00UF8kAX0HGtfQ8N81LSqgcUqk_xx"
        },
        "referrer": "https://www.zhihu.com/search?type=content&q="+keyword,
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response =>
    {

        let list = response.data;
        if (list !== undefined && list.length > 5)
        {
            for (var i = 0; i < 5; i++)
            {
                if (list[i].highlight !== undefined)
                {
                    let title = list[i].highlight.title;
                    title = title.replace(/<em>/g, "").replace(/<\/em>/g, "");
                    console.log(title);
                }

            }
        }
    });
}

