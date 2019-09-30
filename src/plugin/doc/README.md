# 网易七鱼访客端SDK插件

## 概述

网易七鱼微信小程序访客端SDK插件是一个微信小程序端客服系统访客解决方案，既包含了客服聊天逻辑管理，也提供了聊天界面，开发者可方便的将客服功能集成到自己的 微信小程序 中。

## 接入说明

1. 在微信小程序后台 - 设置 -  第三方设置 - 插件管理中申请使用七鱼小程序sdk插件，七鱼提供的微信小程序插件名称为    QIYUSDK。

详细使用插件的方式请参考微信小程序插件的使用方式，[微信使用插件文档](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)

2. 七鱼对外提供名字为chat的页面插件，请确保在配置企业appKey后再跳转到chat页面申请客服。

### 初始化企业appKey

配置企业的appKey采用接口插件对外接口的形式，使用requirePlugin引用插件后调用 _$configAppKey(appKey) 方法。

#### _$configAppKey(appKey)

该接口接受一个appkey参数，支持Promise化使用。

| 参数    | 类型 |  必须 |  描述  |
| :----: | :----: | :---- | :--- |
| appKey | String | 是 | 企业appKey的查看方法见注1 |

#### _$configAppKeySync(appKey)

_$configAppKey的同步方法。

*[注1] 企业appKey的查看方法： 七鱼管理后台 — 在线系统 — 在线接入中查看。*

*[注2] 此方法为必须调用，请确保在跳转到插件的聊天界面之前配置了正确的appKey。*

## CRM对接

### 上报用户信息

#### _$setUserInfo(userInfo)

七鱼 SDK 允许 App 的用户以匿名方式向客户咨询，但如果希望客服知道咨询的用户的身份信息，可以通过插件提供的 _$setUserInfo 接口告诉给客服。 该接口包含两个功能：

> 关联用户账户。调用过该接口后，客服即可知道当前用户是谁，并可以调看该用户之前发生过的访问记录。通过该接口，SDK还会把 App 端相同用户 ID 的咨询记录整合在一起。如果调用 _$setUserInfo(userInfo) 接口前是匿名状态，那么匿名状态下的聊天记录也会被整合到新设置的这个用户下面。

> 提供用户的详细资料。通过设置参数 userInfo 的 data 字段，小程序 能把用户的详细信息告诉给客服，这些信息会显示在客服会话窗口的用户信息栏中。

该接口接受一个userInfo对象为参数，userInfo的具体格式如下：

| 参数    | 类型   | 描述  |
| :----: | :----: | :---- |
| userId | String | 可选，用户在企业产品中的标识，便于后续客服系统中查看该用户在产品中的相关信息，不传表示匿名用户 。若要指定用户信息，不显示默认的（guestxxx用户姓名），就必须传userId|
| data   | String | 可选，用户在企业中的其他详细信息，JSON字符串 |

data的具体格式如下：

| 字段    |   类型 |    必须 |    说明 |
| :----: | :----: | :---- | :---- |
| key    | String  | 是 | 数据项的名称，用于区别不同的数据。其中real_name、mobile_phone、email为保留字段，分别对应客服工作台用户信息中的“姓名”、“手机”、“邮箱”这三项数据。保留关键字对应的数据项中，index、label属性将无效，其显示顺序及名称由网易七鱼系统指定。 |
| value  | Mixed   | 是 | 该数据显示的值，类型不做限定，根据实际需要进行设定。 |
| label  | String  | 是 | 该项数据显示的名称。 |
| index  | Int     | 否 | 用于排序，显示数据时数据项按index值升序排列；不设定index的数据项将排在后面；index相同或未设定的数据项将按照其在 JSON 中出现的顺序排列。 |
| href   | String  | 否 | 超链接地址。若指定该值，则该项数据将显示为超链接样式，点击后跳转到其值所指定的 URL 地址。 |
| hidden | Boolean | 否 | 仅对mobile_phone、email两个保留字段有效，表示是否隐藏对应的数据项，true为隐藏，false为不隐藏。若不指定，默认为false不隐藏。 |

#### _$setUserInfoSync(userInfo)

_$setUserInfo的同步接口

### 用户注销

如果一个有名用户需要清除用户信息，需要手动调用 _$logout 方法。

## 未读消息监听

#### `_$getAllUnreadCount()` 获取当前未读消息数量
```js
const myPluginInterface = Taro.requirePlugin('myPlugin');
const total = myPluginInterface._$getAllUnreadCount();
console.log('当前未读消息总数: ', total)
```

#### `_$onunread(cb: function)` 监听未读消息
```js
const myPluginInterface = Taro.requirePlugin('myPlugin');
myPluginInterface._$onunread(res => {
  const { total, message } = res;
  console.log('当前未读消息总数: ', total)
  console.log('新增未读消息: ', message)
});
```

#### `_$clearUnreadCount()` 清空所有未读消息
```js
const myPluginInterface = Taro.requirePlugin('myPlugin');
myPluginInterface._$clearUnreadCount(); // 会触发_$onunread 回调
console.log('未读消息清空完成!');
```
