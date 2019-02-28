/**
 * Created by Administrator on 2018/1/24.
 */


var URL_Link = 'http://livetapi.v114.com';
var companyId = 'ODY=';//测试企业Id;
var columnid = getQueryStringByName('columnid');   //获取地址栏的columnid；



$(document).ready(function () {
    $("#rank").click(function () {
        $('.topHot').empty();
        $.ajax({
            url:URL_Link + '/webapi/banner/get-data',
            type:'get',
            dataType:'json',
            data:{
                id:companyId,
                type:2
            },
            success:function (data) {
                console.log(data)
                if (data.state >= 0) {
                    var data = data.data;
                    var nameLink = 'detail.html?cid='
                    $.each(data, function (i, ele) {
                        var commentList = {
                            nameSearch: ele.title,
                            top: i + 1,
                            nameLink: nameLink+ele.cid+"&qy_companyid="+ companyId
                        };
                        var chatHtml;
                        chatHtml = $("#topList").render(commentList);
                        $('.topHot').append(chatHtml);
                        $(".topBj").eq(0).css({"background": "#ee3e3e"});
                        $(".topBj").eq(1).css({"background": "#ee993e"});
                        $(".topBj").eq(2).css({"background": "#eedf3e"});
                    })
                }
            },
            error:function (err) {
                console.log(err)
            }

        })
        $(".rank_box").show()
    });
    $("#close_rank").click(function () {
        $(".rank_box").hide()
    });
    $("#search").click(function () {
        $(this).hide()
        $("#close").show()
        $(".searchBox").show()

        $("#search_val").keyup(function () {
            $('.listL').empty();
            // $('.nameList').css({'height':"auto","overflow-y":"auto"});

            val = $.trim($("#search_val").val());
            searchList();
        });
        $("#close").click(function () {
            $("#close").hide()
            $(".searchBox").hide()
            $('.listL').empty();
            $("#search").show()
            $("#search_val").val('')
            $(".search_list").addClass("hidden");
        })

        //搜索
        function searchList() {
            $.ajax({
                url: URL_Link + '/appapi/wx/search',
                type: "get",
                dataType: "json",
                cache: false,
                data: {
                    id: companyId,
                    value: val
                },
                error: function (data) {
                    console.log(data);
                },
                success: function (data) {
                    console.log(data)
                    if (data.state.rc == 0) {
                        $('.listL').empty();
                        var result = data.result.items;
                        var nameLink = 'detail.html?cid='
                        $.each(result, function (i, ele) {
                            var commentList = {
                                nameSearch: ele.name,
                                nameLink: nameLink+ele.cid+"&columnid="+ele.column_id
                            };
                            var chatHtml;
                            chatHtml = $("#nameList").render(commentList);
                            $('.listL').append(chatHtml);
                            $(".search_list").removeClass("hidden");
                        })
                    }else {
                        $('.listL').empty();
                        var st ='<p>暂无搜索内容</p>'
                        $('.listL').append(st);
                        $(".search_list").removeClass("hidden");
                    }
                }
            });
        };
    })
})


/*显示提醒*/
function showTip(msg) {
    var topTip = $("<div class='tip'><div class='fadeIn'>" + msg + "</div></div>");
    $("body").append(topTip);
    setTimeout(function () {
        topTip.remove();
    }, 2000);
}
//显示错误提醒
function showError(className) {
    $("." + className + "").css({"visibility": "visible"});
    setTimeout(
        function () {
            $("." + className + "").css({"visibility": "hidden"});
        }, 2000);
};

//实现滚动条无法滚动
var mo = function (e) {
    e.preventDefault();
};
/***禁止滑动***/
function stop() {
    document.body.style.overflow = 'hidden';
    document.addEventListener("touchmove", mo, false);//禁止页面滑动
}
/***取消滑动限制***/
function move() {
    document.body.style.overflow = '';//出现滚动条
    document.removeEventListener("touchmove", mo, false);
}


function focusId(id) {
    if (id.length > 0) {
        var input = document.getElementById(id);
        var val = input.value;
        input.value = "";
        input.value = val;
        document.getElementById(id).focus();
    }
};


function isPhoneNumber(phoneNumber) {
    var isPhone = true;
    if (phoneNumber == null || phoneNumber == '') {
        isPhone = false;
    }
    if (phoneNumber.length != 11) {
        isPhone = false;
    }
    var str = "^[1][3,4,5,7,8][0-9]{9}$";
    //var str=/^[1][3,4,5,7,8][0,9]{9}$/;
    if (!phoneNumber.match(str)) {
        isPhone = false;
    }
    return isPhone;
}




// 验证码倒计时
function setRemainTime() {

    if (count <= 0) {
        //	$("#generCode").removeClass("bcolor3").addClass("bcolor2");
        $("#stext").show();
        $("#timer").hide();
        count = 60;
        generate = false;
    } else {
        //	$("#generCode").removeClass("bcolor2").addClass("bcolor3");
        $('#timer').html(count + 's后重发');
        count--;
        setTimeout(setRemainTime, 1000);
    }
};
function checkPhone(phone) {

    var len = phone.length;
    if (len != 11 || !isPhoneNumber(phone)) {
        return false;
    }
    return true;
};
//获取地址栏参数
function getQueryStringByName(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
};
//支持中文获取
function getUrlParam(key) {
    // 获取参数
    var url = window.location.search;
    // 正则筛选地址栏
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    // 匹配目标参数
    var result = url.substr(1).match(reg);
    //返回参数值
    return result ? decodeURIComponent(result[2]) : null;
}

//title
//var qy_CompanyId = getCompanyId('qy_companyid') ? getCompanyId('qy_companyid') : company_id;
//localStorage.companyId = localStorage.companyId ? localStorage.companyId : qy_CompanyId;
//获取标题
//acquireTitle();
function acquireTitle() {
    $.ajax({
        url: "http://livetapi.v114.com/appapi/wx/title",
        type: "get",
        dataType: "json",
        data: {
            id: company_id,
        },
        error: function (data) {
            console.log(data);
        },
        success: function (data) {
            console.log(data)
            if (data.state.rc == 0) {
                var qy_title = data.state.title;
                localStorage.qy_title = qy_title;//存储企业title
                $("title").html(qy_title);
            }
        }
    })
};

/*
//本地遍历导航列表
var navArr = [];//导航标题
var comidArr = [];//频道id

if (localStorage.navArr) {
    $("#title").empty();
    var str = '';
    $.each(JSON.parse(localStorage.navArr), function (i, ele) {
        str += '<li><a href="list.html?qy_companyid=' + companyId + '&columnid=' + (JSON.parse(localStorage.comidArr))[i] + '">' + ele + '</a></li>';
    });
    $("#title").append(str);
    for (var i = 0; i < JSON.parse(localStorage.comidArr).length; i++) {
        if ((JSON.parse(localStorage.comidArr))[i] == columnid) {
            $(".nav .title a").removeClass("active_title");
            $(".nav .title a").eq(i).addClass("active_title");

        }
    }
}*/

//频道导航列表
var comidArr = [];//频道id
$.ajax({
    url: URL_Link + '/company/live/channellist',
    type: "get",
    dataType: "json",
    cache: false,
    data: {
        id: companyId
    },
    error: function (data) {
        console.log(data);
    },
    success: function (data) {
       // console.log(data)
        if (data.state.rc >= 0) {
            var result = data.result.slice(0,9);
            // console.log(result);
           /* if (!localStorage.navArr) {*/
                var str = '';
                $.each(result, function (i, ele) {
                    //navArr.push(ele.column_name);
                    comidArr.push(ele.column_id);
                    str += '<li>' +
                        '<a href="list.html?qy_companyid=' + companyId + '&columnid=' + ele.column_id +'&column_img=' + ele.column_img +'">'
                        + ele.column_name + '</a>' +
                        '</li>';
                });
                $("#title").append(str);

                if (!columnid) {
                   // $(".menu_Nav span a").eq(0).addClass("spanActive");
                } else {
                    for (var i = 0; i < comidArr.length; i++) {
                        if (comidArr[i] == columnid) {
                            $(".nav .title a").removeClass("active_title");
                            $(".nav .title a").eq(i).addClass("active_title");
                        }
                    }
                }
               /* localStorage.navArr = JSON.stringify(navArr);
                localStorage.comidArr = JSON.stringify(comidArr);
            } else {
                $.each(result, function (i, ele) {
                    navArr.push(ele.column_name);
                    comidArr.push(ele.column_id);
                });

                localStorage.navArr = JSON.stringify(navArr);
                localStorage.comidArr = JSON.stringify(comidArr);
            }*/
        }
    }
});































