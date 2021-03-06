# 网易七鱼访客端SDK插件

## 概述

网易七鱼微信小程序访客端SDK插件是一个微信小程序端客服系统访客解决方案，既包含了客服聊天逻辑管理，也提供了聊天界面，开发者可方便的将客服功能集成到自己的 微信小程序 中。

## 接入说明

1. 在微信小程序后台 - 设置 -  第三方设置 - 插件管理中申请使用七鱼小程序sdk插件，七鱼提供的微信小程序插件名称为    QIYUSDK。

详细使用插件的方式请参考微信小程序插件的使用方式，[微信使用插件文档](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)

2. 七鱼对外提供名字为chat的页面插件，请确保在配置企业appKey后再跳转到chat页面申请客服。

3. 七鱼插件大小约为1.1M，微信目前闲置单个包的大小最大为2M，如遇到引入插件后包大小超过2m的情况，建议您采用插件分包记载。[微信使用插件文档](https://developers.weixin.qq.com/miniprogram/dev/framework/plugin/using.html)-在分包内引入插件代码包

### 接入代码示例

引入插件代码包:使用插件前，使用者要在 app.json 中声明需要使用的插件

```js
{
  "plugins": {
    "myPlugin": {
      "version": "1.1.4", //推荐使用最新版本
      "provider": "wxae5e29812005203f"
    }
  }
}
```

### 初始化企业appKey

配置企业的appKey采用接口插件对外接口的形式，使用requirePlugin引用插件后调用 _$configAppKey(appKey) 方法。

#### _$configAppKey(appKey)

该接口接受一个appkey参数，支持Promise化使用。

| 参数    | 类型 |  必须 |  描述  |
| :----: | :----: | :---- | :--- |
| appKey | String | 是 | 企业appKey的查看方法见注1 |

```js
var myPluginInterface = requirePlugin('myPlugin');
var appId = '由七鱼后台-微信小程序接入绑定后自动生成,请确认appId在您的绑定列表中。';
myPluginInterface.__configAppId(appId);
myPluginInterface._$configAppKey('3858be3c20ceb6298575736cf27858a7');
myPluginInterface.__configDomain("https://qiyukf.com"); // 1.1.1版本以前需要手动配置下七鱼服务器域名
```

#### _$configAppKeySync(appKey)

_$configAppKey的同步方法。

*[注1] 企业appKey的查看方法： 七鱼管理后台 — 在线系统 — 在线接入中查看。*

*[注2] 此方法为必须调用，请确保在跳转到插件的聊天界面之前配置了正确的appKey。*

*[注3] 在对接之前请确定在 七鱼管理后台 — 在线系统 — 微信小程序 界面绑定您的微信小程序，否则可能会出现连接不到客服的情况。 *


### 跳转客服页面

七鱼提供一个名称为chat的插件页面

```js
<navigator url="plugin://myPlugin/chat">
  联系客服
</navigator>
```

## CRM对接

### 上报用户信息

#### _$setUserInfo(userInfo)

七鱼 SDK 允许 App 的用户以匿名方式向客户咨询，但如果希望客服知道咨询的用户的身份信息，可以通过插件提供的 _$setUserInfo 接口告诉给客服。 该接口包含两个功能：

1. 关联用户账户。调用过该接口后，客服即可知道当前用户是谁，并可以调看该用户之前发生过的访问记录。通过该接口，SDK还会把 App 端相同用户 ID 的咨询记录整合在一起。如果调用 _$setUserInfo(userInfo) 接口前是匿名状态，那么匿名状态下的聊天记录也会被整合到新设置的这个用户下面。

2. 提供用户的详细资料。通过设置参数 userInfo 的 data 字段，小程序 能把用户的详细信息告诉给客服，这些信息会显示在客服会话窗口的用户信息栏中。

该接口接受一个userInfo对象为参数，支持Promise化使用，userInfo的具体格式如下：

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


```js
var myPluginInterface = requirePlugin('myPlugin');
var userInfo = {
        userId: 'user111111111',
        data: [
          { "key": "real_name", "value": "用户A" },
          { "key": "mobile_phone", "value": 15669060662 },
          { "key": "email", "value": "13800000000@163.com" },
          { "index": 0, "key": "account", "label": "账号", "value": "zhangsan", "href": "http://example.domain/user/zhangsan" },
          { "index": 1, "key": "sex", "label": "性别", "value": "先生" },
          { "index": 2, "key": "reg_date", "label": "注册日期", "value": "2015-11-16" },
          { "index": 3, "key": "last_login", "label": "上次登录时间", "value": "2015-12-22 15:38:54" },
          { "index": 4, "key": "avatar", "label": "头像", "value": "https://ysf.nosdn.127.net/985726b5a8840b84a8a90c6b71642813" }
        ]
      }
myPluginInterface._$setUserInfo(userInfo);
```

#### _$setUserInfoSync(userInfo)

_$setUserInfo的同步方法。

### 用户VIP等级

七鱼客服增加了设置用户 VIP 等级的功能，便于区分用户等级，允许 VIP 用户优先进线或为 VIP 用户指定专线客服，提升用户体验。

使用该功能需要在七鱼管理系统 -> 设置 -> VIP 客户设置页面打开 VIP 开关，否则设置将不会生效。

####  _$setVipLevel(level)

设置用户的vip等级，支持Promise化使用。

+ 如果为 0，为普通用户；
+ 如果为 1-10，为用户 VIP 等级 1-10 级；
+ 如果为 11，为通用 VIP 用户，即不显示用户等级。

```js
var myPluginInterface = requirePlugin('myPlugin');

myPluginInterface._$setVipLevel(10);
```

####  _$setVipLevelSync(level)

_$setVipLevel的同步方法。

### 功能配置

#### 商品卡片

在打开咨询窗口时，还可以带上用户当前正在浏览的商品或订单信息。

##### _$configProduct(product)

product的内容如下：

| 字段    | 意义   | 备注  |
| :----: | :----: | :---- |
| title | 商品标题 | 长度限制为 100 字符，超过自动截断。|
| desc   | 商品详细描述信息。 | 长度限制为 300 字符，超过自动截断。 |
| note   | 商品备注信息（价格，套餐等） | 长度限制为 100 字符，超过自动截断。 |
| picture   | 缩略图图片的 url。 | 该 url 需要没有跨域访问限制，否则在客服端会无法显示。 |
| url   | 商品信息详情页 url。 | 长度限制为 1000 字符，超长不会自动截断，但会发送失败。 |
| isShow   | 是否在访客端显示商品消息。 | 默认为0，即客服能看到此消息，但访客看不到，也不知道该消息已发送给客服。 |
| tags   | 展示在客服端的一些可操作入口 | 默认为空，每个 tag 在客服端将展示为一个按钮. |
| sendByUser   | 是否需要用户手动发送 | 默认为false，当为 true 的时候，商品的下面讲出现一个按钮，用户可以点击该按钮发送商品 |
| actionText   |手动发送按钮的文本 | 默认文本为发送链接 |
| actionTextColor   | 手动发送按钮文本的颜色 | 十六进制颜色例如：0xFFDB7093 |

```js
var myPluginInterface = requirePlugin('myPlugin');

var product = {
    title: '任天堂（Nintendo）Switch游戏机',
    desc: '任天堂（Nintendo） Switch NS NX掌上游戏机便携 塞尔达马里奥新款游戏机 主机不锁 日版黑机彩色手柄+中文赛/塞尔达传说(指南+地图)',
    note: '$2330',
    picture: 'https://img10.360buyimg.com/n5/s75x75_jfs/t4030/290/29851193/293745/d5e2b731/58ac3506Nbb57b5f6.jpg',
    url: 'https://www.qi.163.com/',
    isShow: 1,
    sendByUser: 1
  };

myPluginInterface._$configProduct(product);
```

##### _$configProductSync(product)

_$configProduct的同步方法。

#### 自定义分配客服

若企业有多个咨询入口，为提高咨询效率，可在不同咨询入口设置对应的人工客服接待。

##### _$configStaffId(staffid)

```js
var myPluginInterface = requirePlugin('myPlugin');

myPluginInterface._$configStaffId(30010);
```

指定ID后，进入聊天页面时，会直接以此ID去请求对应的人工客服。

人工客服ID查询：管理端-应用-在线系统-设置-会话流程-会话分配-ID查询-客服及客服组ID查询

##### _$configStaffIdSync(staffid)

 _$configStaffId的同步方法。

#### 自定义分配客服组

若企业有多个咨询入口，为提高咨询效率，可在不同咨询入口设置对应的人工客服组接待。

##### _$configGroupId(groupid)

```js
var myPluginInterface = requirePlugin('myPlugin');

myPluginInterface. _$configGroupId(30330);
```

指定ID后，进入聊天页面时，会直接以此ID去请求对应的客服组，服务组会随机分配客服组中可用客服接待。

客服组ID查询：管理端-应用-在线系统-设置-会话流程-会话分配-ID查询-客服及客服组ID查询

#### 设置聊天窗口的标题

七鱼插件提供自定义聊天窗口chat页面的标题（即微信小程序的navigationBarTitleText值）的功能。（默认值为在线客服）

##### _$configTitle(title)

```js
var myPluginInterface = requirePlugin('myPlugin');

myPluginInterface._$configTitle('七鱼客服');
```

##### _$configTitleSync(title)

_$configTitle的同步方法。


### 自定义事件

#### URL链接点击响应

如果用户或者客服发送的文本消息中带有 URL 链接，SDK 将会复制该链接。用户点击这个链接后，允许应用自己处理这个点击事件，用于在应用中做自定义响应操作。

##### _$onClickAction(cb: function) 监听响应操作

回调函数中参数格式：

| 字段    | 类型   | 描述  |
| :----: | :----: | :---- |
| data | Object | url: 访问的链接地址, from: 链接访问的来源模块 |
| navigateTo | Function | 插件跳转函数 |
`因小程序插件回调中，主程序无法直接调用自身的navigateTo函数进行跳转，所以额外提供参数供使用方进行页面跳转`
```js
myPluginInterface._$onClickAction((data, navigateTo) => {
  console.log('点击事件参数', data)
  // 注意此处必须使用navigateTo
  navigateTo({
    url: '/pages/test/index'
  })
})
```

#### 输入框上方快捷入口点击响应

`人工会话`下输入框上方快捷入口`自定义类型 action = custom`点击响应

##### _$onEntranceClick(cb: function) 监听响应操作

回调函数中参数格式：

| 字段    | 类型   | 描述  |
| :----: | :----: | :---- |
| action | String | 事件类型[custom] |
| label   | String | 快捷入口名称 |
| data   | String | 快捷入口自定义数据 |

##### _$configAutoCopy(autoCopy)  关闭默认链接的复制操作

接受一个布尔值boolean，可以在自定义点击事件的同时，关掉系统本身的复制操作。


### 用户注销

如果一个有名用户需要清除用户信息，需要手动调用 _$logout 方法。

## 未读消息监听

#### `_$getAllUnreadCount()` 获取当前未读消息数量
```js
const myPluginInterface = requirePlugin('myPlugin');
const total = myPluginInterface._$getAllUnreadCount();
console.log('当前未读消息总数: ', total)
```

#### `_$onunread(cb: function)` 监听未读消息
```js
const myPluginInterface = requirePlugin('myPlugin');
myPluginInterface._$onunread(res => {
  const { total, message } = res;
  console.log('当前未读消息总数: ', total)
  console.log('新增未读消息: ', message)
});
```

#### `_$clearUnreadCount()` 清空所有未读消息
```js
const myPluginInterface = requirePlugin('myPlugin');
myPluginInterface._$clearUnreadCount(); // 会触发_$onunread 回调
console.log('未读消息清空完成!');
```

## 历史消息处理
鉴于小程序性能问题，不建议设置过长历史消息条数。如果使用时未配置`userInfo.userId`的话，多个账户之前的历史消息是`共享`的，例如A账号与客服产生10条消息记录，此时注销A账号，登录B账号，只要是同一台设备，则B账号也能看到这10条消息，如果需要根据账号隔离历史记录，请配置`userInfo.userId`

#### `_$setHistoryLimit(number)` 设置历史消息保留条数，默认100条
```js
const myPluginInterface = requirePlugin('myPlugin');
myPluginInterface._$setHistoryLimit(200); // 保留200条历史消息
```

## 文件消息处理
`默认情况下sdk自行处理包括图片、音频、视频类型的文件打开操作，但是由于小程序对于插件api调用的限制，sdk无法直接打开文档及其他类型的问题，此时需要用户自行监听事件进行处理`

#### `_$onFileOpenAction(cb: function)` 处理用户打开文件操作
回调函数中参数格式：

| 字段    | 类型   | 描述  |
| :----: | :----: | :---- |
| name | String | 文件名称 |
| url | String | 文件下载地址 |
| tempFilePath | String | 文件本地临时地址 |
| size | Number | 文件大小 |
| md5   | String | 文件md5 |

`调用该函数后，对于sdk无法处理的文件打开操作会通过回调事件，由用户自行处理`
```js
// 简单示例
myPluginInterface._$onFileOpenAction((fileObj) => {
  const name = fileObj.name || '';
  const nameArr = name.split('.');
  const ext = (nameArr[nameArr.length - 1] || '').toLocaleLowerCase();
  // 针对文档类型，直接调用微信api进行打开
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'].includes(ext)) {
    wx.openDocument({
      filePath: fileObj.tempFilePath,
      success: function (res) {}
    })
  } else {
    wx.showToast({
      title: '暂不支持该文件类型预览'
    })
  }
})
```

## 全面屏适配
由于微信小程序本身的限制，导致用户全局配置`navigationStyle: 'custom'`时，会导致插件页面的导航栏被隐藏从而无法进行页面后退，并且由于微信小程序并没有相关api提供到插件开发者去控制导航栏，目前考虑到部分用户业务场景无法通过配置单独的页面进行导航栏显示/隐藏控制，故七鱼插件为开发者提供了全面屏配置参数
```js
myPluginInterface._$configFullScreen(true)
```
