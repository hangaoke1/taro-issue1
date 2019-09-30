### 七鱼小程序插件文档

#### 未读消息监听

##### `_$getAllUnreadCount()` 获取当前未读消息数量
```js
const myPluginInterface = Taro.requirePlugin('myPlugin');
const total = myPluginInterface._$getAllUnreadCount();
console.log('当前未读消息总数: ', total)
```

##### `_$onunread(cb: function)` 监听未读消息
```js
const myPluginInterface = Taro.requirePlugin('myPlugin');
myPluginInterface._$onunread(res => {
  const { total, message } = res;
  console.log('当前未读消息总数: ', total)
  console.log('新增未读消息: ', message)
});
```

##### `_$clearUnreadCount()` 清空所有未读消息
```js
const myPluginInterface = Taro.requirePlugin('myPlugin');
myPluginInterface._$clearUnreadCount(); // 会触发_$onunread 回调
console.log('未读消息清空完成!');
```