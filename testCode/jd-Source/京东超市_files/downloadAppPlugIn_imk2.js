(function() {
	var E = navigator.userAgent;
	var J = E.match(/Chrome/i) != null && E.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i) == null ? true: false;
	var K = (E.match(/(Android);?[\s\/]+([\d.]+)?/)) ? true: false;
	var a = (E.match(/(iPad).*OS\s([\d_]+)/)) ? true: false;
	var q = (!a && E.match(/(iPhone\sOS)\s([\d_]+)/)) ? true: false;
	var c = (q || a) && E.match(/Safari/);
	var I = 0;
	c && (I = E.match(/Version\/([\d\.]+)/));
	I = parseFloat(I[1], 10);
	var k = navigator.userAgent.indexOf("MicroMessenger") >= 0;
	var j = false;
	var s = "plugIn_downloadAppPlugIn_loadIframe";
	var t = false;
	var i = 0;
	var B = {};
	var b = {};
	var f = null;
	var H = {};
	var u = window.Zepto || window.jQuery ? true: false;
	var g = [];
	var v = window.localStorage ? true: false;
	var o = "mdownloadAppPlugInskip";
	var p = null;
	function m() {
		var M = new Date();
		var N = M.getFullYear();
		var O = M.getMonth() + 1;
		var L = M.getDate();
		strDate = N + "-" + O + "-" + L;
		return strDate
	}
	function r() {
		WeixinJSBridge.invoke("getInstallState", {
			packageName: "com.jingdong.app.mall",
			packageUrl: "openApp.jdMobile://"
		}, function(M) {
			var N = M.err_msg, L = 0;
			if (N.indexOf("get_install_state:yes")>-1) {
				j = true
			}
		})
	}
	function d(N, M, L) {
		if (u) {
			f("#" + N).bind(M, L)
		} else {
			f("#" + N).addEventListener(M, L, !1)
		}
	}
	function z(L) {
		var M = (L || "mGen") + (++i);
		return M
	}
	if (k) {
		if (window.WeixinJSBridge && WeixinJSBridge.invoke) {
			r()
		} else {
			document.addEventListener("WeixinJSBridgeReady", r, !1)
		}
	}
	if (u) {
		f = window.$;
		H = window.$
	} else {
		f = function(L) {
			if (typeof L == "object") {
				return L
			}
			return document.querySelector(L)
		};
		if (!window.$) {
			window.$ = H = f
		} else {
			H = window.$
		}
	}
	window.onblur = function() {
		for (var L = 0; L < g.length; L++) {
			clearTimeout(g[L])
		}
	};
	function e(N) {
		var M = document.cookie.indexOf(N + "=");
		if (M==-1) {
			return ""
		}
		M = M + N.length + 1;
		var L = document.cookie.indexOf(";", M);
		if (L==-1) {
			L = document.cookie.length
		}
		return document.cookie.substring(M, L)
	}
	function l(N, P, L, Q, O) {
		var R = N + "=" + escape(P);
		if (L != "") {
			var M = new Date();
			M.setTime(M.getTime() + L * 24 * 3600 * 1000);
			R += ";expires=" + M.toGMTString()
		}
		if (Q != "") {
			R += ";path=" + Q
		}
		if (O != "") {
			R += ";domain=" + O
		}
		document.cookie = R
	}
	function F(L) {
		var N = {
			downAppURl: "http://h5.m.jd.com/active/download/download.html?channel=jd-m",
			downAppIos: "http://union.m.jd.com/download/go.action?to=http%3A%2F%2Fitunes.apple.com%2Fcn%2Fapp%2Fid414245413&client=apple&unionId=12532&subunionId=m-top&key=e4dd45c0f480d8a08c4621b4fff5de74",
			downWeixin: "http://a.app.qq.com/o/simple.jsp?pkgname=com.jingdong.app.mall&g_f=991850",
			downIpad: "https://itunes.apple.com/cn/app/jing-dong-hd/id434374726?mt=8",
			inteneUrl: "openApp.jdMobile://360buy?type=1",
			inteneUrlParams: null,
			openAppBtnId: "",
			closePanelBtnId: "",
			closePanelId: "",
			closeCallblack: null,
			closeCallblackSource: null,
			cookieFlag: null,
			noRecord: false,
			sourceType: "JSHOP_SOURCE_TYPE",
			sourceValue: "JSHOP_SOURCE_VALUE",
			openAppEventId: "MDownLoadFloat_OpenNow",
			closePanelEventId: "MDownLoadFloat_Close"
		};
		if (L) {
			for (var M in L) {
				if (M && L[M]) {
					N[M] = L[M]
				}
			}
		}
		return N
	}
	function w(N, L) {
		var R = h(N);
		var O = null;
		if (k) {
			var M = null;
			if (j) {
				M = R
			} else {
				M = N.downWeixin
			}
			location.href = M;
			return 
		}
		if (a) {
			O = N.downIpad
		} else {
			if (q) {
				O = N.downAppIos
			} else {
				O = N.downAppURl
			}
		}
		if (J) {
			if (K) {
				var Q = R;
				R = y(Q);
				setTimeout(function() {
					window.location.href = R
				}, 50)
			}
		}
		if (c && I >= 9) {
			setTimeout(function() {
				var S = document.createElement("a");
				S.setAttribute("href", R), S.style.display = "none", document.body.appendChild(S);
				var T = document.createEvent("HTMLEvents");
				T.initEvent("click", !1, !1), S.dispatchEvent(T)
			}, 0)
		} else {
			document.querySelector("#" + s).src = R
		}
		var P = Date.now();
		setTimeout(function() {
			if (L) {
				var S = setTimeout(function() {
				alert('1500 ms time out');
					x(P, O)
				}, 1500);
				g.push(S)
			}
		}, 100)
	}
	function x(N, M) {
	alert(M);
		var L = Date.now();
		if (N && (L - N) < (1500 + 200)) {
			window.location.href = M
		}
	}
	function h(N) {
		var V = [];
		var P = N.inteneUrlParams;
		var T = {
			category: "jump",
			des: "productDetail"
		};
		if (N.sourceType && N.sourceValue) {
			T.sourceType = N.sourceType;
			T.sourceValue = N.sourceValue;
			if (P&&!P.sourceType&&!P.sourceValue) {
				P.sourceType = N.sourceType;
				P.sourceValue = N.sourceValue
			}
		}
		if (P) {
			for (var U in P) {
				if (U && P[U]) {
					V.push('"' + U + '":"' + P[U] + '"')
				}
			}
		} else {
			for (var U in T) {
				if (U && T[U]) {
					V.push('"' + U + '":"' + T[U] + '"')
				}
			}
		}
		try {
			var Q = MPing.EventSeries.getSeries();
			if (Q) {
				var W = JSON.parse(Q);
				W.jdv = encodeURIComponent(e("__jdv"));
				W.unpl = encodeURIComponent(e("unpl"));
				W.mt_xid = encodeURIComponent(e("mt_xid"));
				W.mt_subsite = encodeURIComponent(e("mt_subsite"))
			}
			var S = {
				mt_subsite: encodeURIComponent(e("mt_subsite")),
				__jdv: encodeURIComponent(e("__jdv")),
				unpl: encodeURIComponent(e("unpl")),
				__jda: encodeURIComponent(e("__jda"))
			};
			Q = JSON.stringify(W);
			V.push('"m_param":' + Q);
			V.push('"SE":' + JSON.stringify(S))
		} catch (R) {
			V.push('"m_param":null')
		}
		var M = "{" + V.join(",") + "}";
		var O = N.inteneUrl.split("?");
		var L = null;
		if (O.length == 2) {
			L = O[0] + "?" + O[1] + "&params=" + M
		} else {
			L = O[0] + "?params=" + M
		}
		return L
	}
	function y(L) {
		return "intent://m.jd.com/#Intent;scheme=" + L + ";package=com.jingdong.app.mall;end"
	}
	function n(L) {
		if (L.openAppBtnId) {
			B[L.openAppBtnId] = L;
			G(L.openAppBtnId, L.openAppEventId);
			d(L.openAppBtnId, "click", function() {
				var P = this.getAttribute("id");
				var M = B[P];
				if (!t) {
					var N = document.createElement("iframe");
					N.id = s;
					document.body.appendChild(N);
					document.getElementById(s).style.display = "none";
					document.getElementById(s).style.width = "0px";
					document.getElementById(s).style.height = "0px";
					t = true
				}
				var O = M.cookieFlag ? "downloadAppPlugIn_downCloseDate_" + M.cookieFlag: "downloadAppPlugIn_downCloseDate";
				l(O, Date.now() + "_2592000000", 60, "/", "m.jd.com");
				l(O, Date.now() + "_2592000000", 60, "/", "m.jd.hk");
				w(M, true)
			})
		}
	}
	function D(M) {
		if (M.closePanelBtnId && M.closePanelId) {
			B[M.closePanelBtnId] = M;
			G(M.closePanelBtnId, M.closePanelEventId);
			var Q = M.cookieFlag ? "downloadAppPlugIn_downCloseDate_" + M.cookieFlag: "downloadAppPlugIn_downCloseDate";
			var O = e(Q);
			var P = null;
			if (O) {
				P = O.split("_");
				if (P.length == 2) {
					P[0] = parseInt(P[0], 10);
					P[1] = parseInt(P[1], 10)
				} else {
					P = null
				}
			}
			var L = Date.now();
			if (A() || (!M.noRecord && P && P.length == 2 && (L - P[0]) < P[1])) {
				document.querySelector("#" + M.closePanelId).style.display = "none";
				if (M.closeCallblack) {
					var N = M.closeCallblackSource ? M.closeCallblackSource: null;
					M.closeCallblack.call(N)
				}
				return 
			} else {
				document.querySelector("#" + M.closePanelId).style.display = "block"
			}
			d(M.closePanelBtnId, "click", function() {
				var U = this.getAttribute("id");
				var R = B[U];
				var T = R.cookieFlag ? "downloadAppPlugIn_downCloseDate_" + R.cookieFlag: "downloadAppPlugIn_downCloseDate";
				if (!R.noRecord) {
					l(T, Date.now() + "_259200000", 60, "/", "m.jd.com");
					l(T, Date.now() + "_259200000", 60, "/", "m.jd.hk")
				}
				document.querySelector("#" + R.closePanelId).style.display = "none";
				if (R.closeCallblack) {
					var S = R.closeCallblackSource ? R.closeCallblackSource: null;
					R.closeCallblack.call(S)
				}
			})
		}
	}
	function A() {
		var M = E.indexOf("jdmsxh");
		var L = E.indexOf("jdmsxh2");
		if (E.indexOf("Html5Plus") >= 0 || (M >= 0 && M != L)) {
			return true
		} else {
			return false
		}
	}
	function G(P, M) {
		try {
			var O = document.getElementById(P);
			var L = O.className;
			if (L) {
				L = L + " J_ping"
			} else {
				L = "J_ping"
			}
			O.className = L;
			O.setAttribute("report-eventid", M);
			if (E.indexOf("jdmsxh2") >= 0) {
				O.setAttribute("event_param", 1)
			} else {
				O.setAttribute("event_param", 0)
			}
		} catch (N) {}
	}
	function C(L) {
		var M = F(L);
		n(M);
		D(M)
	}
	H.downloadAppPlugIn = C;
	H.downloadAppPlugInOpenApp = function(L) {
		var M = F(L);
		w(M)
	}
})();

