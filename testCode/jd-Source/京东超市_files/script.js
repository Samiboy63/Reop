/*
 * author: luxingyuan@jd.com
 * date: 2015-7-30
 * version: 1.2.0
 */

/*
 * 解决地址中的乱码字符,通过<、>识别，防止xss攻击  2016-01-28  tanhongzhao
 * 注意：如果存在，就会把地址后面所有的参数强制删除
 */
(function() {
    var h = document.location.hash;
    var s = document.location.search;
    var href = document.location.href;
    href = href.substring(0, href.indexOf("?"));
    var a = [h, s];
    for (var i = 0, len = a.length; i < len; i++) {
        var item = a[i];
        if (item.indexOf('<') !=-1 || item.indexOf('>') !=-1) {
            document.location.href = href;
        }
    }
})();


/*
 * 二级域名以及接口梳理
 */
var SLD = {
    actJshop : '//act-jshop.jd.com', //JSHOP提供的act接口,
    sale : '//'+ window.location.hostname,//以前固定为sale.jd.com，现在改为根据域名自动识别
    m : '//m.jd.com', //m端公共接口
    p : '//p.3.cn', //京东价
    pm : '//pm.3.cn',//手机价
    portal : '//portal.m.jd.com',    //促销商品（无线下拉）
    passport : '//passport.m.jd.com', // 登录
    paimai : '//paimai.jd.com', //拍卖
    mpaimai:'//mpaimai.jd.com', //m拍卖
    ls : '//ls.activity.jd.com',  //中奖信息
    l : '//l.activity.jd.com',//抽奖及次数
    item : '//item.m.jd.com',  //商品详情页
    rank : '//rank.m.jd.com',    //调用二级分类类目的地址及商品列表地址（热门排行榜）
    activity : '//activity.jd.com',  //投票
    //daojia : '//testpdjm.jd.com',  //京东到家
    daojia : '//prepdjm.jd.com'  //京东到家
};
var INTERFACE = {
    actJshop:{
        isLogin : SLD.actJshop + '/m/islogin.html',    //是否登录
        serverTime : SLD.actJshop + '/serverTime.html', //获取服务器时间
        ad : SLD.actJshop + '/ad.html',  //获取广告位
        ms : SLD.actJshop + '/ms.html',  //获取促销推荐商品状态
        promo : SLD.actJshop + '/mobPromo.html', //获取促销接龙商品信息
        follow : SLD.actJshop + '/mobShopFollow.html',  //获取关注店铺信息
        exchCoupon: SLD.actJshop + '/couponExchange.html',   //使用京豆去换券
        beanNum : SLD.actJshop + '/jbn.html'            //获取京豆数量
    },
    mCommon:{
        header : SLD.m + '/app/header.action', //获取京东公共头部
        footer : SLD.m + '/app/footer.action',  //获取京东公共尾部
        product : SLD.m + '/product/',   //获取商品详情
        addCart : SLD.m + '/cart/add.json'  //加入购物车
    },
    price:{
        jd : SLD.p + '/prices/mgets', //获取商品京东价
        jdMobile : SLD.pm + '/prices/mgets', //获取商品App专享价（手机）
        jdMpcp: SLD.pm + '/prices/pcpmgets' //m版获取商品的app价，京东价（如果有返回则一起返回）
    },
    portal : SLD.portal + '/client.action', //获取促销商品信息（无线下拉）
    paimai : SLD.paimai + '/services/currentList.action', //获取拍卖商品实时数据
    mpaimai : SLD.mpaimai + '/json/current/queryProAccess', //获取m拍卖商品围观次数
    lottery : {
        getWinnerList : SLD.ls + '/lotteryApi/getWinnerList.action', //获取中奖信息查询
        getLotteryInfo : SLD.ls + '/lotteryApi/getLotteryInfo.action', //获取抽奖基本信息
        lotteryStart : SLD.l + '/mobile/lottery_start.action', //获取抽奖
        lotteryChance : SLD.l + '/mobile/lottery_chance.action' //获取剩余抽奖次数
    },
    linkItem : SLD.item + '/ware/view.action',  //商品详情页
    rankData : SLD.rank + '/rankData' , //获取热门排行榜商品列表信息
    saleModule : SLD.sale + '/module/', //获取活动模块
    activety : {
        vote : SLD.activity + '/vote/vote.action', //根据传传入投票id、投票项id，用户pin等获取回传状态，提示内容，得票数
        getCount : SLD.activity + '/vote/getCount.action' //根据传入的投票项id串，批量获取投票数
    },
    passport : {
        login : SLD.passport + '/user/login.action' // 前往登录
    },
    daojiaActivity:{
        actInfo : SLD.daojia +'/client?functionId=jshopAct/getActivityFLoor', //京东到家获取活动信息
        actPreviewInfo : SLD.daojia + '/client?functionId=jshopAct/getOfflineActivityFLoor', //京东到家装修预发获取活动信息
        pageSkip : SLD.daojia + '/html/index.html', //京东到家页面跳转
        gpsPos : SLD.daojia + '/client?functionId=local/getAddressN'//根据gps坐标转换为相应的地址信息
    }
};
/*
 * global extention for window
 */

(function(w){
    //根据业务需要当在app内部访问m端页面的时候强制转换地址为app地址，即将/m/替换为/app/
    //新增规则限制  京东微联APP中活动不做跳转（ua参数为jdsmart）  2016-3-3
    var userAgentType = w.navigator.userAgent.toLowerCase(),
        _beforeUrl = w.location.href,
        _nowUrl;
    if(userAgentType.indexOf("jdapp") != -1 && userAgentType.indexOf("jdsmart") == -1 && _beforeUrl.indexOf("/m/") != -1){
        _nowUrl = _beforeUrl.replace(/\/m\//,"/app/");
        w.location.href = _nowUrl;
    }

    //根据页面宽度重新设置模块高度
    var winWidth = window.innerWidth;
    $(".outer-container > div").each(function(){
        var height = parseFloat($(this).css("height")),
            coefficient = $(this).attr("coefficient") || 0;
        height += (winWidth - 320) * coefficient;
        if(~~height){
            $(this).css("height", ~~height);
        }
    });

    //给全局添加base对象，里面封装了一些基本api
    if(typeof jshop == 'undefined'){
        w.jshop = {};
    }

    jshop.mModule = typeof jshop.mModule === "undefined"? {}: jshop.mModule;
    jshop.slideTimer = typeof jshop.slideTimer === "undefined"? {}: jshop.slideTimer;
    jshop.countDownTimer = typeof jshop.countDownTimer === "undefined"? {}: jshop.countDownTimer;


    var Base = {

        css3Prefix: (function(){
            var divTemp = document.createElement("div"),
                arrCss = ["","webkit","moz","ms"],
                obj = {TRANSFORM: "", TRANSITION: "",TRANSITIONEND:""};
            for(var i = 0; i < arrCss.length; i++){
                var test = arrCss[i]? (arrCss[i] + "Transform"): "transform";
                if(test in divTemp.style){
                    obj.TRANSFORM = test;
                    break;
                }
            }
            for(i = 0; i < arrCss.length; i++){
                test = arrCss[i]? (arrCss[i] + "Transition"): "transition";
                if(test in divTemp.style){
                    obj.TRANSITION = test;
                    var temp =  obj.TRANSITION === "transition" ? "end" :"End";
                    obj.TRANSITIONEND = test + temp;
                    break;
                }
            }
            return obj;
        })(),

        /**
         * 获取sid。优先从url中获取，再从cookie中获取
         * @return string
         */
        getSid: function(){
            var urlParam = this.getURLParams();
            if(urlParam.sid) return urlParam.sid;
            var cookies = document.cookie,
                arrCookie = cookies.split(';'),
                ele = null;
            for(var i=0; i<arrCookie.length; i++){
                ele = arrCookie[i].split('=');
                if(ele[0] == ' sid' || ele[0] == 'sid'){
                    return ele[1];
                }
            }
            return "";
        },

        /**
         * 判断是否登录
         * @param successFun
         * @param failFun
         */
        checkLogin: function(successFun, failFun){
            var sid = this.getSid();
            $.ajax({
                url : INTERFACE.actJshop.isLogin,
                dataType: "jsonp",
                data : {"sid": sid},
                success : function(data){
                    if(data.isLogined){
                        window.isLogined = true;
                        typeof successFun === "function" && successFun(data);
                    }else{
                        typeof failFun === "function" && failFun(data);
                    }
                },
                error: function(){
                    console.error("FUN[checkLogin]请求检测是否登录，后台未成功响应");
                }
            });
        },

        /**
         * 获取url传参
         * @return {{}}
         */
        getURLParams : function(){
            var args = {},
                qry = location.search.substring(1),
                pairs = qry.split("&");
            for(var i = 0; i < pairs.length; i++){
                var pos = pairs[i].indexOf('=');
                if(pos==-1)  continue;
                var argname = pairs[i].substring(0, pos),
                    val = pairs[i].substring(pos + 1);
                args[argname] = decodeURIComponent(val);
            }
            return args;
        },

        mouseCoords : function(ev){
            if(ev.pageX){
                return {x:ev.pageX,y:ev.pageY};
            }
            return {
                x : ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y : ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        }
    };
    //新增除去pc判断windows和mac
    if(w.navigator.platform != "Win32" && w.navigator.platform != "Win64" && w.navigator.platform != "MacIntel"){
        //新增规则，如果打开为wp手机(无论是app还是浏览器)或者为ios和Android非客户端，并且为app型活动/app/,同时不带参数accessType=intact，则强制替换为m型活动  2016-3-16
        //新增京东app标识符配置
        var jdAppType = $("#jdAppType").val().split(","),noAppState = true;
        for(var i = 0; i < jdAppType.length;i++){
            if(userAgentType.indexOf(jdAppType[i]) != -1){
                noAppState =  false;
                break;
            }
        }
        if((userAgentType.indexOf("Window Phone") != -1 || noAppState) && Base.getURLParams()["accessType"] != "intact" && _beforeUrl.indexOf("/app/") != -1){
            _nowUrl = _beforeUrl.replace(/\/app\//,"/m/");
            w.location.href = _nowUrl;
        }
    }


    jshop.getPageTime = {};
    var _mobAppId = "jshopPageTimeObj";
    //判断是装修态还是浏览态，设置jshop.serverTimeCallback每个page标识符
    if(!$("#mobAppId").length){
        var _urlArr = window.location.href.split("&");
        _urlArr.forEach(function(item, index){
            if(item.indexOf("veBean.appId") != -1){
                _mobAppId = item.split("#")[0].split("=")[1];
            }
        })
    }else{
        _mobAppId = $("#mobAppId").length ? $("#mobAppId").val():"jshopPageTimeObj";
    }
    jshop.getPageTime[_mobAppId] = {
        getServerTime:0,
        getLocalTime:0,
        serverTimeCallback:[]
    }
    //get service time
    w.getServerTime = function(callback){
        //判断是否已经请求过服务器时间，没有就请求，有就根据时间戳得到当前服务器时间
        if(jshop.getPageTime[_mobAppId].getServerTime === 0){
            jshop.getPageTime[_mobAppId].serverTimeCallback.push(callback);
            if(jshop.getPageTime[_mobAppId].serverTimeCallback.length === 1){
                var _serverTimeUrl = INTERFACE.actJshop.serverTime;
                $.ajax({
                    url: _serverTimeUrl,
                    dataType: "jsonp",
                    success: function(data) {
                        var serverDate = data.nowTime ? new Date(data.nowTime) : new Date();
                        jshop.getPageTime[_mobAppId].getServerTime = serverDate.getTime();
                        jshop.getPageTime[_mobAppId].getLocalTime = (new Date()).getTime();
                        jshop.getPageTime[_mobAppId].serverTimeCallback.forEach(function(itmeFn, index) {
                            if (itmeFn) {
                                itmeFn(serverDate);
                            }
                        });
                        jshop.getPageTime[_mobAppId].serverTimeCallback = [];
                    }
                });
            }
        }else{
            var _nowLocalTime = (new Date()).getTime();
            var _nowServerTime = jshop.getPageTime[_mobAppId].getServerTime + (_nowLocalTime - jshop.getPageTime[_mobAppId].getLocalTime);
            var _nowDate = new Date(_nowServerTime);
            callback(_nowDate);
        }
    };
//    //get service time
//    w.getServerTime = function(callback){
//        var url = 'http://act.jshop.jd.com/serverTime.html';
//        $.ajax({
//            url : url,
//            dataType: "jsonp",
//            success: function(data){
//                callback(data.nowTime? new Date(data.nowTime): new Date());
//            }
//        });
//    };

    w.Base = Base;
})(window);

(function(w){
    var userAgentType = w.navigator.userAgent.toLowerCase();
    function WXShareBox(options){
        var defaultOptions = {
            "appid":"",    //appid 默认为空。
            "img_url":"",  //分享时所带的图片路径
            "img_width": "120", //图片宽度
            "img_height":"120", //图片高度
            "link":window.location.href, //分享附带链接地址
            "desc":document.title, //分享内容介绍
            "title":document.title //分享标题介绍
        },_this = this;
        var nowOptions = $.extend(defaultOptions,options);
        if(nowOptions.img_url.substring(0,2) == "//"){
            nowOptions.img_url = "http:" + nowOptions.img_url;
        }
        // 当微信内置浏览器初始化后会触发WeixinJSBridgeReady事件。
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            // 发送给好友
            WeixinJSBridge.on('menu:share:appmessage', function (argv) {
                _this.shareFriend(nowOptions);
            });
            // 分享到朋友圈
            WeixinJSBridge.on('menu:share:timeline', function (argv) {
                _this.shareTL(nowOptions);
            });
            // 分享到微博
            WeixinJSBridge.on('menu:share:weibo', function (argv) {
                _this.shareWB(nowOptions);
            });
        }, false);
    }
    WXShareBox.prototype.shareFriend = function(options){
        WeixinJSBridge.invoke('sendAppMessage', options, function (res) {
            _report('send_msg', res.err_msg);
        });
    };
    WXShareBox.prototype.shareTL = function(options){
        WeixinJSBridge.invoke('shareTimeline',options, function (res) {
            _report('timeline', res.err_msg);
        });
    };
    WXShareBox.prototype.shareWB = function(options){
        WeixinJSBridge.invoke('shareWeibo',options, function (res) {
            _report('weibo', res.err_msg);
        });
    };
    function jshopWXShare(options){
        if(typeof options == "object"){
            return new WXShareBox(options);
        }
    }
    function appShareBox(options){
        var _appType = options.appType,defaultOptions,_this = this;
        switch (_appType){
            case "jdLocal":
                defaultOptions = {
                    "link":window.location.href, //分享附带链接地址
                    "title":document.title, //分享标题介绍
                    "desc":document.title, //分享内容介绍
                    "imgUrl":"" //分享时所带的图片路径
                };
                _this.appType = 'jdLocal';
                break;

        }
        _this.nowOptions = $.extend(defaultOptions,options);
        _this.init();
    }
    appShareBox.prototype.event = function(eventObj){
        var _this = this;
        //all——表示android和ios都是同一方法调用，other表示区分android和ios
        if(eventObj.funcType == "all"){
            eventObj.func(_this.nowOptions.link, _this.nowOptions.title, _this.nowOptions.desc, _this.nowOptions.imgUrl);
        }
        else if(eventObj.funcType == "other"){
            if(userAgentType.indexOf("android") != -1 && userAgentType.indexOf(eventObj.appType) != -1){
                eventObj.func(_this.nowOptions.link, _this.nowOptions.title, _this.nowOptions.desc, _this.nowOptions.imgUrl);
            }
            else if(userAgentType.indexOf("iphone") != -1 && userAgentType.indexOf(eventObj.appType) != -1){
                eventObj.funcOther(_this.nowOptions.link, _this.nowOptions.title, _this.nowOptions.desc, _this.nowOptions.imgUrl);
            }
        }

    }
    appShareBox.prototype.init = function(){
        var _this = this;
        switch (_this.appType){
            //京东到家app
            case "jdLocal":
                _this.event({
                    funcType:'other',
                    func:window.djJava.toShare,
                    funcOther:toShare
                });
                break;
        }
    };
    function jshopAppShare(options){
        //新增除去pc判断windows和mac
        if(w.navigator.platform != "Win32" && w.navigator.platform != "Win64" && w.navigator.platform != "MacIntel" && typeof options == "object"){
            return new appShareBox(options);
        }
    }
    w.jshop.jshopWXShare = jshopWXShare;
    w.jshop.jshopAppShare = jshopAppShare;
})(window);

/*
 * 京东到家版本参数及全局变量设置
 */
(function(win){
    var _userAgentType = win.navigator.userAgent.toLowerCase(),_platCode = "h5",_appVersion = "",_userAgentWhole,_appType,
        urlPara = win.Base.getURLParams(),_clearUrl = win.location.origin + win.location.pathname,_fullUlrEncode;
    win.jshop.jdHome = typeof win.jshop.jdHome === "undefined"? {}: win.jshop.jdHome;
    if(_userAgentType.indexOf("jdlocal") != -1){
        _userAgentWhole = _userAgentType.split("________")[1].split("&");
        for(var i = 0; i < _userAgentWhole.length;i++){
            if(_userAgentWhole[i].indexOf("platform") != -1){
                _platCode = _userAgentWhole[i].split("=")[1];
            }
            if(_userAgentWhole[i].indexOf("djappversion") != -1){
                _appVersion = _userAgentWhole[i].split("=")[1];
            }
        }
        _appType = "app";
    }else{
        _appType = "m";
    }
    //头部地址控制，除去经纬度和title
    for(var i in urlPara){
        if( i != "latitude" && i != "longitude" && i != "title"){
            _clearUrl = _clearUrl.indexOf("?") != -1 ? _clearUrl + "&"+ i + "=" + urlPara[i] : _clearUrl + "?" + i + "=" + urlPara[i];
        }
    }
    _fullUlrEncode = encodeURIComponent(_clearUrl);
    win.jshop.jdHome = {
        lng:"",
        lat:"",
        title:"",
        city: "",
        cityId: -1, //城市id默认为-1表示未开通
        address: "",
        district: "",
        platCode:_platCode,
        appVersion:_appVersion,
        jdHomeActiveType:_appType,
        headEncodeURI:_fullUlrEncode,
        headUrl:_clearUrl
    };
})(window);
/*
 //Sale工程不需要这段

 $(function(){

 //只有在预览页面才进行功能框架模块处理
 if(window !== window.top){
 //功能框架模块页面结构预处理，需要放在价格、图片懒加载之前
 $(".j-categoryLayout").each(function(index, module){

 var param = {};
 try {
 param = eval('(' + $(module).attr('module-param') + ')');
 }
 catch (e) {
 }

 var jContainer = $(module),
 jTabs = jContainer.find(param.categoryModuleIdsSelector);

 if(!param.categoryModuleIdsSelector || jTabs.length === 0){
 return true;
 }

 jTabs.each(function(index, dom){
 var moduleIds = $(dom).attr("data-moduleIds");
 if(moduleIds){
 var arr = moduleIds.split(",");
 for(var i = 0; i < arr.length; i++){
 var id = arr[i];
 if(id){
 var jTemp = $(".outer-container > div[instanceid='" + id + "']");
 jTemp.attr("data-width", jTemp.width()).attr("data-height", jTemp.height());
 $(dom).append(jTemp);
 jTemp.removeClass("abs-invisible");
 }
 };
 }
 });

 });
 }

 });
 *//**
 * Created by luxingyuan on 2015/4/10.
 */

$.extend(jshop.mModule, {

        /**
         * 轮播图模块
         * @param param.slideUl         需要执行transform: translate()的节点选择器
         * @param param.slideLi         单个轮播图片节点选择器
         * @param param.liCurrentClass  单个轮播图片节点被激活时候的样式
         * @param param.slideI          标示轮播小点点的节点选择器
         * @param param.iCurrentClass   轮播小点点的节点被激活时候的样式
         * @param param.timer           轮播的时间间隔（单位是毫秒）
         * @param param.animateDuration 单次轮播的持续时间（单位是毫秒）
         */
        slide: function (param) {
            var jTarget = $(this),
                isSliding = false,
                nowIndex = 1,
                length = 0,
                ulWidth = 0,
                slideUl = {},
                slideLi = {},
                slideI = {},
                timerIndex = jshop.slideTimer.length,
                setting = {
                    slideUl: ".jSlideMain",
                    slideLi: ".jSlideMain li",
                    slideI: ".jSlideSub i",
                    iCurrentClass: 'current',
                    slideDirection: '',
                    subFunction: transverseSlide,
                    timer: 4000,
                    animateDuration: 600
                },
                TANSFORMNAME = Base.css3Prefix.TRANSFORM;

            function init() {
                if (jTarget.length) {
                    length = 0;
                    $.extend(setting, param);
                    slideUl = $(setting.slideUl, jTarget);
                    slideLi = $(setting.slideLi, jTarget);
                    var tempWidth = jTarget.width();
                    ulWidth = tempWidth < 320 || tempWidth > 640? $(".outer-container").width() : jTarget.width();
                    slideLi.css("width", ulWidth);
                    if (slideLi.length < 2) return;		//小于2张图片的轮播图不需要轮播
                    slideI = $(setting.slideI, jTarget);
                    handleCss();
                    bindTouchSupport();
                    length = $(setting.slideLi, jTarget).length;
                    jshop.slideTimer[timerIndex] = setTimeout(setting.subFunction, setting.timer);
                }
            }

            /**
             * 处理影响滑动方式的相关CSS
             * @private
             */
            function handleCss() {
                if (setting.subFunction === transverseSlide) {
                    jTarget.find(setting.slideLi)[0].setAttribute("class", "");
                    var copyHtml = slideUl.html();
                    slideUl.html(copyHtml + copyHtml)[0].children[0].setAttribute("class", setting.liCurrentClass);           //为了实现无缝轮播，后增加一个
                    $("<style>.no-transition{-moz-transition-duration: 0s !important; -webkit-transition-duration: 0s !important; transition-duration: 0s !important;}</style>").appendTo("head");
                }
            }

            /**
             * 添加触碰滑动切换前后图片的支持
             * @private
             */
            function bindTouchSupport() {
                var containerObj = slideUl,
                    startX = 0,
                    startY = 0,
                    moveX = 0,
                    moveY = 0;
                if (typeof Zepto === "undefined") return;       //如果使用的不是移动库，不进行触碰滑动操作支持

                if (navigator.userAgent.match(/MSIE 9.0|MSIE 10.0|MSIE 11.0/i)) {
                    containerObj[0].onmspointerdown = touchStart;
                    containerObj[0].onmspointermove = touchMove;
                } else {
                    containerObj.bind("touchstart", touchStart);
                    containerObj.bind("touchmove", touchMove);
                }

                /**
                 * 触碰开始
                 * @param e
                 * @private
                 */
                function touchStart(e) {
                    if ($.os && $.os.ieTouch) {
                        startX = e.offsetX;
                        startY = e.offsetY;
                    } else {
                        startX = e.targetTouches && e.targetTouches[0].pageX;
                        startY = e.targetTouches && e.targetTouches[0].pageY;
                    }
                }

                /**
                 * 触碰滑动
                 * @param e
                 * @private
                 */
                function touchMove(e) {
                    if ($.os && $.os.ieTouch) {
                        moveX = e.offsetX - startX;
                        moveY = e.offsetY - startY;
                    } else {
                        var touchList = e.targetTouches;
                        var touch = touchList[0];
                        moveX = touch.pageX - startX;
                        moveY = touch.pageY - startY;
                    }

                    var result = getTouchMoveType(moveX, moveY);
                    if (result) {
                        if (setting.subFunction === transverseSlide) {
                            if (result === "left") {
                                transverseSlide("right");
                            } else if (result === "right") {
                                transverseSlide("left");
                            }
                        }
                        e.preventDefault();
                    }
                }

                /**
                 * 是否为滑动操作。是的话则返回触碰滑动操作的方向
                 * @param x
                 * @param y
                 * @return {*}
                 */
                function getTouchMoveType(x, y) {
                    var px = Math.abs(x);
                    var py = Math.abs(y);
                    if (px >= 1) {
                        if (px / py >= 1) {
                            return x > 0 ? "right" : "left";
                        } else {
                            return y > 0 ? "bottom" : "top";
                        }
                    } else {
                        return false;
                    }
                }
            }

            /**
             * 横向滑动切换图片
             * @param direction 方向
             * @private
             */
            function transverseSlide(direction) {
                if (isSliding === true) return;
                isSliding = true;
                clearTimeout(jshop.slideTimer[timerIndex]);
                if (length > 1) {
                    if (direction && direction === 'left') {
                        if (nowIndex === 1) {
                            slideUl.addClass("no-transition");
                            slideUl[0].style[TANSFORMNAME] = "translate3d(" + (-length / 2 * ulWidth) + "px, 0px, 0px)";
                            setTimeout(function () {
                                slideUl.removeClass("no-transition");
                                slideUl[0].style[TANSFORMNAME] = "translate3d(" + (-(nowIndex - 1) * ulWidth) + "px, 0px, 0px)";
                            }, 0);
                            nowIndex = length / 2;
                        } else {
                            nowIndex--;
                            slideUl[0].style[TANSFORMNAME] = "translate3d(" + (-(nowIndex - 1) * ulWidth) + "px, 0px, 0px)";
                        }
                    } else {
                        if (nowIndex === length / 2) {
                            slideUl[0].style[TANSFORMNAME] = "translate3d(" + (-nowIndex * ulWidth) + "px, 0px, 0px)";
                            setTimeout(function () {
                                slideUl.addClass("no-transition");
                                slideUl[0].style[TANSFORMNAME] = "translate3d(0px, 0px, 0px)";
                                setTimeout(function () {
                                    slideUl.removeClass("no-transition");
                                }, 100);
                            }, setting.animateDuration);
                            nowIndex = 1;
                        } else {
                            nowIndex++;
                            slideUl[0].style[TANSFORMNAME] = "translate3d(" + (-(nowIndex - 1) * ulWidth) + "px, 0px, 0px)";
                        }
                    }
                    slideI.removeClass(setting.iCurrentClass);
                    slideI.eq(nowIndex - 1).addClass(setting.iCurrentClass);

                    setTimeout(function () {
                        isSliding = false;
                    }, setting.animateDuration);

                    jshop.slideTimer[timerIndex] = setTimeout(arguments.callee, setting.timer);
                }
            }

            init();
        }

    }
);/**
 * Created by luxingyuan on 2015/4/8.
 */

$.extend(jshop.mModule, {

        /**
         * 自定义内容区模块
         * @param param
         */
        zoom: function (param) {
            if (param.needZoom === false) return;
            jTarget = $(this);        //自定义内容区的选择器

            /**
             * 对自定义内容区缩放至和最外层容器一样的宽度
             */
            function scale() {
                if(jTarget[0].getAttribute("style") !== null){
                    jTarget.removeAttr("style");
                }
                var prefix = Base.css3Prefix.TRANSFORM,
                    jModule = jTarget.closest("[module-name]"),
                    innerWidth = jTarget.css("position", "absolute").width(),
                    scale = jTarget.css("position", "static") && $(".outer-container").width() / innerWidth;
                scale = scale > 1? $(".outer-container").width() / 640: scale;
                var height = (jModule.attr("data-height") || jTarget.parent().height()) * scale;
                if(height === 0){
                    jTarget.removeAttr("funcompleted");
                    return;
                }
                jTarget[0].style[prefix + "Origin"] = "0 0";
                jTarget[0].style[prefix] = "scale(" + scale + ")";
                jTarget.height(height);
            }

            /**
             * 初始化
             */
            !function init() {
                scale();
            }();
        }
    }
);/**
 * Created by luxingyuan on 2015/4/10.
 */

$.extend(jshop.mModule, {

        /**
         * 促销推荐模块
         * @param param.node            存放促销推荐id（prompt-id）的节点选择器
         * @param param.clicknode       点击跳转的节点的选择器
         * @param param.phonePrice      是否需要展示手机专享价格
         * @param param.overCls         促销结束时候的样式，会添加到param.node上
         * @param param.underwayCls     促销进行中的样式，会添加到param.node上
         * @param param.waitCls         促销还未开始时的样式，会添加到param.node上
         * @param param.jdPriceNode		京东价格节点选择器
         * @param param.appPriceNode	app价格节点选择器
         * @param param.skuAttName		价格节点上的sku标示
         */
        promptRecommend: function (param) {
            var jTarget = $(this),
                param = $.extend({
                    node: 'li',
                    clickNode: '.jBtnArea a',
                    overCls: 'over',
                    underwayCls: 'go',
                    waitCls: 'wait',
                    phonePrice: false
                }, param || {}),
                ids = [],
                baseurl = INTERFACE.actJshop.ms;

            function init() {
                getIds();
                getSate();
            }

            function getIds() {
                jTarget.find(param.node).each(function (index, n) {
                    ids.push($(n).attr('prompt-id'));
                });
            }

            function getSate() {
                $.ajax({
                    url: baseurl + "?promoId=" + ids.join(','),
                    dataType: 'jsonp',
                    success: function (data) {
                        if (data.result) {

                            //放在获取状态之后，确保不会影响到获取专享价
                            if (param.phonePrice) {
                                $.extend(param, {itemNode: param.node});
                                jshop.mModule.showAppPriceCoupon.call(jTarget, param);
                            }

                            data.values.forEach(function (n, index) {
                                if (n.status == '0') {    /*已结束*/
                                    $(jTarget).find('li[prompt-id="' + n.id + '"]').attr('class', param.overCls).find(param.clicknode).attr('href', '#none');
                                } else if (n.status == '1') {    /*进行中*/
                                    $(jTarget).find('li[prompt-id="' + n.id + '"]').attr('class', param.underwayCls).attr("status", "go");
                                } else {        /*未开始*/
                                    $(jTarget).find('li[prompt-id="' + n.id + '"]').attr('class', param.waitCls).find(param.clicknode).attr('href', '#none');
                                }
                            });
                        }
                    }
                });
            }

            init();
        }
    }
);/**
 * Created by luxingyuan on 2015/6/3.
 */


jQuery.extend(jshop.mModule, {

        /**
         * 热门排行模块公共方法
         * @param param.navTempSelector             商品分类标题区域一个单元的渲染模板的选择器
         * @param param.contentTempSelector         商品分类内容区域一个分类单元的渲染模板的选择器
         * @param param.contentItemTempSelector     商品分类内容区域一个分类单元里的一个商品的渲染模板的选择器
         * @param param.navItemSelector             热门排行菜单项选择器
         * @param param.navItemCurrent              热门排行菜单项激活时获得的样式
         * @param param.contentItemSelector         热门排行内容项选择器
         * @param param.contentItemCurrent          热门排行内容项激活时获得的样式
         * @param param.hasUpdateTimeClass          如果分类商品有返回更新时间，那么就给对应分类商品区域的最外层节点添加的样式
         */
        topRanking: function(param){

            var jTarget = $(this),
                URL = INTERFACE.rankData + "?jsonPara=";
                param = jQuery.extend({
                        categoryIds: "",
                        categoryName: "",
                        type: "",
                        navTempSelector: ".j-template-nav",                 
                        contentTempSelector: ".j-template-ul",              
                        contentItemTempSelector: ".j-template-li",          
                        navItemSelector: ".j-top-nav > span",               
                        navItemCurrent: "current",                           
                        contentItemSelector: ".j-template-ul",               
                        contentItemCurrent: "current",                     
                        hasUpdateTimeClass: "show-update-time"             
                    }, param);

            //各种工具类
            var tool = {

                //模板替换工具
                replace: function(str, obj){
                    for(a in obj){
                        var reg = new RegExp("\\{\\{" + a + "\\}\\}", "g");
                        str = str.replace(reg, obj[a] === null? "": obj[a]);
                    }
                    str = str.replace(/\jQuery.*?\$/g, "");
                    return str;
                },

                // 根据当前页面url来返回适用于app或m的商品详情页地址
                getDetailUrl: function (skuId){
                    var url = location.href;
                    if(/\/app\//.test(url)){
                        var sourcevalue = Base.getURLParams().resourceValue;
                        //初始化sourceType和sourceValue值
                        return "openApp.jdMobile://virtual?params={\"category\":\"jump\",\"des\":\"productDetail\",\"skuId\":\""+skuId+"\",\"sourceType\":\"JSHOP_SOURCE_TYPE\",\"sourceValue\":\"JSHOP_SOURCE_VALUE\",\"landPageId\":\"jshop.cx.mobile\"}";
//                        return "openApp.jdMobile://virtual?params={\"category\":\"jump\",\"des\":\"productDetail\",\"skuId\":\""+skuId+"\",\"sourceType\":\"\",\"sourceValue\":\""+sourcevalue+"\",\"landPageId\":\"jshop.cx.mobile\"}";
                    }else{
                        return INTERFACE.mCommon.product + skuId + ".html";
                    }
                },

                //请求一级类目
                ajaxData: function(selectFirstCateId){
                    Base.checkLogin(function(data){
                        var url = URL+'{"categoryIds":"'+selectFirstCateId+'","pin":"'+data.pin+'"}&callback=?';
                        tool.ajaxCate(url);
                    },function(){
                        var url = URL+'{"categoryIds":"'+selectFirstCateId+'"}&callback=?';
                        tool.ajaxCate(url);
                    });
                },

                //获取二级类目
                ajaxCate: function(url){
                    jQuery.ajax({
                        url: url,
                        type:"get",
                        dataType:"jsonp",
                        success: function(data){
                            if(data.code == "0"){
                                var dealLists = data.result.resList,
                                    resLists,
                                    cateStr = "",       //接口入参形式必须是一级分类-二级分类传递,实际上一级分类没任何实际用途，故此处随意取值1-key
                                    navTemp = jTarget.find(param.navTempSelector).html(),
                                    html = "",
                                    count = 0;
                                //开启二级混排开关
                                //开启二级混排开关
                                if(param.secondarySwitch){
                                    var _MaxArrLen = 0;
                                    var _dealLen = dealLists.length;
                                    for(var i = 0;i < _dealLen;i++) {
                                        if(dealLists[i].categoryList.length >= _MaxArrLen){
                                            _MaxArrLen = dealLists[i].categoryList.length;
                                        }
                                    }
                                    resLists = [];
                                    for(var j = 0;j < _MaxArrLen;j++){
                                        for(var k = 0;k < _dealLen;k++){
                                            if(dealLists[k]){
                                                if(dealLists[k].categoryList[j]){
                                                    resLists.push(dealLists[k].categoryList[j]);
                                                }
                                            }
                                        }
                                    }

                                    if(navTemp === null) return;
                                    var res_list_len = resLists.length;
                                    for(var k = 0; k < res_list_len; k++){
                                        cateStr+="1-"+resLists[k].categoryId+",";
                                        //业务方要求，至多只展示8个
                                        // if(count++ < 8){
                                        count++;
                                        html += tool.replace(navTemp, resLists[k]);
                                        // }
                                    }

                                }else{
                                    resLists = dealLists;
                                    if(navTemp === null) return;
                                    var res_list_len = resLists.length;
                                    for(var c = 0; c < res_list_len; c++){
                                        resultList = resLists[c].categoryList;
                                        for(var i = 0; i < resultList.length; i++){
                                            cateStr+="1-"+resultList[i].categoryId+",";
                                            //业务方要求，至多只展示8个
                                            // if(count++ < 8){
                                            count++;
                                            html += tool.replace(navTemp, resultList[i]);
                                            // }
                                        }
                                    }
                                }
                                if(count > 4){
                                    jTarget.find(".vague-state").addClass("vague-show");
                                }
                                jTarget.find(param.navTempSelector).parent().html(html);
                                tool.ajaxGoods(cateStr.slice(0, cateStr.length-1));
                            }
                        }
                    });
                },

                //获取二级类目下的商品
                ajaxGoods: function(cateStr, cateStr2){
                    if(cateStr == "") return;
                    if(typeof cateStr === "object"){
                        var att = "",
                            val = "";
                        for(var a in cateStr){
                            att = a;
                            val = cateStr[a];
                        }
                        var navTemp = jTarget.find(param.navTempSelector).html(),
                            html = tool.replace(navTemp, {"categoryId": att,"categoryName":val});
                        jTarget.find(param.navTempSelector).parent().html(html);
                        cateStr = cateStr2;
                    }
                    
                    jQuery.ajax({
                        url: URL + '{"categoryIds":"'+cateStr+'"}&callback=?',
                        dataType: "jsonp",
                        success: function(data){
                            if(data.code === "0"){
                                successHandle(data);
                            }else{
                                jTarget.hide();
                                console.error(URL + "，热门排行接口未能正常响应，" + data);
                            }
                        }
                    });
                }
            }

            //事件绑定
            function eventBind(){
                //点击分类显示相应的内容
                jTarget.find(param.navItemSelector).bind("click", function(){
                    $(this).addClass(param.navItemCurrent).siblings().removeClass(param.navItemCurrent);
                    var categoryId = $(this).attr("categoryId");
                    jTarget.find(param.contentItemSelector + "[categoryId='" + categoryId + "']").addClass(param.contentItemCurrent).siblings().removeClass(param.contentItemCurrent);
                    jshop.widget.instance.imgLoad.reCheck();
                });
            }

            //数据初始化
            function dataInit(){
                var selectFirstCateId = param.categoryIds,
                    type = param.type;

                //type=2时，代表根据活动所属分类来请求商品
                if(type === 2){
                    if(selectFirstCateId !="" && selectFirstCateId.split("-").length == 2){
                        var cateIds = {};
                        cateIds[selectFirstCateId.split("-")[1]] = param.categoryName;
                        var cateStr = "1-"+selectFirstCateId.split("-")[1];
                        tool.ajaxGoods(cateIds, cateStr);
                    }
                    else if(selectFirstCateId=="1"){
                        selectFirstCateId = "";
                        tool.ajaxData(selectFirstCateId);
                    }
                    //返回三级类目，不请求数据
                    else if(selectFirstCateId!="" && selectFirstCateId.split("-").length === 3){

                    }else{
                        //其他情况，则是先请求二级类目，再根据类目请求商品数据
                        tool.ajaxData(selectFirstCateId);
                    }
                }else{
                    //其他情况，则是先请求二级类目，再根据类目请求商品数据
                    tool.ajaxData(selectFirstCateId);
                }
            }

            //请求成功回调处理
            function successHandle(data){
                var resLists = data.result.resList,
                    liHtml = jTarget.find(param.contentItemTempSelector).html(),
                    itemTempTag = "{{contentItemTempSelector}}",
                    ulHtml = jTarget.find(param.contentTempSelector).html(),
                    jWarp = jTarget.find(param.contentTempSelector).parent(),
                    mainHtml = "",
                    hasUpdateTimeArr = {},
                    secondCates=[];

                if(liHtml === null) return;

                for(var index = 0; index < resLists.length; index++){
                    var wares = resLists[index].wares;
                    if(wares.length > 0){
                        // if(secondCates.length >= 8){break;}
                        var tempHtml = "";
                        for (var i = 0; i < wares.length; i++) {
                            wares[i].index = i + 1;
                            wares[i].href = tool.getDetailUrl(wares[i].sku);
                            tempHtml += tool.replace(liHtml, wares[i]);
                        }
                        //给有更新时间商铺组的加上对应样式
                        if(resLists[index].updateTime){
                            hasUpdateTimeArr[index] = "";
                        }
                        mainHtml += tool.replace(ulHtml, resLists[index]).replace(itemTempTag, tempHtml);
                    }
                }
                jWarp.html(mainHtml);



                //给有更新时间的商品分类添加上对应样式
                for(var index in hasUpdateTimeArr){
                    jTarget.find(param.contentItemSelector).eq(index).addClass(param.hasUpdateTimeClass);
                }

                //把没有商品数据的分类给删除掉，避免影响到后面触发选中第一个
                jTarget.find(param.navItemSelector).each(function(){
                    var categoryId = $(this).attr("categoryId"),
                        jContent = jTarget.find(param.contentItemSelector + "[categoryId='" + categoryId + "']");
                    if(jContent.length === 0){
                        $(this).remove();
                    }
                });

                //超过8个分类的则不展示
                jTarget.find(param.navItemSelector).each(function(index){
                    var categoryId = $(this).attr("categoryId"),
                        jContent = jTarget.find(param.contentItemSelector + "[categoryId='" + categoryId + "']");
                    if(index > 7){
                        $(this).hide();
                        jContent.hide();
                    }
                });


                eventBind();

                setTimeout(function(){
                    jTarget.find(param.navItemSelector).eq(0).trigger("click");
                }, 0);

                //添加埋点
                try{
                    jshop.mStatistic.Jshop_Hot(jTarget.closest("[module-name='Jshop_Hot']"));
                }catch(e){
                }
                //数据加载完成后触发给页面里的链接都加上本页面的url参数
                commonLoder.initActPageParams(jTarget);
            }

            //初始化入口
            !function init(){
                if(param.type){
                    dataInit();
                }
            }();
        }

    }
);﻿
/*
 * global initialization for modules who needs special logics and local refresh
 */
(function(w){

    function excute(module){
        var func = module.attr('module-function'),
            para = {};
        if(!func) return;

        try{
            para = eval('(' + module.attr('module-param') + ')');
        } catch(e){
        }

        var funcs = func.split(',');
        funcs.forEach(function(n, index){
            if(jshop.mModule[n]){
                jshop.mModule[n].call(module,para);
            }
        });
    }

    /**
     * 刷新单个模块
     */
    function localRefresh(){
        var that = $(this).find('.j-module');
        if(!that.length) return;

        that.each(function () {
            excute($(this));
        });
    }

    /**
     * 刷新所有模块
     */
    function moduleRefresh(){
        //jshop.slideTimer = [];
        //jshop.countDownTimer = [];

        //浏览态——为避免局部刷新导致jshop.slideTimer和jshop.countDownTimer清空造成的计时器无法清除,在这做是否首次初始化的判断
        if(jshop.slideTimer && Object.prototype.toString.call(jshop.slideTimer) != '[object Array]'){
            jshop.slideTimer = [];
        }
        if(jshop.countDownTimer && Object.prototype.toString.call(jshop.countDownTimer) != '[object Array]'){
            jshop.countDownTimer = [];
        }
        $('.j-module[module-function]:not([funcompleted])').each(function(index,n){
            n.setAttribute("funcompleted","");
            excute($(n));
        });
    }

    w.moduleRefresh = moduleRefresh;
    w.localRefresh = localRefresh;

    moduleRefresh();

})(window);

(function(){
    $(function(){
        var width = $(window).width(),
            timer = null;

        function resizeHandle(){
            jshop.widget.instance.imgLoad.reCheck();
            jshop.widget.instance.priceLoad.check();
            moduleRefresh();
            clearTimeout(timer);
            timer = null;
        }
        if(typeof Config == 'undefined'){
            $(window).resize(function(){
                if(timer) return;
                var currentWidth = $(this).width();
                if(width !== currentWidth){
                    width = currentWidth;
                    timer = setTimeout(function(){
                        resizeHandle();
                    },500);
                }
            });
        }
    });
})();/**
 * Created by luxingyuan on 2015/9/1.
 */

(function(win, $){

    jshop = typeof jshop === "undefined"? {}: jshop;
    jshop.widget = typeof jshop.widget === "undefined"? {}: jshop.widget;

    //通用工具方法
    var tool = {
            getScrollTop: function(){
                return document.documentElement.scrollTop||document.body.scrollTop;
            },
            getClientHeight: function(){
                return document.documentElement.clientHeight || document.body.clientHeight;
            }
        },
        screenHeight = tool.getClientHeight(),
        moduleDependence = JSON.parse(decodeURIComponent($("#moduleDependence").val() || "{}")),        //存放模块间的依赖关系
        pureStyleModules = JSON.parse(decodeURIComponent($("#pureStyleModules").val() || "[]")),        //纯粹只存放了style的自定义内容区实例id
        moduleCssId = {};       //记录页面模块用到的cssId

    //模块懒加载
    jshop.widget.moduleLazyLoad = function(){

        var MODULE_CLASS = "j-placeholder",
            FIRST_VIEW_CLASS = "j-first-view",          //需要显示在首屏的模块css标示
            PAGE_INSTANCEID = $("#mobPageInstanceId").val(),
            $style = $("style").eq(0);

        //初始化
        !!function init(){
            //对默认渲染模块里的内容框架模块进行处理，把包含的内嵌模块的结构请求回来
            actionFrameModule($(".j-categoryLayout"));
            //加载和默认屏展示模块有关联的模块
            loadRelativeModule($(".outer-container > div[module-name]").map(
                function(i, dom){
                    if(i < 2){
                        moduleCssId[dom.classList[0]] = "in";
                        return $(dom).attr("instanceid");
                    }
                }
            ).toArray());
            loadRelativeModule(pureStyleModules, true);
        }();

        //暴露对外调用的接口
        this.check = function () {
            check();
        };

        /**
         *  检查是否需要加载模块，默认是加载当前可视区域再额外多加载一屏幕的内容。请求完成后清掉代表未渲染的模块class标示
         */
        function check(){

            var arrModule = [];

            $("." + MODULE_CLASS + ",." + FIRST_VIEW_CLASS).each(function(){
                var jItem = $(this),
                    top = jItem.offset().top;
                if((top <= tool.getScrollTop() + screenHeight * 2) || jItem.hasClass(FIRST_VIEW_CLASS)){
                    handle(jItem.attr("instanceid"));
                    jItem.removeClass(MODULE_CLASS + " " + FIRST_VIEW_CLASS);
                }
            });
        }

        //处理功能框架模块的模块加载
        function actionFrameModule(jModule){
            if(jModule.length === 0){
                return;
            }
            var param = {};
            try {
                param = eval('(' + jModule.attr('module-param') + ')');
            }
            catch (e) {
            }

            var jTabs = jModule.find(param.categoryModuleIdsSelector);

            if(!param.categoryModuleIdsSelector || jTabs.length === 0){
                return;
            }

            jTabs.each(function(index, dom){
                var moduleIds = $(dom).attr("data-moduleIds");
                if(moduleIds){
                    var arr = moduleIds.split(",");
                    for(i = 0; i < arr.length; i++){
                        $(dom).append("<div class='funcDivide-" + arr[i] + "'></div>");
                        loadData(arr[i], function(data){
                            //如果之前没有写如果这个模块CSS，则写入模块依赖的CSS
                            if(!(data.cssid in moduleCssId)){
                                $style.append(data.css);
                                moduleCssId[data.cssid] = "in";
                            }
                            //然后再插入对应的模块内容
                            var winWidth = window.innerWidth,
                                minHeight = parseFloat((data.minHeight || 0)) + parseFloat((data.coefficient || 0)) * (winWidth - 320),
                                innerHTML = '<div class="' + data.cssid + '" style="height:' + minHeight + 'px;" instanceid="' + data.instanceId + '" module-name="'+ data.moduleName +'">' + data.html + '</div>';
                            $(dom).find(".funcDivide-" + data.instanceId).html(innerHTML);
                        });
                    }
                }
            });
        }

        //根据实例id，加载一个模块
        function handle(moduleId){
            loadData(moduleId, function(data){
                //如果之前没有写如果这个模块CSS，则写入模块依赖的CSS
                if(!(data.cssid in moduleCssId)){
                    $style.append(data.css);
                    moduleCssId[data.cssid] = "in";
                }
                //然后再插入对应的模块内容
                var $module = $(".outer-container > div[instanceid='" + data.instanceId + "']");
                //判断模块里面是否有内容，避免模块内容重复加载显示
                if(!$.trim($module.html())){
                    $module.addClass(data.cssid).html(data.html);
                }
                //如果是功能框架模块，则需要把其包含的其他模块也一并请求过来
                if(data.html.indexOf("j-categoryLayout") !== -1){
                    actionFrameModule($module.find(".j-module"));
                }
            });
        }

        /**
         *  发送模块请求以及处理渲染
         */
        function loadData(moduleId, callback){
            var type = /^\/app/.test(location.pathname)? "app-": "m-",
                url = INTERFACE.saleModule + type + PAGE_INSTANCEID + "-" + moduleId + ".html";
            $.ajax({
                url: url,
                dataType: "json",
                success: function(data){
                    if(data.status === "success"){
                        callback(data);
                        //触发模块公共方法加载
                        moduleRefresh();
                        //触发价格、图片懒加载
                        jshop.widget.instance.imgLoad.reCheck();
                        jshop.widget.instance.priceLoad.check();
                        //加载了模块内部结构以及各种懒加载后，就可以把最小站位高度给去掉了
                        var jModule = $(".outer-container div[instanceid='" + moduleId + "']").css("height", "");
                        //模块埋点
                        try{
                            jshop.mStatistic[jModule.attr("module-name")](jModule);
                        }catch(e){
                        }
                        //数据加载完成后触发给页面里的链接都加上本页面的url参数
                        commonLoder.initActPageParams(jModule);
                        //加载和本模块关联的模块
                        loadRelativeModule(moduleId);
                    }else{
                        console.error("请求接口[" + url + "]失败, pageInstanceId=" + PAGE_INSTANCEID + ", instanceId=" + moduleId);
                    }
                }
            });
        }

        //加载和本模块关联的模块（目前针对锚点发生的关联关系）
        function loadRelativeModule(moduleIds, needLoad){
            var arrModule = [];
            if(typeof moduleIds === "string"){
                arrModule.push(moduleIds);
            }else{
                arrModule = moduleIds;
            }
            for(var i = 0; i < arrModule.length; i++){
                var moduleId = arrModule[i];
                if(needLoad || moduleId in moduleDependence){
                    var arr = needLoad? moduleIds: moduleDependence[moduleId];
                    for(var j = 0; j < arr.length; j++){
                        var relativeModuleId = arr[j];
                        var jRelativeModule = $(".outer-container > div[instanceid='" + relativeModuleId + "']");
                        //没有加载过的模块才进行加载
                        if(needLoad || arrModule.length > 1 || jRelativeModule.hasClass(MODULE_CLASS) || jRelativeModule.hasClass(FIRST_VIEW_CLASS)){
                            handle(relativeModuleId);
                            jRelativeModule.removeClass(MODULE_CLASS + " " + FIRST_VIEW_CLASS);
                        }
                    }
                }
            }
        }

    };

    //价格懒加载
    jshop.widget.priceLazyLoad = function () {

        var CONFIG = {
            prefixUrl: INTERFACE.price.jd + '?skuids=',
            suffixUrl: '&type=2',
            noSalePriceTag: '<span class="jsNumNo">暂无价格</span>',
            noJdPriceTag: '<span class="jdNumNo">暂无价格</span>'
        };

        /**
         * 初始化
         */
        function init() {
            /*修复在android4.3及以下版本webview物理返回键返回时滚动条位置定位会在dom树ready之后的问题*/
            setTimeout(function(){
                check();
            }, 100);
        }

        /**
         * 请求价格并替换价格标签内容，每次至多请求20个sku
         * @param arrSku    skuId组成的数组
         */
        function loadPrice(arrSku) {
            if (arrSku && arrSku.length) {
                for (var i = 0; i < arrSku.length; i+=20) {
                    jsonpPrice(arrSku.slice(i, i+20));
                }
            }
        }

        /**
         * 使用jsonp方式请求价格
         * @param arr
         */
        function jsonpPrice(arr) {
            $.ajax({
                url: CONFIG.prefixUrl + arr.join(",") + CONFIG.suffixUrl,
                dataType: "jsonp",
                success: function(data) {
                    if (data && data.constructor === Array) {
                        for (var i = 0; i < data.length; i++) {
                            var price = data[i],
                                id = price.id.substring(2, price.id.length),
                                salePrice = ~~price.m === -1 ? CONFIG.noSalePriceTag : price.m,
                                jdPrice = ~~price.p === -1 ? CONFIG.noJdPriceTag : price.p;
                            $(".jdNum[jdprice='" + id + "']").html(jdPrice);
                            $(".jsNum[jskuprice='" + id + "']").html(salePrice);
                        }
                    }
                }
            });
        }

        /**
         * 检测并请求价格
         * @private
         */
        function check() {
            var arrSkuId = [],i = 0;
            $(".jdNum[jshop='price']").each(function(){
                var jItem = $(this),
                    top = jItem.offset().top;
                //if((jItem.height() !== 0 || top !== 0) && top <= tool.getScrollTop() + screenHeight * 2){
                //解决价格懒加载请求频率过快，默认先判断后两屏是否已超过20个价格，如果没有超过则继续向下寻找补充
                if(jItem.height() !== 0 || top !== 0){
                    if(top <= tool.getScrollTop() + screenHeight * 2){
                        //根据加载标示来加载
                        arrSkuId.push("J_" + jItem.attr("jdprice"));
                        jItem.removeAttr("jshop");
                    }
                    else if((top > tool.getScrollTop() + screenHeight * 2) && i < 20){
                        //根据加载标示来加载
                        arrSkuId.push("J_" + jItem.attr("jdprice"));
                        jItem.removeAttr("jshop");
                    }
                    i++;
                }
            });
            i = 0;
            arrSkuId.length && loadPrice(arrSkuId);
        }

        this.check = check;

        init();

    };

    //图片懒加载
    jshop.widget.imgLazyLoad = function () {

        var config = {
                scale: 1,       //图片实际放大比例
                quality: 100,    //图片压缩比例
                needWebp: false    //是否需要webp格式
            },
            IMG_CLASS = "J_imgLazyload",
            isChecking = false;

        //暴露对外调用的接口，目前是轮播图中的纵向轮播需要触发图片懒加载的check方法
        this.reCheck = function () {
            check();
        };

        /**
         * 初始化入口
         */
        function init(){

            settingInit();

            /*修复在android4.3及以下版本webview物理返回键返回时滚动条位置定位会在dom树ready之后的问题*/
            setTimeout(function(){
                check();
            }, 100);
        }

        /**
         * 检测是否需要加载图片。加载可见区域及预加载一屏幕图片
         */
        function check(){
            if(!isChecking){
                isChecking = true;
                $("." + IMG_CLASS).each(function(){
                    var jTarget = $(this);
                    if(jTarget.width() !== 0 && jTarget.height() !== 0 && jTarget.offset().top <= tool.getScrollTop() + screenHeight * 2){
                        if(!jTarget.attr("data-src")){
                            setApplySrc(jTarget);
                        }
                        jTarget[0].onload = function(){
                            check();
                        };
                        jTarget.attr("src", jTarget.attr("data-src")).removeClass(IMG_CLASS);
                    }
                });
                isChecking = false;
            }
        }

        /**
         * 获取图片实际应用地址
         * @param jImg  需要设置的图片的包装对象
         */
        function setApplySrc(jImg){

            var width = jImg.width(),
                height = jImg.height(),
                originalSrc = jImg.attr("data-srcset"),
                applySize = "s" + ~~(width * config.scale) + "x" + ~~(height * config.scale) + "_",
                applySrc = originalSrc;

            //storage.jd.com域名下的图片不处理
            if(originalSrc.indexOf('storage.jd.com') === -1){
                //自定义内容区模块图片、gif图片不处理图片size。图片服务器不支持gif缩放
                if(jImg.attr("data-imgType") !== "htmlContent" && !~originalSrc.indexOf(".gif")){
                    /(http\:|https\:)?(\/\/img\d{2}\.360buyimg\.com\/\w{2,10}\/)(.*)/.test(originalSrc);
                    applySrc = RegExp.$1 + RegExp.$2 + applySize + RegExp.$3;
                }
                //只对jpg\png进行降至或者应用webp
                if(!~originalSrc.indexOf(".gif")){
                    applySrc = applySrc + (config.quality === 100? "": "!q" + config.quality + ".jpg") + (config.needWebp? ".webp": "");
                }
            }

            jImg.attr("data-src", applySrc);
        }

        /**
         * 根据UA以及URL，初始化图片生成的设定
         */
        function settingInit(){
            //根据UA环境，确定图片生成规则
            var ua = win.navigator.userAgent,
                isMobile = /mobile|jdapp/i.test(ua);
            if(isMobile){
                var dp = win.devicePixelRatio || 2,
                    network = win.Base.getURLParams().networkType;
                config.scale = dp > 3? 3: dp;

                if(/Android\s(\d+\.\d+)/i.test(ua) && !/Windows Phone/.test(ua) && !/IEMobile/i.test(ua) && parseFloat(RegExp.$1) >= 4.0){     //安卓系统4.0及以上才支持webp
                    config.needWebp = true;
                    if(network !== "wifi"){
                        config.quality = 50;
                    }else{
                        config.quality = 70;
                    }
                }else{
                    if(network === "wifi"){
                        config.quality = 80;
                    }else{
                        config.quality = 70;
                    }
                }
            }
        }

        init();

    };

    /*alert提示框*/
    jshop.widget.alert = function (){

        var _duration = 3000,
            _box = null,
            _timer = 0;

        /**
         * 显示一条信息
         * @private
         */
        function _messageShow(msg, duration){
            clearTimeout(_timer);
            _box.find(".d-inner").html(msg);
            _box.hasClass('d-alert-hide') && _box.removeClass('d-alert-hide') && setTimeout(function(){_box.show()}, 400);
            _timer = setTimeout(function(){
                _box.addClass('d-alert-hide');
                setTimeout(function(){
                    _box.hide();
                }, 400)
            }, duration || _duration);
        };

        /**
         * 对外暴露的alert接口
         * @param msg   需要alert的文本内容
         * @param duration 持续时间
         */
        win.msgAlert = function(msg, duration){
            if(!_box){
                _box = $('<div class="d-msg-alert-box d-alert-hide"><div class="d-inner">' + msg + '</div></div>').appendTo("body");
            }
            _messageShow(msg, duration);
        };
    }

    /*确认提示框，包含有确认、取消两个按钮*/
    jshop.widget.confirm = function (){

        var jBox,
            yesCallback,
            noCallback;

        /**
         * 绑定事件
         * @private
         */
        function bind(){
            jBox.find('.d-msg-confirm-cancel').bind('click', function(){
                reset();
                typeof noCallback === 'function' && noCallback();
            });
            jBox.find('.d-msg-confirm-ok').bind('click', function(){
                reset();
                typeof yesCallback === 'function' && yesCallback();
            });
        };

        /**
         * 重置弹框的状态为隐藏
         * @private
         */
        function reset(){
            jBox.addClass('hidden');
            jBox.find('.d-msg-confirm-content').html('');
        }

        /**
         * 更新弹框相关信息
         * @param content       新的确认框按钮以上的展示内容
         * @param yesCB         新的点击确定后的回调函数
         * @param noCB          新的点击取消后的回调函数
         * @param className     新的弹框附带的css类名
         * @private
         */
        function update(content, yesCB, noCB, className){
            yesCallback = yesCB || null;
            noCallback = noCB || null;
            jBox.find('.d-msg-confirm-box').attr('class', 'd-msg-confirm-box ' + (className || ''));
            jBox.find('.d-msg-confirm-content').html(content);
            jBox.removeClass('hidden');
        }

        /**
         * 对外暴露的弹框接口
         * @param content       确认框按钮以上的展示内容
         * @param yesCallback   点击确定后的回调函数
         * @param noCallback    点击取消后的回调函数
         * @param className     弹框附带的css类名
         */
        win.msgConfirm = function(content, yesCallback, noCallback, className){
            if(!jBox){
                var html = '<div class="d-msg-confirm-bg flex-center">'
                        + '    <div class="d-msg-confirm-box {{className}}">'
                        + '        <div class="d-msg-confirm-content flex-center flex-vertical">'
                        + '            {{content}}'
                        + '        </div>'
                        + '        <div class="d-msg-confirm-btn">'
                        + '            <button class="d-msg-confirm-cancel" type="button">取消</button><button class="d-msg-confirm-ok" type="button">确定</button>'
                        + '        </div>'
                        + '    </div>'
                        + '</div>';
                jBox = $(html).appendTo("body");
                bind();
            }
            update(content, yesCallback, noCallback, className);
        };
    }

    /**
     * 无限下拉
     * param.target 目标元素(请求数据的放置区),如： .reco-wrap .goods-list
     * param.loadTag 加载图片元素（请求过程中用于改变background-image为load图片）,如：.reco-wrap .title
     * param.listenEle 侦听元素(用于判断scoll是否到底部)  如：.reco-wrap .title-wrap
     *
     */
    jshop.widget.gragPull = function(param){

        var _arg = param ||{},
            _target = _arg.target,
            _page = 1,
            _loadImg = "url(//img11.360buyimg.com/cms/jfs/t490/282/1327111733/2166/b74c372a/54c9cd79N04238576.png)",
            _activityId = $("#mobAppId").val(),
            _resourceValue = Base.getURLParams.resourceValue,
            _CONFIG = {
                maxPage:20,
                //新网关地址迁移，验签白名单
                url:INTERFACE.portal + '?client=wjshop&clientVersion=1.0.0&functionId=indexRecommendForJshop&body={"activityId":"{{activityId}}","category":"{{categoryId}}","page":"{{page}}","pin":"{{pin}}","logId":"{{resourceValue}}"}&callback=callbackJsonp',
                imgTemp:"",
                req:false,
                tips:"<div style='text-align:center;display:none;' class='load-tips'><span class='loading' style='padding-left:25px;position: relative;color:#999;'>加载中</span></div>",
                url_reg:INTERFACE.portal + '?client=wjshop&clientVersion=1.0.0&functionId=indexRecommendForJshop&body={"activityId":"{{activityId}}","category":"{{categoryId}}","page":"{{page}}","pin":"{{pin}}","logId":"{{resourceValue}}"}&callback=callbackJsonp'
            },
            _body = document.documentElement || document.body,
            _targetDom = $(_arg.target),
            tips_parent = _targetDom.parent(),
            _clientHeihgt = _body.clientHeight;

        /**
         * 初始化
         * @private
         */
        function _init(){
            var _listenEle = _arg.listenEle;
            $(_listenEle).attr("report-eventparam",_resourceValue+"_"+_activityId);
            if($(_listenEle) && $(_listenEle).length > 0){
                if(_arg.loadTag){
                    _CONFIG.imgTemp = $(_arg.loadTag).css("background-image");
                }
                tips_parent.append(_CONFIG.tips);
                _bandEvent();

            }
        }

        function _bandEvent(){

            window.addEventListener("scroll",function(){
                var _scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                    _scrollHeight = _body.scrollHeight;
                //向底部滚动
                if(_clientHeihgt + _scrollTop +10>= _scrollHeight){
                    _ajaxHandle();
                }

            },false);

        }
        function _ajaxHandle(){
            // console.log(1431);
            if(_CONFIG.req){return;}
            _CONFIG.req =  _arg.moveDownflag = true;
            _CONFIG.url = _CONFIG.url_reg; //将url模板赋值给url
            //当请求页数大于最大请求页数时，不允许请求
            if(_page > _CONFIG.maxPage){
                return;
            }
            //获取pin,activityId,categoryId
            var pin = "",
                categoryId = $("#categoryParam").val();
            //显示加载中
            if(_page == 1){
                // $(_arg.loadTag).css("background-image",_loadImg);
                $(_arg.loadTag).addClass("loading");
            }else{
                tips_parent.find(".load-tips").show();
            }
            if (typeof(_resourceValue) == "undefined")
            {
                _resourceValue="";
            }
            _CONFIG.url = _CONFIG.url.replace(/{{activityId}}/g,_activityId).replace(/{{categoryId}}/g,categoryId).replace(/{{resourceValue}}/g,_resourceValue);

            //处理登录与未登录pin赋值情况
            Base.checkLogin(function(data){
                _check(data.enpin);
            },function(){
                _check("");
            });
        }
        /** 发送请求
         * @private
         */
        function _check(pin){
            pin = pin?pin:"";
            _CONFIG.url=_CONFIG.url.replace(/{{pin}}/g,pin).replace(/{{page}}/g,_page);
            var script = document.createElement("script");
            script.src = _CONFIG.url;
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        function _callbackFunc(data){
            _CONFIG.req = false;
            if(_page == 1){
                // $(_arg.loadTag).css("background-image",_CONFIG.imgTemp);
                $(_arg.loadTag).removeClass("loading");
            }
            _page++;
            setTimeout(function(){
                _callback(data);
                tips_parent.find(".load-tips").hide();
            },100);

        }
        /**
         * 数据处理
         * @private
         */
        function _callback(data){
            var li_arr = [],
                wareList = data.recommendList;
            if(wareList && wareList.length>0){
                for(var i =0;i < wareList.length;i++){
                    var _item = wareList[i];
                    //兼容[null]情况
                    if(!_item){
                        //msgAlert("请求无数据");
                        return;
                    }
                    li_arr.push('<li>'+
                        '<a href='+_detailUrl(_item.wareId,_item.sourcevalue)+' class="J_ping" report-eventid="Jshop_PullDown_ProductID" report-eventparam='+_item.sourcevalue+'>'+
                        '<div class="goods-pic"><img src='+_item.warePic+'></div>'+
                        '<div class="goods-name"><span title='+_item.wareName+'>'+_item.wareName+'</span></div>'+
                        '<div class="goods-price">￥<span class="jdNum" jshop="price" jdprice='+_item.wareId+'></span></div>'+
                        '</li>');
                }
                $(_arg.target).append(li_arr.join(''));
                //新增无线下拉url参数sourceType和sourceValue修改
                commonLoder.initActPageParams($(_arg.target));
            }
            /*else{
             msgAlert("请求无数据");
             }*/
        }

        /**
         * 根据app或m指定不同的url
         */
        function _detailUrl(skuId,sourcevalue){
            var url = location.href;
            //app
            if(/\/app\//.test(url)){
                //修改sourceType和sourceValue默认参数值
                return 'openApp.jdMobile://virtual?params={"category":"jump","des":"productDetail","skuId":"' + skuId + '","sourceType":"JSHOP_SOURCE_TYPE","sourceValue":"JSHOP_SOURCE_VALUE","landPageId":"jshop.cx.mobile"}';
//                return 'openapp.jdmobile://virtual?params={"category":"jump","des":"productDetail","skuId":"'+skuId+'","sourceType":"","sourceValue":"'+sourcevalue+'","landPageId":"jshop.cx.mobile"}';
            }
            //m
            else if(/\/m\//.test(url)){
                return INTERFACE.mCommon.product + skuId + '.html';
            }
        }
        window.callbackJsonp=_callbackFunc;
        _init();
    }

    win.jshop = jshop;
    jshop.widget.instance = typeof jshop.widget.instance === "undefined"? {}: jshop.widget.instance;
    jshop.widget.instance.moduleLoad = new jshop.widget.moduleLazyLoad();
    jshop.widget.instance.imgLoad = new jshop.widget.imgLazyLoad();
    jshop.widget.instance.priceLoad = new jshop.widget.priceLazyLoad();
    jshop.widget.alert();
    jshop.widget.confirm();

    function checkAll(){
        jshop.widget.instance.moduleLoad.check();
        jshop.widget.instance.imgLoad.reCheck();
        jshop.widget.instance.priceLoad.check();
    }

    $(window).on('scroll.lazyLoad', checkAll);

    /*修复在android4.3及以下版本webview物理返回键返回时滚动条位置定位会在dom树ready之后的问题*/
    setTimeout(function(){
        checkAll();
        $(".outer-container > div[module-name]").each(function(i, dom){
            if(i < 2){
                //第一次图片、价格懒加载结束后，就把首屏默认输出的2个模块的最小站位高度给去掉
                $(dom).css("height", "");
            }
        });
    }, 50);

})(window, $);

/**
 * 公共函数
 * @author bjlein
 */

;(function(win){

    win.commonLoder = {
        /**
         * 获取京东公共footer部分
         */
        footer : function(){
            $.ajax({
                url : INTERFACE.mCommon.footer + "?v=t",
                type : "post",
                data : {"sid": Base.getSid()},
                dataType : "html",
                success : function(html){
                    var _jLogin = $('body').append(html).find(".new-f-login a").eq(0);
                    _jLogin.attr("href", _jLogin.attr("href") + "&v=t&returnurl=" + encodeURIComponent(location.href));
                },
                error : function(XMLHttpRequest,textStatus,errorThrow){
                }
            });
        },
        /**
         * 获取京东公共header部分。装修不需要出现工具条
         */
        header : function(title, noNeedAppDownload){
            if(location.host === "jshop.jd.com"){
                noNeedAppDownload = "";
            }else{
                noNeedAppDownload = typeof noNeedAppDownload === "undefined"? "?downloadApp=true": "";
            }
            $.ajax({
                url : INTERFACE.mCommon.header + noNeedAppDownload,
                type : "post",
                data : {"title": title, "sid": Base.getSid()},
                dataType : "html",
                success : function(html){
                    $('body').prepend('<header>' + html + '</header>');
                },
                error : function(XMLHttpRequest,textStatus,errorThrow){
                }
            });
        },

        /**
         * 自动给页面里的链接都加上本页面的url参数
         */
		initActPageParams: function(moduleObj) {
            //新增判断app，参数配置
            var _url = window.location.href;
            var _search = window.location.search;
            var _pathName = _url.split("?")[0];
            var _hrefParamArr = _search.split("?")[1] ? _search.split("?")[1].split("&") : [];
            if(_url.indexOf("/app/") != -1){
                var _search_arr = _search.split("&"),
                    _resourceType = "default",
                    _resourceValue = "default",
                    _sourceType,_sourceValue,
                    _search_arr_len = _search_arr.length;
                if(moduleObj){
                    var openAppHref = moduleObj.find("a[href^='openApp.jdMobile']");
                    var openHref = moduleObj.find("a[href^='http://'],a[href^='https://'],a[href^='//']");
                }else{
                    var openAppHref = $("a[href^='openApp.jdMobile']");
                    var openHref = $("a[href^='http://'],a[href^='https://'],a[href^='//']");
                }
                if(_search_arr_len != 1){
                    $.map(_search_arr,function(item){
                        if(_resourceType == "default" && item.indexOf("resourceType") != -1){
                            _resourceType = item.split("=")[1] ? item.split("=")[1] : "JSHOP_SOURCE_TYPE";
                        }else if(_resourceValue == "default" && item.indexOf("resourceValue") != -1){
                            _resourceValue = item.split("=")[1] ? item.split("=")[1] : "JSHOP_SOURCE_VALUE";
                        }
                    });
                }
                //如果url中不含resourceType与resourceValue值则重新赋值为默认值
                _resourceType = _resourceType == "default" ? "JSHOP_SOURCE_TYPE" : _resourceType;
                _resourceValue = _resourceValue == "default" ? "JSHOP_SOURCE_VALUE" : _resourceValue;
                _sourceType = '"sourceType":"'+_resourceType+'"';
                _sourceValue = '"sourceValue":"'+_resourceValue+'"';
                openAppHref.each(function(){
                    var _beforeHref = $(this).attr("href"),_nowHref,
                        _beforeHrefArr = _beforeHref.split("="),
                        _refurlParams = JSON.parse(_beforeHrefArr[1]);
                    _refurlParams.refurl = _pathName;
                    _beforeHref = _beforeHrefArr[0]+"="+JSON.stringify(_refurlParams);
                    _nowHref = _beforeHref.replace(/"sourceType":"JSHOP_SOURCE_TYPE"/, _sourceType).replace(/"sourceValue":"JSHOP_SOURCE_VALUE"/,_sourceValue);
                    $(this).attr("href",_nowHref);
                });
                openHref.each(function(){
                    var _beforeHref = $(this).attr("href"),
                        _hrefParam = _beforeHref.split("?"),
                        _lastParam = "";
                    if(_hrefParam.length === 1){
                        $(this).attr("href", _beforeHref + _search);
                    }else{
                        $.map(_hrefParamArr,function(item){
                            if(_beforeHref.indexOf(item) == -1){
                                _lastParam = _lastParam + "&"+item.toLowerCase();
                            }
                        });
                        $(this).attr("href", _beforeHref + (_lastParam != "" ? _lastParam : ""));
                    }
                });
            }else{
                if(moduleObj){
                    var jHref = moduleObj.find("a[href^='http://'],a[href^='https://'],a[href^='//'],area[href^='http://'],area[href^='https://'],area[href^='//']");
                }else{
                    var jHref = $("a[href^='http://'],a[href^='https://'],a[href^='//'],area[href^='http://'],area[href^='https://'],area[href^='//']");
                }
                jHref.each(function(){
                    var href = $(this).attr("href"),
                        arrUrl = href.split("?");
                    if(arrUrl.length === 1){
                        $(this).attr("href", href + _search);
                    }else{
                        //$(this).attr("href", href + "&" + _search.substring(1));
                        //解决安卓部分机子微信异步加载导致参数下传传递两次问题
                        var _urlParamStr = _search.substring(1);
                        if(href.indexOf(_urlParamStr) == -1){
                            $(this).attr("href", href + "&" + _urlParamStr);
                        }
                    }
                });
            }
		},
		//广告预览
		getAdByUrl: function() {
            var g = $("#mobAppId").val(),suffix="mob_adv_",
                f = window.location.href, e = f.split("/"),
                appUrl = e[e.length - 1], appUrl = appUrl.split(".")[0], url = INTERFACE.actJshop.ad + "?id=" + g + "&type=2&appUrl=" + appUrl + "";
            $.ajax({url: url,dataType: "jsonp",jsonp: "callback",contentType: "application/jsonp; charset=utf-8",type: "post",success: function(m) {
                    for (var l = 0; l < m.length; l++) {
                        for (var k in m[l]) {
							$("#"+suffix+k).append(m[l][k]);
                            break;
                        }
                    }
                }});
        }
    };

    _init();

    function _init(){
        _bindTopBar();
        //accessType的值为intact，则认为是在app环境下访问
        if(Base.getURLParams().accessType !== 'intact'){
            _bindDetailPage();
        }
        _bindShowAppGoodsPage();
    }


    function _getUrlQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return encodeURIComponent(r[2]); return null;
    }


    function _bindShowAppGoodsPage(){
        if(window.location.href.indexOf("/app/act/") == -1){
            return;
        }
        if(_getUrlQueryString("cid")!="true"){
            return;
        }
        if(_getUrlQueryString("activityId")== null || _getUrlQueryString("activityId")== ""){
            return;
        }
        if(_getUrlQueryString("tip")== null || _getUrlQueryString("tip")== ""){
            return;
        }
        var openDestUrl = 'openApp.jdMobile://virtual?params={"category":"jump","des":"productList","from":"promotion","activityId":"'
            +_getUrlQueryString("activityId")+'","tip":"' + decodeURIComponent(_getUrlQueryString("tip"))+'"}';

        var barHtml = "<div style='position: fixed; top: 100px; right: 5px;  width: 60px; height: 60px; z-index: 10001'>" +
            "<a href='"+openDestUrl+"'>" +
            "<img style='width: 100%;' src='//img13.360buyimg.com/cms/jfs/t2356/193/440784357/12385/cac286f4/560b3d70Nb39edd58.png'/>" +
            "</a>" +
            "</div>";

        $("body").append(barHtml);
    }

    //返回顶部按钮
    function _bindTopBar(){
        $(function(){
            if($(".j-to-top").length === 0){
                var barHtml = "<div class='j-to-top' style='display: none; position: fixed; bottom: 59px; right: 0; width: 42px; height: 42px; z-index: 10001'><img style='width: 100%;' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFUAAABUCAYAAADzqXv/AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzU1OTUxOTAzMzRBMTFFNEEwMEVEMkNDRjYzQ0NGREMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzU1OTUxOTEzMzRBMTFFNEEwMEVEMkNDRjYzQ0NGREMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozNTU5NTE4RTMzNEExMUU0QTAwRUQyQ0NGNjNDQ0ZEQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozNTU5NTE4RjMzNEExMUU0QTAwRUQyQ0NGNjNDQ0ZEQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrHprYYAAAt+SURBVHja7J19TBNpHsen0zcKLS8ChXat6MqqLOChBDzY6IlveGc2eKh/GF8xWvX0yOrFyLmXrHiXNcvpKho2vgQXIb6AGiXebWCVw4AR9LQgipDDxSryUtDltaXvvd/UGRzr0PLSlwH6SybTl2n7zKff5/cy88wzLGSUZjKZEHsYAwxb4QtCsR74SYq1CW+LfRozvHZ/9BoLcZGRIKKhoaHM2tpaiVAoDONwOJ+y2Wwxk8kUoijqA5v5EGCBWT+sVEajUW0wGN7q9fpX/f39L1Qq1YuCgoJfYNt+EmSTKyBTqcChSsVBothSVVU1FWw+j8eLA5BR8Jb3KJui1el0T9Rq9cOenp6KQ4cOPT5z5ozG0YCplOpwqGRFlpWVBc6ePXuFl5fXlywWa5Yj1QLt+hVUXNzR0VEIf95TeMmILfaG61SoJJjMhoaGSIlEspXL5f7OFS4HXEUjqDc3LS2tEFev3eA6BSoZplwujxGJRFLo3nEIDQzgtvX29uYA2Kv79+9X2QOuw6HiQJkVFRWTo6Ki9nt4eCxCaGgAt7m9vf07sVj8H+zpaHwuFVTUXpEcDJVKpbzu7m7pvHnzbtAVKGaQWXwCPegE+Nwf7t+/H4K9xKCi46roT3T18vLyKbGxsf+Erh6BjCEDgSpBtenBwcE/YaqF50ZX56mY0pmvX79OhK70jR3SIlfky15BQUEZ4Gtjjh49mgHPlaP1taNRKpa0s2Uy2VcCgSDFTqp3qUExUQdp367Fixe3DRWsPX0qumHDBl5NTU0GAN0yHoCauy2LFbZgwYJccGXTR+NnR/Ih5pYtWzyzsrKOQTCaj4xDw0rg+vr6nREREbW4nzU5MqVC16xZ45mbm3t8vAIlge169uzZVqgA66yBHS1UFMo9Tm1tbYanp2ciMgEMwLaXlJRsTExMfDWYjx2NT8W2Y1VXV++eKEDxfFa4aNGirCNHjvgNJ/4whrgNC0rOZSEhIUfHS1AajqlUqtKZM2fugdRRY5nHjkSp5sS+qKgoZMqUKekTEShm0DsTqqqqNmDiGkpGYBMqOGruwoULv4XvEiAT2Pz9/VMfPHjw+VBSLYaN99gKhWKzUCj8C+I2RKvVPpk2bdrGlpYWNeEGhtP9zd3+2rVrkwMDA//kxvnOOBxOJKh1tS03YA0qa9myZanwWZ4b53sLDg7enZ2dHWDNdaKDqRT+kUg+n7/cjfGjNMsnOTl5O65WdDhQWeHh4TsmarS3ZT4+Pn+EqlI8mFpRKpWWlpbOhDTiCze+Qet97ooVK7AUi0kFlkkBmZ2ZmflnqO3D6LADer2ekZeXF3T16tUgcEnet27dmiQQCPRisVjrynZxudxPlUplQUVFhflEojWloikpKQJvb++ldAF69uxZkUwm8+nt7WW1trZyu7q62BcuXBBXVla6NG9GUZSfmpr6B5whYzCo5nPzBw4cSMCOhtMFaH19Pd/yPaPRiOTn54tcDRbSzS+Rd2dPrEJliUSiFXQGSiewPB4voqCgQGzpRslQ0YMHD/p6eXnF0A0otElPdRCDBmDR+Pj4xZYuACVH/XXr1sVTBC+XA929e/dr8nYQeTvoAtbX1zcOZ0YJFfX394+hI1DLSL906dJOuoCF1DMqMjKSS+71HygVNvgN3YHSDSxWxp88eXIW2QUQUNGtW7d6Qe4VMhaA0g3s1KlTP7dUqnlA2ebNmz9D7DQMyBlA6QSWz+d/RqlUoVA4ZawBpQtYqD4lllDNQQp2aPJYBEoHsBwOR0wFlcFms/3GKlBXg2WxWJMQ0kUgA9GfyWQ65WD0uXPngh0B1BbY6upqh5Xe8Fsea9eu9fgopQKoDq/3e3p6sKtQBI4Cag3s3bt3fR25b3PmzOFbdn/siLano6EKBAIDAFTjjx0CdDCwYWFhSkfuW0BAAJdgySIl/85IlJE9e/Y0NTY2ekgkEg0o1ejI38PAhoeHK3U6HSMkJETj6FhB7ObAoF+DwaByBliIlKZZs2b1OyvTcNbB7K6uLq2lTzWB33Hajo5Hk8lkhHsxDVRQ0EXcUEdoJpNJe/nyZSxWmAilmi8z1Gq1nW48I/anncj7C5Dfd39Id9rceEZmGo1Ggbw7+fehUpubm5vGwg7Y8XInu5lKpWpCSJfIE1CNOTk5z8kSppv5+fnpsHVwcLCabm2DyN9IVipRr7Jh4avV6itcLncyHaG+fPmS29DQwIuJien18fEx0KltxcXFu5YvX34PHmJ/uJHoSxhUz/b29r8HBgZOmOHn9or80dHRiVVVVb9i7pWcUmHSNbS2tj50Yxqe9fX11QHQfoQ0SmUg+mMvQq71ALEYwuI266ZQKCqRd1difxD9CaiGw4cPd/T29tbSsfHXr18P2LdvXyi2plO7SkpKynCoJiqlYm/o5HJ5MR2hlpeX+0GBgt67d8+XLm2CVOr5jh075CSlfgCV8Kv69PT0EnC+tEtb5s+f38lms43x8fFddGlTU1PTz5gQLZVKzqSxxxxYvDo6Or4NCAhIcHvMwc1oNGqkUmlydnZ2K55KGaiUOuACysrK8t3YrFtbW1sRAMXSKD1iY3yq2QWsWrXqKQSsx+5ANWhuaszPzy+g6vpUUE04eW1paek5d6CiNiiSft67d68ch/pRCkoFFSOvTUpKetTZ2VnpDlQf+VJ1VlbWObx60lMdL6E65GMe/AsL7/jx42GpqanZDAaD7fai76y+vv5sWFjYj/AQO9KvpVLqYMfRUDwT4D9//nz79OnTN7pxmvPSlzNmzNjS3NzcRYr4Jlvd39K3qleuXJkLXyZ3I0UMxcXF3wNQQqGDzlZhDarZtz59+rTv/Pnz/4DPayYy0cbGxoLk5ORHuC+1Pq+Kje9iEgXBo0ePVs2dO3fvRATa3d39JDw8/CtQaTc87SdDHckkCkY8bVBHR0cXwpf+a6IBVavVrWlpaQdh3/twldqcr8oWVMINYF+mio2NPf727dsHEwWoXq/vzszMPHDq1KkWPDDphzJt3VBGTg+AbWlp6V29enU6VFt1E6C2V0LV9DdQ6f9woDpkiOfwhjocfcAN3Llz521KSkoagH02joGqbty4cXD9+vVVuA/VIsOY/28453uJ+aTN57Pi4uIm3bx58xt/f//Y8QRUp9N15eTkfC2VSrFjHypb0d4eM6iRwfJEIpH3w4cP94nF4qXjASgEpTbwoX+FLt8wFKD2gmoJFhs97CmTyVZFRUVJ4Qc4YxUoBODKnTt3fnflypV2HKjWFlB7QiX7YwwsNtjVEyJk5KZNm7728PAQjSWYwExXU1PzI7izgv7+fiXuQ3VDAeoIqARYFl4g8BISEiZB9bVdIpH8HnHyNVkjMaVS2Xjp0qXvt23b9gSHqcGBDj0oOWKib/w7iMoLUy0vLy9vTlJS0naBQDCTpvmnsr6+/tKSJUuuKhSKPlKE1yPDnPTbYbOnk+40QajWgwdWVFS0BAqG9eASPqFJqqSRy+X/Tk9Pv5Sbm9uO55+a4XR3p0El/QCKq5aFq5YbFBTkefHixYUxMTHJoNwZLkqTel68ePFTRkbGjezsbAUOU0sEI2QUc1A7++YJLJJyMcCc06dPhyUmJi6HFOwLNpvt0NMi0C5DZ2dn9ePHj2/v2rWrvK6urg+HOKDMkarT6VAt4JKVy8YBs4VCIe/EiRMR0dHRvwUlR/H5/KmDTZw13IMfb968qWloaKiGfPO/hYWFnThALb7WkZRpl+FNrrwhDUoBeGANWYMAcsQZoaGh06BCkwDkIC6XGwBqFqAoysWvRjQaDAYNBJk+WKuhS/eBvYb8shns1e3bt385duyYAg82ehygnrSMqpvTCiqFWyCyBWsL8ScwEOqbfJnw4xHEYiAtAwBJ67F166RRpGEMUnVGVrM1oFRgLQEbSe+PzZt82bkdDIvF1iFJy1vS0WJ4/f8FGAAm3gZzhe5uDQAAAABJRU5ErkJggg=='/></div>";
                $("body").append(barHtml);
            }

            var jTopBar = $(".j-to-top"),
                height = $(window).height() * 3;
            $(window).bind("scroll", function(){
                var _top = document.documentElement.scrollTop || document.body.scrollTop;
                if(_top > height){
                    jTopBar.show();
                }else{
                    jTopBar.hide();
                }
            });
            jTopBar.bind("click", function(){
                $(this).hide();
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            });
        });
    }

    //处理M活动app地址在没有安装app情况下会打不开的问题
    function _bindDetailPage(){
        $("body").bind("click", function(e){
        	var g_sUA = navigator.userAgent.toLowerCase();
        	var jdApp = g_sUA.indexOf('jdapp');
        	if(jdApp == -1){
        		 var dom = e.target;
                 while(dom.tagName.toLowerCase() !== "body"){
                     if(dom.tagName.toLowerCase() === "a"){
                         var href = dom.getAttribute("href");
                         if(/^openApp\.jdMobile:\/\/virtual\?params=\{\"category\":\"jump\",\"des\":\"productDetail\"\,\"skuId\":\"(\d+)"/i.test(href)){
                             window.open(href,"_blank");
                             window.open(INTERFACE.mCommon.product + RegExp.$1 + ".html","_blank");
                             e.preventDefault();
                         }
                         break;
                     }else{
                         dom = dom.parentNode;
                     }
                 }
        	}
        });
    }

})(window);﻿/*
 * author: luxingyuan@jd.com
 * date: 2015-9-15 10:30:08
 * version: 1.0.1
*/

/*
  handle for goods-recommend module
*/
(function(){

    jshop = typeof jshop === "undefined"? {}: jshop;
    var funs = jshop.mStatistic = {};

    //商品推荐模块预处理
    funs.Jshop_ProductID = function(jRange){
        (jRange || $('[module-name="Jshop_ProductID"]')).each(function(index,n){
            var jTarget = $(n),
                name = jTarget.attr('module-name'),
                instanceid = jTarget.attr('instanceid');

            jTarget.find('a').each(function(){
                var jItem = $(this),
                    href = jItem.attr("href");
                //商品详情页的埋点
                if (/^http:\/\/item\.m\.jd\.com\/ware\/|^https:\/\/item\.m\.jd\.com\/ware\/|^\/\/item\.m\.jd\.com\/ware\/|^openApp\.jdMobile:\/\/virtual\?params=\{\"category\":\"jump\",\"des\":\"productDetail\"/i.test(href)) {
                    jItem.addClass('J_ping').attr('report-eventid', name).attr('report-eventparam', jItem.attr('href').match(/\d+/g)[0] + '_' + instanceid);
                }
            });

        });
    }

    //轮播图模块预处理
    funs.Jshop_FocusPic = function(jRange) {
        (jRange || $('[module-name="Jshop_FocusPic"]')).each(function(index,n){
            var target = $(n),
                name = target.attr('module-name'),
                instanceid = target.attr('instanceid');

            target.find('li a').each(function (i, m) {
                var item = $(m),
                    ind = i + 1;

                item.addClass('J_ping');
                item.attr('report-eventid', name);
                item.attr('report-eventparam', ind + '_' + item.attr('href').split('?')[0] + '_' + instanceid);
            });
        });
    }
    
    //导航模块预处理
    funs.Jshop_Navigation = function(jRange) {
        (jRange || $('[module-name="Jshop_Navigation"]')).each(function(index,n){
            var target = $(n),
                name = target.attr('module-name'),
                instanceid = target.attr('instanceid');

            target.find('a').each(function (i, m) {
                var item = $(m),
                    href = item.attr('href').replace(/^\s*/g, '');
                if (href.match(/^(http|https|\/\/)/)) {
                    item.addClass('J_ping');
                    item.attr('report-eventid', name);
                    item.attr('report-eventparam', href.split('?')[0] + '_' + instanceid);
                }
            });
        });
    }
    
    //图文推荐模块预处理
    funs.Jshop_ImgWord = function(jRange) {
        (jRange || $('[module-name="Jshop_ImgWord"]')).each(function(index,n){
            var target = $(n),
                name = target.attr('module-name'),
                instanceid = target.attr('instanceid');

            target.find('a').each(function(i,m){
                var item = $(m),
                    href = item.attr('href').replace(/^\s*/g,'');
                if(href.match(/^(http|https|\/\/)/)){
                    item.addClass('J_ping');
                    item.attr('report-eventid',name);
                    item.attr('report-eventparam',href.split('?')[0] + '_' + instanceid);
                }
            });
        });
    }
    
    //商品分类推荐模块预处理
    funs.Jshop_CategoryTab = function(jRange) {
        (jRange || $('[module-name="Jshop_CategoryTab"]')).each(function(index,n){
            var target = $(n),
                name = target.attr('module-name'),
                instanceid = target.attr('instanceid'), param;
            try {
                param = eval('(' + target.find('.j-module[module-function^="tab"]').attr('module-param') + ')');
            } catch (e) {
                param = {}
            }
            if (param === undefined || param.firstMenuSelector === undefined) return false;
            target.find(param.firstMenuSelector).each(function (i, m) {
                var item = $(m);

                item.addClass('J_ping');
                item.attr('report-eventid', name);
                item.attr('report-eventparam', item.text() + '_' + instanceid);
            });

            if (!param.secondMenuSelector) return false;

            target.find(param.secondMenuSelector).each(function (j) {
                var tabName = target.find(param.firstMenuSelector).eq(j).text();

                $(this).find('a').each(function(){
                    var jItem = $(this),
                        href = jItem.attr("href");
                    //商品详情页的埋点
                    if (/^http:\/\/item\.m\.jd\.com\/ware\/|^https:\/\/item\.m\.jd\.com\/ware\/|^\/\/item\.m\.jd\.com\/ware\/|^openApp\.jdMobile:\/\/virtual\?params=\{\"category\":\"jump\",\"des\":\"productDetail\"/i.test(href)) {
                        jItem.addClass('J_ping').attr('report-eventid', name).attr('report-eventparam', jItem.attr('href').match(/\d+/g)[0] + '_' + tabName + '_' + instanceid);
                    }
                });

            });
        });
    }
    
    //倒计时模块预处理
    funs.Jshop_CountDown = function(jRange) {
        (jRange || $('[module-name="Jshop_CountDown"]')).each(function(index,n){
            var jTarget = $(n),
                name = jTarget.attr('module-name'),
                instanceid = jTarget.attr('instanceid');

            jTarget.find('a').each(function(){
                var jItem = $(this),
                    href = jItem.attr("href");
                //商品详情页的埋点
                if (/^http:\/\/item\.m\.jd\.com\/ware\/|^https:\/\/item\.m\.jd\.com\/ware\/|^\/\/item\.m\.jd\.com\/ware\/|^openApp\.jdMobile:\/\/virtual\?params=\{\"category\":\"jump\",\"des\":\"productDetail\"/i.test(href)) {
                    jItem.addClass('J_ping').attr('report-eventid', name).attr('report-eventparam', jItem.attr('href').match(/\d+/g)[0] + '_' + instanceid);
                }
            });

        });
    }
    
    //团购模块预处理
    funs.Jshop_GroupBuy = function(jRange) {
        (jRange || $('[module-name="Jshop_GroupBuy"]')).each(function(index,n){
            var jTarget = $(n),
                name = jTarget.attr('module-name'),
                instanceid = jTarget.attr('instanceid');

            jTarget.find('[href*="teamId"]').each(function (i, m) {

                var item = $(m);

                item.addClass('J_ping');
                item.attr('report-eventid', name);
                item.attr('report-eventparam', item.attr('href').match(/\d+/g)[0] + '_' + instanceid);
            });
        });
    }
    
    //店铺推荐模块预处理
    funs.Jshop_ShopRec = function(jRange) {
        (jRange || $('[module-name="Jshop_ShopRec"]')).each(function(index,n){
            var jTarget = $(n),
                name = jTarget.attr('module-name'),
                instanceid = jTarget.attr('instanceid');

            jTarget.find('a[href*="m/index"]').each(function (i, m) {
                var item = $(m);

                item.addClass('J_ping');
                item.attr('report-eventid', name);
                item.attr('report-eventparam', item.attr('href') + '_' + instanceid);
            });
        });
    }
    
    //促销推荐模块预处理
    funs.Jshop_PromoRec = function(jRange) {
        (jRange || $('[module-name="Jshop_PromoRec"]')).each(function(index,n){
            var jTarget = $(n),
                name = jTarget.attr('module-name'),
                instanceid = jTarget.attr('instanceid');

            jTarget.find('a').each(function(){
                var jItem = $(this),
                    href = jItem.attr("href");
                //商品详情页的埋点
                if (/^http:\/\/item\.m\.jd\.com\/ware\/|^https:\/\/item\.m\.jd\.com\/ware\/|^\/\/item\.m\.jd\.com\/ware\/|^openApp\.jdMobile:\/\/virtual\?params=\{\"category\":\"jump\",\"des\":\"productDetail\"/i.test(href)) {
                    jItem.addClass('J_ping').attr('report-eventid', name).attr('report-eventparam', jItem.attr('href').match(/\d+/g)[0] + '_' + instanceid);
                }
            });

        });
    }
    
    //促销接龙模块预处理
    funs.Jshop_PromoTurns = function(jRange) {
        (jRange || $('[module-name="Jshop_PromoTurns"]')).each(function(index,n){
            var jTarget = $(n),
                name = jTarget.attr('module-name'),
                instanceid = jTarget.attr('instanceid');

            jTarget.find('a').each(function(){
                var jItem = $(this),
                    href = jItem.attr("href");
                //商品详情页的埋点
                if (/^http:\/\/item\.m\.jd\.com\/ware\/|^https:\/\/item\.m\.jd\.com\/ware\/|^\/\/item\.m\.jd\.com\/ware\/|^openApp\.jdMobile:\/\/virtual\?params=\{\"category\":\"jump\",\"des\":\"productDetail\"/i.test(href)) {
                    jItem.addClass('J_ping').attr('report-eventid', name).attr('report-eventparam', jItem.attr('href').match(/\d+/g)[0] + '_' + instanceid);
                }
            });

        });
    }
    
    //预售模块预处理
    funs.Jshop_PreSale = function(jRange) {
        (jRange || $('[module-name="Jshop_PreSale"]')).each(function(index,n){
            var jTarget = $(n),
                name = jTarget.attr('module-name'),
                instanceid = jTarget.attr('instanceid');

            jTarget.find('a').each(function(){
                var jItem = $(this),
                    href = jItem.attr("href");
                //商品详情页的埋点
                if (/^http:\/\/item\.m\.jd\.com\/ware\/|^https:\/\/item\.m\.jd\.com\/ware\/|^\/\/item\.m\.jd\.com\/ware\/|^openApp\.jdMobile:\/\/virtual\?params=\{\"category\":\"jump\",\"des\":\"productDetail\"/i.test(href)) {
                    jItem.addClass('J_ping').attr('report-eventid', name).attr('report-eventparam', jItem.attr('href').match(/\d+/g)[0] + '_' + instanceid);
                }
            });

        });
    }

    //店铺活动推荐处理
    //埋点位置：商品、更多商品、宣传图片、宣传语
    funs.Jshop_Commended = function(jRange){
        (jRange || $('[module-name="Jshop_Commended"]')).each(function(index,n){
            var jTarget = $(n),
                name = jTarget.attr('module-name'),
                instanceid = jTarget.attr('instanceid'),
                countGood = 1,
                countPic = 1;

            jTarget.find('a').each(function (i, m) {
                var jItem = $(m),
                    href = jItem.attr("href");

                //商品详情页的埋点
                if (/^http:\/\/item\.m\.jd\.com\/ware\/|^https:\/\/item\.m\.jd\.com\/ware\/|^\/\/item\.m\.jd\.com\/ware\/|^openApp\.jdMobile:\/\/virtual\?params=\{\"category\":\"jump\",\"des\":\"productDetail\"/i.test(href)) {
                    jItem.addClass('J_ping').attr('report-eventid', name + '_ProductID').attr('report-eventparam', countGood++ + '_' + href.match(/\d+/g)[0] + '_' + instanceid);
                }
                //宣传图片埋点
                else if(jItem.hasClass("j-ad-pic")){
                    jItem.addClass('J_ping').attr('report-eventid', name + '_Pic').attr('report-eventparam', countPic++ + "_" + instanceid + "_" + href);
                }
                //宣传语埋点
                else if(jItem.hasClass("j-ad-word")){
                    jItem.addClass('J_ping').attr('report-eventid', name + '_Url').attr('report-eventparam', instanceid + "_" + href);
                }
                //更多商品埋点
                else if(jItem.hasClass("j-more-goods")){
                    jItem.addClass('J_ping').attr('report-eventid', name + '_GotoShop').attr('report-eventparam', instanceid);
                }

            });

        });
    }

    //热门排行模块埋点
    //埋点位置：tab标签、商品位
    funs.Jshop_Hot = function(jRange){
        (jRange || $('[module-name="Jshop_Hot"]')).each(function(index,n){
            var jTarget = $(n),
                name = jTarget.attr('module-name'),
                instanceid = jTarget.attr('instanceid');

            //商品位埋点
            jTarget.find('a').each(function (i, m) {
                var jItem = $(m),
                    href = jItem.attr("href");

                //商品位埋点
                if (/^http:\/\/item\.m\.jd\.com\/ware\/|^https:\/\/item\.m\.jd\.com\/ware\/|^\/\/item\.m\.jd\.com\/ware\/|^openApp\.jdMobile:\/\/virtual\?params=\{\"category\":\"jump\",\"des\":\"productDetail\"/i.test(href)) {
                    jItem.addClass('J_ping').attr('report-eventid', name + '_ProductID').attr('report-eventparam', (i + 1) + '_' + href.match(/\d+/g)[0] + '_' + instanceid);
                }

            });

            //tab埋点
            jTarget.find(".j-hot-nav").each(function(i, m){
                $(m).addClass('J_ping').attr('report-eventid', name + '_Tab').attr('report-eventparam', (i + 1) + "_" + $(m).text() + "_" + instanceid);
            });

        });
    }

    //自定义内容区处理
    funs.Jshop_Html_Content = function(jRange) {
        (jRange || $('[module-name="Jshop_Html_Content"]')).each(function(index,n){
            var target = $(n),
                name = target.attr('module-name'),
                instanceid = target.attr('instanceid');

            var len = target.find('a').each(function (i, m) {

                var item = $(m),
                    href = item.attr("href"),
                    ind = i + 1;

                //单品页
                if (/^http:\/\/item\.m\.jd\.com\/ware\/|^https:\/\/item\.m\.jd\.com\/ware\/|^\/\/item\.m\.jd\.com\/ware\/|^openApp\.jdMobile:\/\/virtual\?params=\{\"category\":\"jump\",\"des\":\"productDetail\"/i.test(href)) {
                    item.addClass('J_ping');
                    item.attr('report-eventid', name);
                    item.attr('report-eventparam', ind + '_' + href.match(/\d+/g)[0] + '_' + instanceid);
                } else if (/^http:\/\/|^https:\/\/|^\/\/|^openApp/i.test(href)) {        //其他有效链接页
                    item.addClass('J_ping');
                    item.attr('report-eventid', name);
                    item.attr('report-eventparam', ind + '_' + href + '_' + instanceid);
                }

            }).length;

            //针对热区
            target.find("area").each(function () {
                var item = $(this),
                    href = item.attr("href");
                item.addClass('J_ping');
                item.attr('report-eventid', name);
                item.attr('report-eventparam', ++len + '_' + href + '_' + instanceid);
            });
        });
    }

    //初始化的时候默认各个模块都执行一次埋点伪属性添加操作
    for(var fun in funs){
        funs[fun]();
    }

})();