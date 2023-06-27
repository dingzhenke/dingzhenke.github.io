(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{443:function(r,t,a){"use strict";a.r(t);var e=a(2),o=Object(e.a)({},(function(){var r=this,t=r._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":r.$parent.slotKey}},[t("p"),t("div",{staticClass:"table-of-contents"},[t("ul")]),r._v("\ncluster模块顾名思义，是集群相关的模块，该模块又分为以下几个子模块（源码结构来看）：\n1、configurator\n2、directory\n3、loadbalance\n4、merger\n5、router\n6、support\n下面就让我们一个一个来分析"),t("p"),r._v(" "),t("h1",{attrs:{id:"configurator"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#configurator"}},[r._v("#")]),r._v(" configurator")]),r._v(" "),t("p",[r._v("我们先看AbstractConfigurator,它实现Configurator，结合Configurator的注释以及AbstractConfigurator的实现,我们大致可以理解Configurator就是将传入的URL里的部分参数与Configurator持有的URL整合。得到新的URL。")]),r._v(" "),t("h1",{attrs:{id:"directory"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#directory"}},[r._v("#")]),r._v(" directory")]),r._v(" "),t("p",[r._v("照例，我们先看AbstractDirectory，它实现了Directory接口，通过查看Directory接口，我们可以知道，Directory的主要作用是通过list(Invocation invocation)方法返回Invoker列表。接下来我们接着来看AbstractDirectory，可以发现它的list方法实际是调用了由子类实现的doList方法，而AbstractDirectory子类有两个，但是doList操作基本一样，所以我们只看StaticDirectory的实现，其实现如下：")]),r._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[r._v('    protected List<Invoker<T>> doList(Invocation invocation) throws RpcException {\n        List<Invoker<T>> finalInvokers = invokers;\n        if (routerChain != null) {\n            try {\n                finalInvokers = routerChain.route(getConsumerUrl(), invocation);\n            } catch (Throwable t) {\n                logger.error("Failed to execute router: " + getUrl() + ", cause: " + t.getMessage(), t);\n            }\n        }\n        return finalInvokers == null ? Collections.emptyList() : finalInvokers;\n    }\n')])])]),t("p",[r._v("可以看到，基本就是返回自己的所有invoker，如果有routerChain，就调用routeChain和route方法。routeChain通过其持有的Router依次对Invoker列表进行route操作。")]),r._v(" "),t("h1",{attrs:{id:"loadbalance"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#loadbalance"}},[r._v("#")]),r._v(" loadBalance")]),r._v(" "),t("p",[r._v("顾名思义，该子模块负责负载均衡。通过查看LoadBalance接口，也验证了我们的猜测，其select方法功能就是从一组Invoker中选择一个Invoker，Dubbo官方支持以下几种选择算法：")]),r._v(" "),t("ul",[t("li",[r._v("ConsistentHashLoadBalance：一致性hash算法")]),r._v(" "),t("li",[r._v("LeastActiveLoadBalance：最少使用算法")]),r._v(" "),t("li",[r._v("RandomLoadBalance：随机算法")]),r._v(" "),t("li",[r._v("RoundRobinLoadBalance:轮询算法\n其中除了一致性hash算法外，都支持加权。")])]),r._v(" "),t("h1",{attrs:{id:"merger"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#merger"}},[r._v("#")]),r._v(" merger")]),r._v(" "),t("p",[r._v("作用就是将多个数组合并成一个数组。")]),r._v(" "),t("h1",{attrs:{id:"router"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#router"}},[r._v("#")]),r._v(" router")]),r._v(" "),t("p",[r._v("上面介绍directory的时候提到过Router，它的主要作用就是从一组Invoker中选择满足特定条件的一组Invoker。")]),r._v(" "),t("p",[r._v("到此cluster模块的分析暂时告一段落。同时RPC模块的分析也暂时分析到这里。")])])}),[],!1,null,null,null);t.default=o.exports}}]);