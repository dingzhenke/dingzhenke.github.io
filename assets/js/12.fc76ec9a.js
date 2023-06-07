(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{422:function(e,t,n){e.exports=n.p+"assets/img/beanFactory.729f614d.png"},423:function(e,t,n){e.exports=n.p+"assets/img/RootBeanDefinition.0359874d.png"},463:function(e,t,n){"use strict";n.r(t);var a=n(2),s=Object(a.a)({},(function(){var e=this,t=e._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("p"),t("div",{staticClass:"table-of-contents"},[t("ul",[t("li",[t("a",{attrs:{href:"#beanfactory概览"}},[e._v("BeanFactory概览")])]),t("li",[t("a",{attrs:{href:"#beandefinition"}},[e._v("BeanDefinition")])]),t("li",[t("a",{attrs:{href:"#createbean"}},[e._v("CreateBean")]),t("ul",[t("li",[t("a",{attrs:{href:"#createbeaninstance"}},[e._v("createBeanInstance")])]),t("li",[t("a",{attrs:{href:"#applymergedbeandefinitionpostprocessors"}},[e._v("applyMergedBeanDefinitionPostProcessors")])]),t("li",[t("a",{attrs:{href:"#earlysingletonexposure"}},[e._v("earlySingletonExposure")])])])]),t("li",[t("a",{attrs:{href:"#populatebean"}},[e._v("populateBean")])]),t("li",[t("a",{attrs:{href:"#initializebean"}},[e._v("initializeBean")])]),t("li",[t("a",{attrs:{href:"#依赖检测"}},[e._v("依赖检测")])]),t("li",[t("a",{attrs:{href:"#registerdisposablebeanifnecessary"}},[e._v("registerDisposableBeanIfNecessary")])])])]),t("p"),e._v(" "),t("h2",{attrs:{id:"beanfactory概览"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#beanfactory概览"}},[e._v("#")]),e._v(" BeanFactory概览")]),e._v(" "),t("p",[e._v("BeanFactory是ApplicationContext里最核心的内容。由于SpringBoot默认是生成AnnotationConfigApplicationContext，该ApplicationContext使用的是DefaultListableBeanFactory，所以这里研究该BeanFactory。")]),e._v(" "),t("p",[e._v("DefaultListableBeanFactory的类图如下：\n"),t("img",{attrs:{src:n(422),alt:"BeanFactory"}}),e._v("\n观察其继承路线，可以看到它实现了以下功能：")]),e._v(" "),t("ul",[t("li",[e._v("别名注册中心：由SimpleAliasRegistry提供")]),e._v(" "),t("li",[e._v("单例实体注册中心：由DefaultSingletonBeanRegistry提供")]),e._v(" "),t("li",[e._v("FactoryBean注册中心：由FactoryBeanRegistrySupport提供")]),e._v(" "),t("li",[e._v("Bean的查找、获取：由AbstractBeanFactory提供")]),e._v(" "),t("li",[e._v("Bean的创建及其初始化（依赖注入、调用初始化方法等）：由AbstractAutowireCapableBeanFactory提供")])]),e._v(" "),t("p",[e._v("由于BeanFactory最核心的就是Bean的管理，所以这里我们着重关注一下Bean的创建及其初始化，也就是AbstractAutowireCapableBeanFactory的createBean方法。这个方法里面引入了一个新的重要的概念，也就是BeanDefinition，我们要理清创建逻辑，了解这个类会大有裨益。")]),e._v(" "),t("h2",{attrs:{id:"beandefinition"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#beandefinition"}},[e._v("#")]),e._v(" BeanDefinition")]),e._v(" "),t("p",[e._v("同样，我们先看一下RootBeanDefinition的类图:\n"),t("img",{attrs:{src:n(423),alt:"BeanDefinition"}}),e._v("\n同样，我们观察其继承路线，发现AttributeAccessorSupport和BeanMetadataAttributeAccessor只是提供KV形式的属性访问功能，其余的功能大部分由AbstractBeanDefinition提供，包括：")]),e._v(" "),t("ul",[t("li",[e._v("依赖注入方式")]),e._v(" "),t("li",[e._v("依赖检测方式以及依赖的对象信息")]),e._v(" "),t("li",[e._v("scope")]),e._v(" "),t("li",[e._v("FactoryBean相关功能")]),e._v(" "),t("li",[e._v("init和destroy阶段方法")]),e._v(" "),t("li",[e._v("该Definition来源(resource)")])]),e._v(" "),t("h2",{attrs:{id:"createbean"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#createbean"}},[e._v("#")]),e._v(" CreateBean")]),e._v(" "),t("p",[e._v("在对BeanDefinition有一个初步的认识之后,我们再来详细看看AbstractAutowireCapableBeanFactory的createBean方法。其中我为了方便观看，删除了异常捕获和处理的代码，因为这些代码对我们分析该方法并没有实际的用处，反而会干扰我们的视线，以后分析源码时我也会这么处理：")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('    @Override\n\tprotected Object createBean(String beanName, RootBeanDefinition mbd, @Nullable Object[] args)\n\t\t\tthrows BeanCreationException {\n\n\t\tif (logger.isTraceEnabled()) {\n\t\t\tlogger.trace("Creating instance of bean \'" + beanName + "\'");\n\t\t}\n\t\tRootBeanDefinition mbdToUse = mbd;\n\n\t\t// Make sure bean class is actually resolved at this point, and\n\t\t// clone the bean definition in case of a dynamically resolved Class\n\t\t// which cannot be stored in the shared merged bean definition.\n\t\tClass<?> resolvedClass = resolveBeanClass(mbd, beanName);\n\t\tif (resolvedClass != null && !mbd.hasBeanClass() && mbd.getBeanClassName() != null) {\n\t\t\tmbdToUse = new RootBeanDefinition(mbd);\n\t\t\tmbdToUse.setBeanClass(resolvedClass);\n\t\t}\n\n\t\t// Prepare method overrides.\n\t\t......\n\t\tmbdToUse.prepareMethodOverrides();\n\t\t......\n\n        // Give BeanPostProcessors a chance to return a proxy instead of the target bean instance.\n        Object bean = resolveBeforeInstantiation(beanName, mbdToUse);\n        if (bean != null) {\n            return bean;\n        }\n\t\t......\n        Object beanInstance = doCreateBean(beanName, mbdToUse, args);\n        if (logger.isTraceEnabled()) {\n            logger.trace("Finished creating instance of bean \'" + beanName + "\'");\n        }\n        return beanInstance;\n\t\t}\n        ......\n\t}\n')])])]),t("p",[e._v("可以看到该方法流程如下：\n1、解析想要实例化的class\n2、预处理“方法重载”信息\n3、执行各种InstantiationAwareBeanPostProcessor.postProcessBeforeInstantiation方法，切入Bean的创建过程，允许其返回一个该Bean实例的代理\n4、如果前一步构建过程没有被拦截，则执行自己的创建过程，即doCreateBean(beanName, mbdToUse, args)")]),e._v(" "),t("p",[e._v("这里都比较好理解，我们重点看看第四步，即实际创建过程：")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('    protected Object doCreateBean(final String beanName, final RootBeanDefinition mbd, final @Nullable Object[] args)\n\t\t\tthrows BeanCreationException {\n\n\t\t// Instantiate the bean.\n\t\tBeanWrapper instanceWrapper = null;\n\t\tif (mbd.isSingleton()) {\n\t\t\tinstanceWrapper = this.factoryBeanInstanceCache.remove(beanName);\n\t\t}\n\t\tif (instanceWrapper == null) {\n\t\t\tinstanceWrapper = createBeanInstance(beanName, mbd, args);\n\t\t}\n\t\tfinal Object bean = instanceWrapper.getWrappedInstance();\n\t\tClass<?> beanType = instanceWrapper.getWrappedClass();\n\t\tif (beanType != NullBean.class) {\n\t\t\tmbd.resolvedTargetType = beanType;\n\t\t}\n\n\t\t// Allow post-processors to modify the merged bean definition.\n\t\tsynchronized (mbd.postProcessingLock) {\n\t\t\tif (!mbd.postProcessed) {\n                ......\n                applyMergedBeanDefinitionPostProcessors(mbd, beanType, beanName);\n\t\t\t\t......\n\t\t\t\tmbd.postProcessed = true;\n\t\t\t}\n\t\t}\n\n\t\t// Eagerly cache singletons to be able to resolve circular references\n\t\t// even when triggered by lifecycle interfaces like BeanFactoryAware.\n\t\tboolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&\n\t\t\t\tisSingletonCurrentlyInCreation(beanName));\n\t\tif (earlySingletonExposure) {\n\t\t\tif (logger.isTraceEnabled()) {\n\t\t\t\tlogger.trace("Eagerly caching bean \'" + beanName +\n\t\t\t\t\t\t"\' to allow for resolving potential circular references");\n\t\t\t}\n\t\t\taddSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));\n\t\t}\n\n\t\t// Initialize the bean instance.\n\t\tObject exposedObject = bean;\n\t\t......\n\t\tpopulateBean(beanName, mbd, instanceWrapper);\n\t\texposedObject = initializeBean(beanName, exposedObject, mbd);\n\t\t......\n\n\t\tif (earlySingletonExposure) {\n\t\t\tObject earlySingletonReference = getSingleton(beanName, false);\n\t\t\tif (earlySingletonReference != null) {\n\t\t\t\tif (exposedObject == bean) {\n\t\t\t\t\texposedObject = earlySingletonReference;\n\t\t\t\t}\n\t\t\t\telse if (!this.allowRawInjectionDespiteWrapping && hasDependentBean(beanName)) {\n\t\t\t\t\tString[] dependentBeans = getDependentBeans(beanName);\n\t\t\t\t\tSet<String> actualDependentBeans = new LinkedHashSet<>(dependentBeans.length);\n\t\t\t\t\tfor (String dependentBean : dependentBeans) {\n\t\t\t\t\t\tif (!removeSingletonIfCreatedForTypeCheckOnly(dependentBean)) {\n\t\t\t\t\t\t\tactualDependentBeans.add(dependentBean);\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t......\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\t// Register bean as disposable.\n\t\t......\n\t\t\tregisterDisposableBeanIfNecessary(beanName, bean, mbd);\n\t\t......\n\t\treturn exposedObject;\n\t}\n')])])]),t("p",[e._v("这个方法有点庞大，我们不着急，一步一步来，先大致了解一下流程，流程如下：")]),e._v(" "),t("h3",{attrs:{id:"createbeaninstance"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#createbeaninstance"}},[e._v("#")]),e._v(" createBeanInstance")]),e._v(" "),t("p",[e._v("使用合适的策略创建新实例，包括实例提供者调用其方法、工厂方法、构造方法注入、普通初始化，这些创建方法最终都调用了InstantiationStrategy的instantiate方法。在这里是CglibSubclassingInstantiationStrategy。")]),e._v(" "),t("h3",{attrs:{id:"applymergedbeandefinitionpostprocessors"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#applymergedbeandefinitionpostprocessors"}},[e._v("#")]),e._v(" applyMergedBeanDefinitionPostProcessors")]),e._v(" "),t("p",[e._v("执行MergedBeanDefinitionPostProcessor.postProcessMergedBeanDefinition方法，可能会检查BeanDefinition，以便缓存元数据供bean实例化之后的方法(post-processing)使用")]),e._v(" "),t("h3",{attrs:{id:"earlysingletonexposure"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#earlysingletonexposure"}},[e._v("#")]),e._v(" earlySingletonExposure")]),e._v(" "),t("p",[e._v("如果是earlySingletonExposure，则先在单例注册中心占个位，方便循环引用")]),e._v(" "),t("h2",{attrs:{id:"populatebean"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#populatebean"}},[e._v("#")]),e._v(" populateBean")]),e._v(" "),t("p",[e._v("1、首先切入InstantiationAwareBeanPostProcessor.postProcessAfterInstantiation方法，此方法返回false，则不会进行后面的Spring自带的属性注入操作，一般返回true。\n2、在BeanFactory中寻找并解析依赖项\n3、切入InstantiationAwareBeanPostProcessor.postProcessProperties方法，采用责任链模式管理属性注入操作\n4、设置属性")]),e._v(" "),t("h2",{attrs:{id:"initializebean"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#initializebean"}},[e._v("#")]),e._v(" initializeBean")]),e._v(" "),t("p",[e._v("初始化bean，主要是调用init方法，以及init前后的钩子方法\n1、invokeAwareMethods：如果有，则调用Bean的BeanNameAware、BeanClassLoaderAware、BeanFactoryAware相关方法\n2、依次调用BeanPostProcessor.postProcessBeforeInitialization方法\n3、执行InitializingBean的afterPropertiesSet方法，以及自定义的init方法\n4、执行BeanPostProcessor.postProcessAfterInitialization方法")]),e._v(" "),t("h2",{attrs:{id:"依赖检测"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#依赖检测"}},[e._v("#")]),e._v(" 依赖检测")]),e._v(" "),t("p",[e._v("检测是否有依赖当前Bean的Bean，引用的是老的实例")]),e._v(" "),t("h2",{attrs:{id:"registerdisposablebeanifnecessary"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#registerdisposablebeanifnecessary"}},[e._v("#")]),e._v(" registerDisposableBeanIfNecessary")]),e._v(" "),t("p",[e._v("注册容器关闭时Bean的钩子函数")]),e._v(" "),t("p",[e._v("至此，Bean的创建过程的分析，暂时告一段落，后面我们有时间还可以再返回，详细分析其某个部分。")])])}),[],!1,null,null,null);t.default=s.exports}}]);