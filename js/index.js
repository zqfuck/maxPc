
    var app = new Vue({
        el:'#app',
        data: {
            channel_One:[],
            channel_two:[],
            channel_three:[],
            banner:[],
            channel_twoMsg:'',
            show_box:false,
            code:'',
            time:true,
            col_Id:'',
            tel:'',
            timeCount:60,
            timer:''
        },
        watch: {
            tel (newVal) {
                if (newVal.length>11){
                    this.tel = newVal.slice(0,10)
                }
            }
        },
        created:function () {
            this.getMsg()
            this.getMsg2()
            this.getMsg3()
            this.getBanner()
            setTimeout(function () {
                $(".lie_poster").hover(function () {
                    $(this).addClass("poster_hover")
                },function () {
                    $(this).removeClass("poster_hover")
                })
            },1000)
        },
        methods: {
            getMsg () {
                var that = this;
                $.ajax({
                    url:URL_Link + '/webapi/company/index',
                    type:"get",
                    dataType:"json",
                    data:{
                        id:companyId
                    },
                    success:function (data) {
                        console.log(data)
                        if(data.state.rc>=0){
                            for(var i =0 ;i<data.result.length;i++){
                                that.channel_One.push(data.result[i])
                            }
                        }
                    },
                    error:function (err) {
                        console.log(err)
                    }
                })
            },
            getMsg2 () {
                var that = this
                $.ajax({
                    url:URL_Link + '/webapi/company/time-lit',
                    type:"get",
                    dataType:"json",
                    data:{
                        id:companyId
                        //column_id:164
                    },
                    success:function (data) {
                        console.log(data)
                        if(data.state.rc>=0){
                            $.each(data.result.item,function (i, ele) {
                                that.channel_two.push(ele)
                            })
                            that.channel_twoMsg = data.result.title
                        }
                    },
                    error:function (err) {
                        console.log(err)
                    }
                })
            },
            getMsg3 () {
                var that = this
                $.ajax({
                    url:URL_Link + '/webapi/company/bottomcontents',
                    type:"get",
                    dataType:"json",
                    data:{
                        id:companyId
                    },
                    success:function (data) {
                        console.log(data)
                        if(data.state.rc>=0){
                            $.each(data.result.item,function (i, ele) {
                                that.channel_three.push(ele)
                            })
                        }
                    },
                    error:function (err) {
                        console.log(err)
                    }
                })
            },
            getBanner () {
                var that =this
                $.ajax({
                    url:URL_Link + '/webapi/banner/get-data',
                    type:"get",
                    dataType:"json",
                    data:{
                        id:companyId,
                        type:1
                    },
                    success (data) {
                        console.log(data)
                        if(data.state>=0){
                            data.data.forEach((item,index) => {
                                that.banner.push(item)
                            })
                            that.$nextTick(function () {
                                var mySwiper = new Swiper('.swiper-container', {
                                    loop: true,
                                    pagination: '.swiper-pagination', //分页器
                                    autoplay: 3000, //可选选项，自动滑动
                                    paginationElement: 'span',
                                    speed: 800, //滑动过程速度
                                    paginationClickable: true,
                                    autoplayDisableOnInteraction: false,
                                })
                            })
                        }
                    },
                    error:function (err) {
                        console.log(err)
                    }
                })
            },
            showCode (cid) {
               // $(this).prev().style.display = 'block'
                document.getElementById(cid).style.display = 'block'
            },
            hideCode (cid){
                document.getElementById(cid).style.display = 'none'
            },
            live_type (type) {
                if(type ==1){
                    return "预告"
                } else if(type == 2){
                    return "直播"
                }else if(type == 3){
                    return "热播"
                }
            },
            timeChange:function (longTime){
                var day = new Date(longTime); //将毫秒转化为当前日期
                var year = day.getFullYear();
                var month = day.getMonth()+1;
                var date = day.getDate();
                if(month<10){
                    month = "0"+month;
                }
                if(date<10){
                    date = "0"+date;
                }
                var newDay = month+"月"+date+"日 ";

                return newDay;
            },
            show_book (c_ID) {
              this.show_box = true
                this.col_Id = c_ID
                $('.book_box').css("zIndex","10")
            },
            timeOut () {
                var that = this
                if(that.checkPhone(this.tel)) {
                    let params = {
                        phone:that.tel,
                        channel:that.col_Id
                    }
                    $.ajax({
                        url: URL_Link + '/appapi/bookchannel/sendcode',
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
                            channel:that.col_Id,
                            code:that.code
                        }
                        $.ajax({
                            url: URL_Link + '/appapi/bookchannel/bookchannel',
                            type: "post",
                            dataType: "json",
                            data: JSON.stringify(params),
                            success: function (res) {
                                  console.log(res)
                                if(res.state.rc==0){
                                    showTip("订阅成功")
                                    that.tel = ''
                                    that.code = ''
                                    that.show_box = false
                                    clearInterval(timer)
                                    that.time = !that.time
                                    that.timeCount = 60
                                }else {
                                    showTip("您已经订阅过此内容")
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
                clearInterval(timer)
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
        }
    })








