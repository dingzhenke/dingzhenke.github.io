(window.webpackJsonp=window.webpackJsonp||[]).push([[37],{457:function(t,e,l){"use strict";l.r(e);var n=l(2),s=Object(n.a)({},(function(){var t=this,e=t._self._c;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("p"),e("div",{staticClass:"table-of-contents"},[e("ul")]),t._v("\nnetty实现零拷贝，主要是通过一下几个途径："),e("p"),t._v(" "),e("ol",[e("li",[t._v("使用直接内存，netty使用直接内存当buffer，免去了一次堆内存到直接内存的拷贝。")]),t._v(" "),e("li",[t._v("使用CompositeBuff，逻辑上组合多个buffer为一个，免去拷贝")]),t._v(" "),e("li",[t._v("使用wrap方法，把字节数组等包装成buffer，免去拷贝")]),t._v(" "),e("li",[t._v("使用slice操作，和CompositeBuff相反，切分buffer。")])])])}),[],!1,null,null,null);e.default=s.exports}}]);