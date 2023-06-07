(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{442:function(e,r,o){"use strict";o.r(r);var t=o(2),n=Object(t.a)({},(function(){var e=this,r=e._self._c;return r("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[r("p"),r("div",{staticClass:"table-of-contents"},[r("ul",[r("li",[r("a",{attrs:{href:"#exportlocal"}},[e._v("exportLocal")])]),r("li",[r("a",{attrs:{href:"#发布到远程"}},[e._v("发布到远程")])])])]),e._v("\n前面我们已经分析了RPC模块，也理解了Dubbo中的export和refer主要由Protocol负责，那Dubbo实际是如何实现的呢？现在我们就来看看，它是如何实现的。本节我们分析export。"),r("p"),e._v(" "),r("p",[e._v("dubbo中服务的导出源自ServiceConfig的export方法，其源码如下：")]),e._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[e._v("    public synchronized void export() {\n        checkAndUpdateSubConfigs();\n\n        if (!shouldExport()) {\n            return;\n        }\n\n        if (shouldDelay()) {\n            DELAY_EXPORT_EXECUTOR.schedule(this::doExport, getDelay(), TimeUnit.MILLISECONDS);\n        } else {\n            doExport();\n        }\n    }\n")])])]),r("p",[e._v("其中配置的检查和处理我们就不细看了，我们只看核心的doExport,追踪doExport，我们来到doExportUrlsFor1Protocol方法，该方法比较大，我把源码做下简化，如下：")]),e._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[e._v("    private void doExportUrlsFor1Protocol(ProtocolConfig protocolConfig, List<URL> registryURLs) {\n        //整合各种配置参数\n        ...... \n        // 整合需要导出的方法参数\n        ......\n        //整合其他参数\n        ......\n        // 获取待注册的URL\n        ......\n        String scope = url.getParameter(SCOPE_KEY);\n        // don't export when none is configured\n        if (!SCOPE_NONE.equalsIgnoreCase(scope)) {\n\n            // export to local if the config is not remote (export to remote only when config is remote)\n            if (!SCOPE_REMOTE.equalsIgnoreCase(scope)) {\n                exportLocal(url);\n            }\n            // export to remote if the config is not local (export to local only when config is local)\n            if (!SCOPE_LOCAL.equalsIgnoreCase(scope)) {\n                if (CollectionUtils.isNotEmpty(registryURLs)) {\n                    for (URL registryURL : registryURLs) {\n                        //获取monitor、代理信息等\n                        ......\n                        Invoker<?> invoker = PROXY_FACTORY.getInvoker(ref, (Class) interfaceClass, registryURL.addParameterAndEncoded(EXPORT_KEY, url.toFullString()));\n                        DelegateProviderMetaDataInvoker wrapperInvoker = new DelegateProviderMetaDataInvoker(invoker, this);\n                        Exporter<?> exporter = protocol.export(wrapperInvoker);\n                        exporters.add(exporter);\n                    }\n                } else {\n                    ......\n                    Invoker<?> invoker = PROXY_FACTORY.getInvoker(ref, (Class) interfaceClass, url);\n                    DelegateProviderMetaDataInvoker wrapperInvoker = new DelegateProviderMetaDataInvoker(invoker, this);\n                    Exporter<?> exporter = protocol.export(wrapperInvoker);\n                    exporters.add(exporter);\n                }\n                ......\n            }\n        }\n        this.urls.add(url);\n    }\n")])])]),r("p",[e._v("该方法核心部分就是：\n1、如果没有配置只远程发布，则需要发布到本地exportLocal(url)\n2、如果没有配置只本地发布，则需要发布到远程：\n2.1 如果配置了注册中心，则暴露服务时每个注册中心都注册一遍\n2.2 如果没有配置注册中心，则只是暴露服务")]),e._v(" "),r("h2",{attrs:{id:"exportlocal"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#exportlocal"}},[e._v("#")]),e._v(" exportLocal")]),e._v(" "),r("p",[e._v("我们先来看看它是怎么暴露服务到本地的，代码如下：")]),e._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[e._v('    private void exportLocal(URL url) {\n        URL local = URLBuilder.from(url)\n                .setProtocol(LOCAL_PROTOCOL)\n                .setHost(LOCALHOST_VALUE)\n                .setPort(0)\n                .build();\n        Exporter<?> exporter = protocol.export(\n                PROXY_FACTORY.getInvoker(ref, (Class) interfaceClass, local));\n        exporters.add(exporter);\n        logger.info("Export dubbo service " + interfaceClass.getName() + " to local registry url : " + local);\n    }\n')])])]),r("p",[e._v("可以看到它是直接调用协议的export方法导出Invoker，那我们来看看它是如何生成这个Invoker的，可以看到它是调用PROXY_FACTORY的getInvoker方法，这里使用Dubbo的SPI机制，最终调用\nJavassistProxyFactory的getInvoker方法，该方法如下：")]),e._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[e._v("    public <T> Invoker<T> getInvoker(T proxy, Class<T> type, URL url) {\n        // TODO Wrapper cannot handle this scenario correctly: the classname contains '$'\n        final Wrapper wrapper = Wrapper.getWrapper(proxy.getClass().getName().indexOf('$') < 0 ? proxy.getClass() : type);\n        return new AbstractProxyInvoker<T>(proxy, type, url) {\n            @Override\n            protected Object doInvoke(T proxy, String methodName,\n                                      Class<?>[] parameterTypes,\n                                      Object[] arguments) throws Throwable {\n                return wrapper.invokeMethod(proxy, methodName, parameterTypes, arguments);\n            }\n        };\n    }\n")])])]),r("p",[e._v("可以看到这里是获取或者生成一个Wrapper，然后返回一个AbstractProxyInvoker。Wrapper是使用javassist动态生成的，它的核心方法就是代理暴露服务的方法，当调用Wrapper的invokeMethod时，就调用暴露的服务方法。然后我们再看AbstractProxyInvoker这个类。它的核心代码就是实现的Invoker接口的invoke方法：")]),e._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[e._v("    public Result invoke(Invocation invocation) throws RpcException {\n        ......\n        Object value = doInvoke(proxy, invocation.getMethodName(), invocation.getParameterTypes(), invocation.getArguments());\n        CompletableFuture<Object> future = wrapWithFuture(value, invocation);\n        AsyncRpcResult asyncRpcResult = new AsyncRpcResult(invocation);\n        future.whenComplete((obj, t) -> {\n            AppResponse result = new AppResponse();\n            if (t != null) {\n                if (t instanceof CompletionException) {\n                    result.setException(t.getCause());\n                } else {\n                    result.setException(t);\n                }\n            } else {\n                result.setValue(obj);\n            }\n            asyncRpcResult.complete(result);\n        });\n        return asyncRpcResult;\n        ......\n    }\n")])])]),r("p",[e._v("可以看到它第一步就调用了doInvoker方法，而上一步生成的AbstractProxyInvoker的doInvoker方法只是调用wrapper.invokeMethod，至此我们可以明白，这里调用doInvoke时实际上就是调用了暴露的服务方法，invoke方法调用doInvoke获取结果之后，将结果进行了一些同步和异步相关的处理，返回给上层。")]),e._v(" "),r("p",[e._v("当获取到Invoker之后，又调用protocol的export方法，这里的protocol由于是导出到本地，所以采用的是InJVMProtocol，在使用Dubbo的SPI机制加载该Protocol时，从外到内又依次包裹了ProtocolFilterWrapper、QosProtocolWrapper、ProtocolListenerWrapper，所以当执行export操作时，依次执行它们的export方法。最后返回InjvmExporter。")]),e._v(" "),r("p",[e._v("当导出到本地时，ProtocolFilterWrapper在其中起了比较大的作用。它的作用就是加载需要的filter，采用责任链模式，一层一层包裹Invoker。")]),e._v(" "),r("h2",{attrs:{id:"发布到远程"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#发布到远程"}},[e._v("#")]),e._v(" 发布到远程")]),e._v(" "),r("p",[e._v("流程发布到远程和发布到本地的流程基本一致，不同的是最后采用的协议为registerProtocol，该protocol的export方法如下：")]),e._v(" "),r("div",{staticClass:"language- extra-class"},[r("pre",{pre:!0,attrs:{class:"language-text"}},[r("code",[e._v("    public <T> Exporter<T> export(final Invoker<T> originInvoker) throws RpcException {\n        URL registryUrl = getRegistryUrl(originInvoker);\n        // url to export locally\n        URL providerUrl = getProviderUrl(originInvoker);\n\n        // Subscribe the override data\n        // FIXME When the provider subscribes, it will affect the scene : a certain JVM exposes the service and call\n        //  the same service. Because the subscribed is cached key with the name of the service, it causes the\n        //  subscription information to cover.\n        final URL overrideSubscribeUrl = getSubscribedOverrideUrl(providerUrl);\n        final OverrideListener overrideSubscribeListener = new OverrideListener(overrideSubscribeUrl, originInvoker);\n        overrideListeners.put(overrideSubscribeUrl, overrideSubscribeListener);\n\n        providerUrl = overrideUrlWithConfig(providerUrl, overrideSubscribeListener);\n        //export invoker\n        final ExporterChangeableWrapper<T> exporter = doLocalExport(originInvoker, providerUrl);\n\n        // url to registry\n        final Registry registry = getRegistry(originInvoker);\n        final URL registeredProviderUrl = getRegisteredProviderUrl(providerUrl, registryUrl);\n        ProviderInvokerWrapper<T> providerInvokerWrapper = ProviderConsumerRegTable.registerProvider(originInvoker,\n                registryUrl, registeredProviderUrl);\n        //to judge if we need to delay publish\n        boolean register = providerUrl.getParameter(REGISTER_KEY, true);\n        if (register) {\n            register(registryUrl, registeredProviderUrl);\n            providerInvokerWrapper.setReg(true);\n        }\n\n        // Deprecated! Subscribe to override rules in 2.6.x or before.\n        registry.subscribe(overrideSubscribeUrl, overrideSubscribeListener);\n\n        exporter.setRegisterUrl(registeredProviderUrl);\n        exporter.setSubscribeUrl(overrideSubscribeUrl);\n        //Ensure that a new exporter instance is returned every time export\n        return new DestroyableExporter<>(exporter);\n    }\n")])])]),r("p",[e._v("这里主要是做了两件事：本地协议导出，这次是DubboProtocol，以及注册到注册中心，比如nacos等，DubboProtocol导出前面已经做了讲解，这里就不再复述了，而nacos注册细节这里也不详述了，以后有机会可以写个nacos源码解析。")]),e._v(" "),r("p",[e._v("至此，dubbo的Export基本已经分析完毕。")])])}),[],!1,null,null,null);r.default=n.exports}}]);