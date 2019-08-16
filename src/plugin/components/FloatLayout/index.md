## FloatLayout 浮动弹层

### 一般用法

```
<FloatLayout title="这是个标题" maskClosable defaultVisible>
    <View>
        <Text>33333333333333333333333333333</Text>
    </View>
    <View>
        <Text>33333333333333333333333333333</Text>
    </View>
</FloatLayout>
```

### 参数

参数 | 说明 | 类型 | 默认值 
- | - | - | - 
title | 元素的标题 | String | -
visible | 控制是否显示，受控属性 | Boolean | false
contentHeight | 内容区的高度 | numnber | 500
maskClosable | 点击遮罩层是否可以隐藏浮层 | Boolean | false
defaultVisible | 默认状态是否显示 | Boolean | -


### 事件

事件名称 | 说明 | 返回参数
-|-|-
onClickMask | 点击遮罩层触发事件 | -
onClose | 点击关闭按钮触发事件 | -


