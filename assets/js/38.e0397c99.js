(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{452:function(e,n,a){"use strict";a.r(n);var t=a(2),s=Object(t.a)({},(function(){var e=this,n=e._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("p"),n("div",{staticClass:"table-of-contents"},[n("ul")]),e._v("\n上一篇已经解释了服务器如何初始化，初始化之后，服务器就可以接收客户端的连接了。当一个客户端连接过来时，就会触发该channel的OP_ACCEPT事件,正如在前面的JAVA NIO中所说，可以调用select系列方法获取，netty中，处理的代码也在NioEventlLoop的run()方法中："),n("p"),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("if (ioRatio == 100) {\n    try {\n        if (strategy > 0) {\n            processSelectedKeys();\n        }\n    } finally {\n        // Ensure we always run tasks.\n        ranTasks = runAllTasks();\n    }\n} else if (strategy > 0) {\n    final long ioStartTime = System.nanoTime();\n    try {\n        processSelectedKeys();\n    } finally {\n        // Ensure we always run tasks.\n        final long ioTime = System.nanoTime() - ioStartTime;\n        ranTasks = runAllTasks(ioTime * (100 - ioRatio) / ioRatio);\n    }\n} else {\n    ranTasks = runAllTasks(0); // This will run the minimum number of tasks\n}\n")])])]),n("p",[e._v("这里使用ioRatio来控制io任务和非io任务的占比，最核心的代码为processSelectedKeys()，它调用processSelectedKeysPlain，我们再往下看：")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v('private void processSelectedKeysPlain(Set<SelectionKey> selectedKeys) {\n    ......\n    for (;;) {\n        final SelectionKey k = i.next();\n        final Object a = k.attachment();\n        i.remove();\n\n        if (a instanceof AbstractNioChannel) {\n            processSelectedKey(k, (AbstractNioChannel) a);\n        } else {\n            @SuppressWarnings("unchecked")\n            NioTask<SelectableChannel> task = (NioTask<SelectableChannel>) a;\n            processSelectedKey(k, task);\n        }\n        ......\n    }\n}\n')])])]),n("p",[e._v("该方法遍历select获取到的SelectionKey集合，根据附加信息(attachment)的不同,进行不同的处理，而这个attachment哪里来的呢？我们查看SelectionKey里attach方法调用，发现其实就是channel注册时传入的")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("@Override\nprotected void doRegister() throws Exception {\n    boolean selected = false;\n    for (;;) {\n        try {\n            selectionKey = javaChannel().register(eventLoop().unwrappedSelector(), 0, this);\n            return;\n        } catch (CancelledKeyException e) {\n            ......\n        }\n    }\n}\n")])])]),n("p",[e._v("所以对于我们的NioServerSocketChannel来说，attachment就是它本身，它继承AbstractNioChannel，所以processSelectedKeysPlain方法走processSelectedKey(k, (AbstractNioChannel) a)支线，在该支线中，调用AbstractNioChannel.NioUnsafe.read(),该方法有两个实现类，由于NioServerSocketChannel继承AbstractNioMessageChannel，所以调用的AbstractNioMessageChannel的（截取重要部分）：")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("@Override\npublic void read() {\n    ......\n    try {\n        try {\n            do {\n                int localRead = doReadMessages(readBuf);\n                if (localRead == 0) {\n                    break;\n                }\n                if (localRead < 0) {\n                    closed = true;\n                    break;\n                }\n\n                allocHandle.incMessagesRead(localRead);\n            } while (allocHandle.continueReading());\n        } catch (Throwable t) {\n            exception = t;\n        }\n\n        int size = readBuf.size();\n        for (int i = 0; i < size; i ++) {\n            readPending = false;\n            pipeline.fireChannelRead(readBuf.get(i));\n        }\n        readBuf.clear();\n        allocHandle.readComplete();\n        pipeline.fireChannelReadComplete();\n\n        if (exception != null) {\n            closed = closeOnReadError(exception);\n\n            pipeline.fireExceptionCaught(exception);\n        }\n\n        if (closed) {\n            inputShutdown = true;\n            if (isOpen()) {\n                close(voidPromise());\n            }\n        }\n    } \n    ......\n}\n")])])]),n("p",[e._v("doReadMessages方法调用channel的accept方法获取客户端连接到实例属性readBuf中，最后调用pipeline.fireChannelRead(readBuf.get(i))，至此服务器对连接的处理就告一段落了，至于fireChannelRead里发生了什么，由于内容比较多，将在后面的章节阐述。")])])}),[],!1,null,null,null);n.default=s.exports}}]);