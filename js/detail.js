
var cid = getQueryStringByName('cid');
var columnid = getQueryStringByName('columnid');
var timer = null;
var app = new Vue({
    el:'#app',
    data:{
        male:true,
        otherItem:[],
        //show_book:false,
        video_name:null,
        time_count:null,
        live_start:null,
        getHot:[],
        content_img:'',
        poster:'',
        live_type:'',
        watch_type:'',
        pv:'',
        like:'',
        product_link:'',
        tid:'',
        qr_code:'',
        show_code:false,
        passCode:'',
        dott:[],//打点数组
        video_url:null,
        videoObject:{},
        content_desc:null, //内容介绍
        column_desc:null, //频道介绍
        guest_relevance:[],//嘉宾相关视频
        guest:[],//本期嘉宾,
        recommend_data:[], //精彩推荐
        show_box:false,
        code:'',
        time:true,
        col_Id:'',
        tel:'',
        timeCount:60,
        hover_timer:null
    },
    created (){
        this.getDetail()
        this.getOthers()
        this.getHotList()
        setTimeout(function () {
            $('#dot1').dotdotdot();
            $('#dot2').dotdotdot();
        },300)
    },
    methods:{
        getDetail(){
            var that = this
            $.ajax({
                url: URL_Link + '/webapi/company/contentdetails',
                type: 'get',
                dataType: 'json',
                data: {
                    cid:cid,
                    type:1
                },
                success: function (data) {
                    console.log(data)
                    if(data.state.rc>=0){
                        let result = data.result
                        that.video_name = result.detail_data.name
                        that.poster = result.detail_data.content_img
                        that.pv = result.detail_data.pv
                        that.live_type = result.detail_data.live_type
                        that.watch_type = result.detail_data.watch_type
                        that.like = result.detail_data.like
                        that.product_link = result.detail_data.product_link
                        that.content_img = result.detail_data.content_img
                        that.tid = result.detail_data.tid
                        that.qr_code = result.detail_data.qr_code
                        that.video_show = result.detail_data.live_type
                        that.video_url = result.detail_data.video_url
                        that.content_desc = result.detail_data.content_desc
                        that.column_desc = result.detail_data.column_desc
                        that.guest = result.guest_data
                        that.guest_relevance = result.guest_relevance
                        that.recommend_data = result.recommend_data
                        that.$nextTick(() => {
                            var mySwiper = new Swiper('.swiper-container', {
                                slidesPerView : 2,
                                /* autoplay: 3000, //可选选项，自动滑动*/
                                spaceBetween : 30,
                                paginationElement: 'span',
                                speed: 800, //滑动过程速度
                                paginationClickable: true,
                                autoplayDisableOnInteraction: false,
                            })
                            var mySwiper2 = new Swiper('.swiper-container2', {
                                slidesPerView : 3,
                                /* autoplay: 3000, //可选选项，自动滑动*/
                                spaceBetween : 30,
                                paginationElement: 'span',
                                speed: 800, //滑动过程速度
                                paginationClickable: true,
                                autoplayDisableOnInteraction: false,
                            })
                        });
                        if(that.live_type==1){
                            that.live_start = result.detail_data.live_start
                            if (that.watch_type==2||that.watch_type==3){
                                $("#book_btn").show()
                            }
                            that.leftTime(that.live_start)
                            var timer = setInterval( () => {
                                if(that.live_start - (new Date().getTime())<=0){
                                    clearInterval(timer)
                                }
                                that.leftTime(that.live_start)
                            },1000)
                        }else {
                            if (that.watch_type==1){
                                $(".passBox").show()
                                that.dott = result.make_data
                                var str = '<img style="width: 100%;height: 100%;" src='+that.poster+' alt="">'
                                $("#video").append(str)
                            }else {
                                that.dott = result.make_data
                                var dottParams = [];
                                that.dott.forEach(function (item,index) {
                                    dottParams.push({
                                        words:item.title,
                                        time:item.time,
                                        imgs:item.make_img
                                    })
                                })
                                var videoObject = {
                                    container: '#video', //容器的ID或className
                                    variable: 'player',//播放函数名称
                                    poster:that.poster,//封面图片
                                    //flashplayer:true,
                                    video: [
                                        [that.video_url, 'video/mp4', '中文标清', 0]

                                    ],//视频地址
                                    promptSpot:dottParams,
                                    /*promptSpot: [ //提示点
                                        {
                                            words: '暗示法根',
                                            time: 30,
                                            imgs:'material/poster.jpg'
                                        },
                                        {
                                            words: '提示点文字',
                                            time: 150,
                                            imgs:'material/poster.jpg'
                                        }
                                    ],*/
                                };
                                var player = new ckplayer(videoObject);
                            }


                        }
                    }
                },
                error: function (data) {
                    console.log(data)
                }
            })
        },
        pass_watch(){
           var that =this
            $.ajax({
                url: URL_Link + '/appapi/wx/authorize',
                type: 'get',
                dataType: 'json',
                data: {
                    id:cid,
                    code:that.passCode
                },
                success: function (data) {
                    if (data.state.rc>=0){
                        $("#video img").remove()
                        showTip("恭喜您验证通过")
                        $(".passBox").hide()
                        console.log( that.dott)
                        var dottParams = [];
                        that.dott.forEach(function (item,index) {
                            dottParams.push({
                                words:item.title,
                                time:item.time,
                                imgs:item.make_img
                            })
                        })
                        var videoObject = {
                            container: '#video', //容器的ID或className
                            variable: 'player',//播放函数名称
                            poster:that.poster,//封面图片
                            //flashplayer:true,
                            video: [
                                [that.video_url, 'video/mp4', '中文标清', 0]

                            ],//视频地址
                            promptSpot:dottParams
                        };
                        var player = new ckplayer(videoObject);
                    }else {
                        showTip("密码错误")
                    }
                },
                error: function (data) {
                    console.log(data)
                    showTip("鉴定失败")
                }
            })
        },
        head_over(id){
            $(".mineVideo").addClass("hidden")
            $("#"+id).removeClass("hidden")
        },
        head_out(id){
            var that =this
            that.hover_time = setTimeout( () => {
                $("#"+id).hover(function () {
                    clearTimeout(that.hover_time)
                    $("#"+id).removeClass("hidden")
                },function () {
                    $(".mineVideo").addClass("hidden")
                })
                $(".mineVideo").addClass("hidden")
            },2000)
        },
        showCode () {
            this.show_code = true
        },
        hideCode (){
            this.show_code = false
        },
        getHotList(){
            var that = this
            $.ajax({
                url: URL_Link + '/webapi/banner/get-data',
                type: 'get',
                dataType: 'json',
                data: {
                    id: companyId,
                    type:8
                },
                success: function (data) {
                    console.log(data)
                    if(data.state>=0){
                        that.getHot = data.data
                    }
                },
                error: function (data) {
                    console.log(data)
                }
            })
        },
        getOthers(){
            var that = this
            var msg = {
                cid:cid,
                column_id:columnid
            }
            $.ajax({
                url: URL_Link + '/webapi/company/other-content',
                type: 'post',
                dataType: 'json',
                data: JSON.stringify(msg),
                success: function (data) {
                    console.log(data)
                    if(data.state.rc>=0){
                        that.otherItem = data.result.item
                    }
                },
                error: function (data) {
                    console.log(data)
                }
            })
        },
        clickLike (){
            var that = this
            let params = {
                topic_id:that.tid
            };
            params = JSON.stringify(params)
            $.ajax({
                url: URL_Link + '/like',
                type: 'post',
                dataType: 'json',
                data: params,
                success: function (data) {
                    console.log(data)
                    if(data.state>=0){
                        if(data.msg=="Success"){
                            that.like = data.likes
                        }else {
                            showTip(data.msg)
                        }

                    }
                },
                error: function (data) {
                    console.log(data)
                }
            })
        },
        leftTime (time){
            if(time<=86400000){
                var leftTime = time - (new Date().getTime()); //计算剩余的毫秒数
                var hours = parseInt(leftTime / 1000 / 60 / 60 , 10); //计算剩余的小时
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
                var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
                hours = this.checkTime(hours);
                minutes = this.checkTime(minutes);
                seconds = this.checkTime(seconds);
                this.time_count = hours+"小时" + minutes+"分"+seconds+"秒";
            }else{
                $("#begin_txt").html("敬请期待")
                var day = new Date(time); //将毫秒转化为当前日期
                var year = day.getFullYear();
                var month = day.getMonth()+1;
                var date = day.getDate();
                var hour = day.getHours();
                var minutes = day.getMinutes();
                if(month<10){
                    month = "0"+month;
                }
                if(date<10){
                    date = "0"+date;
                }
                if(hour<10){
                    hour = "0"+hour;
                }
                if(minutes<10){
                    minutes = "0"+minutes;
                }
                this.time_count = year+"年"+month+"月"+date+"日"+hour+"时"+minutes+"分";
            }
        },
        checkTime (i){
            if(i<10) {
                i = "0" + i;
            }
            return i;
        },
        show_book () {
            this.show_box = true
            $('.bookBox').css("zIndex","10")
        },
        timeOut () {
            var that = this
            if(that.checkPhone(this.tel)) {
                let params = {
                    phone:that.tel,
                    id:cid,
                    type:1
                }
                $.ajax({
                    url: URL_Link + '/appapi/wx/sendcode',
                    type: "get",
                    dataType: "json",
                    data:params,
                    success: function (res) {
                        console.log(res)
                        if (res.state.rc == -1) {
                            showTip(res.state.msg)
                            that.tel = ''
                            that.code = ''
                            that.show_box = false
                        } else {
                            that.time = false
                            showTip("短信验证码已发送您的手机")
                            timer = setInterval(() => {
                                that.timeCount--
                                if (that.timeCount < 0) {
                                    clearInterval(timer)
                                    that.time = !that.time
                                    that.timeCount = 60
                                }
                            }, 1000)
                        }
                    },
                    error: function () {

                    }
                })
            }else{
                showTip("请输入正确手机号")
            }
        },
        book(){
            var that = this
            if(that.checkPhone(this.tel)){
                if(that.code!=''){
                    var params = {
                        phone:that.tel,
                        id:cid,
                        imgcode:that.code,
                        type:1
                    }
                    $.ajax({
                        url: URL_Link + '/appapi/wx/book',
                        type: "get",
                        dataType: "json",
                        data: params,
                        success: function (res) {
                            console.log(res)
                            if(res.state.rc==0){
                                showTip("预约成功")
                                that.tel = ''
                                that.code = ''
                                that.show_box = false
                                clearInterval(timer)
                                that.time = true
                                that.timeCount = 60
                            }else {
                                showTip("您已经预约过此内容")
                                that.tel = ''
                                that.code = ''
                                that.show_box = false
                            }
                        },
                        error: function () {

                        }
                    })
                }else {
                    showTip("请输入验证码")
                }
            }else {
                showTip("请填写正确手机号")
            }
        },
        cancel () {
            this.show_box = false
            this.tel = ''
            this.code = ''
            this.show_box = false
            if(timer){
                clearInterval(timer)
            }
            this.time = true
            this.timeCount = 60
        },
        checkPhone (phone) {
            var len = phone.length;
            if (len != 11 || !this.isPhoneNumber(phone)) {
                return false;
            }
            return true;
        },
        isPhoneNumber (phoneNumber) {
            var isPhone = true;
            if (phoneNumber == null || phoneNumber == '') {
                isPhone = false;
            }
            if (phoneNumber.length != 11) {
                isPhone = false;
            }
            var str = "^[1][3,4,5,7,8,9][0-9]{9}$";
            //var str=/^[1][3,4,5,7,8][0,9]{9}$/;
            if (!phoneNumber.match(str)) {
                isPhone = false;
            }
            return isPhone;
        }
    },
    watch:{

    }


})