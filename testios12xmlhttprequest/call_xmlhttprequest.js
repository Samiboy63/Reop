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
    alert("[WebKit] jslog：process message");
    alert("[WebKit] jslog：start send ajax request");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/testios12xmlhttprequest/test.html", true);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          alert("[WebKit] jslog：ajax request success");
          // console.log(xhr.responseText);
        } else {
          // console.error(xhr.statusText);
          alert(" ajax falied");
        }
      }
    };
    xhr.onerror = function (e) {
      alert(" ajax failed one " + xhr.statusText);
    };
    xhr.send(null);
    alert("[WebKit] jslog：ajax called exec");

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
