#### GList 列表加载组件


#### 使用指南

###### GList API

参数|说明|类型|默认值|可选值
-|-|-|-|-
loading|是否加载中|Boolean|false|true/false
finished|是否到底|Boolean|false|true/false
scrollTop|滚动未知|Number|0|0-9999
height|容器高度 若不传则默认继承外层容器高度|Number|-

###### GList Event

事件名称|说明|回调参数
-|-|-
onLoadMore|触发加载更多回调函数|-|


```js
import Taro, { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import GList from '@/plugin/components/GList';

export default class MList extends Component {

  state = {
    loading: false,
    finished: false,
    list: []
  };

  loadMore = () => {
    // TODO: 处理加载更多数据
    this.setState({
      loading: true
    })
    setTimeout(()=>{
      this.setState((state) => {
        return {
          list: [...state.list, 1, 2, 3, 4, 5],
          loading: false,
          finished: true
        }
      })
    }, 1000)
  };

  render() {
    const { loading, finished } = this.state;
    return (
      <GList
        loading={loading}
        finished={finished}
        onLoadMore={this.loadMore}
        scrollTop={scrollTop}
        height={400}
      >
        {this.props.children}
        {finished && tpl.list.length === 0 ? (
          <View className="u-empty-tip">暂无数据</View>
        ) : null}
      </GList>
    );
  }
}
```
