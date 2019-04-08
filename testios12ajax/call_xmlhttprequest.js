var cache = {};

var done = false;
var syncByNA = location.href.toLowerCase().indexOf("syncbyna=1") != -1;

function iosInvoke(scheme) {
    var elm = document.createElement('iframe');
    var body = document.body || document.documentElement;
    elm.style.display = 'none';
    elm.src = scheme;
    body.appendChild(elm);
    body.removeChild(elm);
    elm = null;
}

function testCompletion() {
    alert(" test completion ! ");
}

function handler(type, word) {
    //function onCompletion() {
    // alert("执行 completion 函数");
    //if (type == "submit") {
    // done = true;
    // alert("js日志：尝试获取cache");
    // var result = cache[word];
    //if (result) {
    // alert("js日志：cache获取成功，开始渲染");
    //  var doc = new DOMParser().parseFromString(result, "text/html");
    //  document.body.innerHTML = doc.body.innerHTML;
    // } else {
    //    alert("js日志：cache获取失败");
    //var url = "/s?word=" + word;
    //var absUrl = "http://yq01-paddle-mobile.epc.baidu.com:8081" + url;
    // var scheme = "baidudemo://searchframe?action=asyncpagefail&url=" + encodeURIComponent(absUrl);
    // console.log(scheme);
    // iosInvoke(scheme);
    //    if (syncByNA) {
    //  } else {
    //   alert("js日志：通过前端主动转同步 url: " + url);
    //   console.log(url);
    //  location.href = url;
    //}
    //   }
    //  }
    // }
    alert("[WebKit] jslog：process message");
    //if (type == "submit") {
    //   setTimeout(function() {
    //    if (!done) {
    //     alert("js 日志: 触发了 14s 超时");
    //   onCompletion();
    //    }
    // }, 14000);
    //}
    //if (cache[word]) {
    //  onCompletion();
    //} else {
    alert("[WebKit] jslog：startsend ajax request");
    $.ajax({
           // url: "s?word=" + word
          url :"test.html"
          // url: "https://m.baidu.com/s?word=" + word
           }).done(function(result){
                   alert("[WebKit] jslog：：ajax success");
                   // result = result.replace(/m\.baidu\.com/gi, "yq01-paddle-mobile.epc.baidu.com:8081");
                   //if (result.indexOf("results") != -1) {
                   //   cache[word] = result;
                   //  }
                   //    onCompletion();
                   }).fail(function(xhr, textStatus, errorThrown){
                           alert(" ajax falied");
                           //   onCompletion();
                           // alert("failed after completion");
                           });
    alert("[WebKit] jslog：ajax called exec");
    //   }
}

window.addEventListener("message", function(event){
                        alert("[WebKit] jslog：recv message");
                        console.log(event);
                        var type = event.data.type;
                        var word = event.data.word;
                        if (type == "submit") {
                        handler(event.data.type, event.data.word);
                        }
                        // else if (type == "inputting") {
                        // if (word.length % 3 == 0) {
                        //   handler(event.data.type, event.data.word);
                        // }
                        // }
                        });

// window.postMessage({"type": "submit", "word": "123"});
