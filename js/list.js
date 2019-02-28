var columnid = getQueryStringByName('columnid');
var columnImg = getQueryStringByName('column_img'); //获取地址栏的columnid；
var app = new Vue({
    el:'#app',
    data:{
        listMsg:[],
        columnid:columnid,
        getHot:[],
        column_img:columnImg,
        scrollFlag:false,
        page:1,
        pagesize:6,
        totalpage:''
    },
    created (){
        this.getList()
        this.hotList()
        this.getHotList()
    },
    mounted(){
      console.log(this.column_img)
        this.scroll()
    },
    methods: {
        getList(){
            var that = this
            $.ajax({
                url: URL_Link + '/appapi/wx/channellist',
                type: 'get',
                dataType: 'json',
                data: {
                    id: companyId,
                    columnid:columnid,
                    page:that.page,
                    pagesize:that.pagesize
                },
                success: function (data) {
                    console.log(data)
                    if(data.state.rc>=0){
                      //that.listMsg = data.result.items
                        data.result.items.forEach(function (item,index) {
                            that.listMsg.push(item)
                        })
                      that.totalpage =Math.ceil(data.result.totalcount/that.pagesize)
                    }
                },
                error: function (data) {
                    console.log(data)
                }
            })
        },
        hotList(){
            var that = this
            $.ajax({
                url: URL_Link + '/webapi/banner/get-data',
                type: 'get',
                dataType: 'json',
                data: {
                    id: companyId,
                    type:4
                },
                success: function (data) {
                    console.log(data)
                    if(data.state.rc>=0){
                        that.listMsg = data.result.items
                    }
                },
                error: function (data) {
                    console.log(data)
                }
            })
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
        live_type (type) {
            if(type ==1){
                return "预告"
            } else if(type == 2){
                return "直播"
            }else if(type == 3){
                return "热播"
            }
        },
        scroll () {
            var that =this
            window.onscroll = function () {
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if(($(document).height()-50) <= totalheight) {
                    //console.log(that.page)
                    if(that.page<that.totalpage){
                        that.page++;
                        that.getList()
                    }
                }
            }
        }
    }


})