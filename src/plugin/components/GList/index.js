import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import PropTypes from 'prop-types';
import _isFunction from 'lodash/isFunction';

import './index.less';

export default class GList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    finished: PropTypes.bool,
    scrollTop: PropTypes.number,
    height: PropTypes.number
  };

  static defaultProps = {
    loading: false,
    finished: false,
    scrollTop: 0
  };

  state = {
    wrapHeight : 0
  }

  componentDidMount() {
    this.calcWrapHeight();
  }

  componentDidUpdate() {
    this.needLoadMore();
  }

  calcWrapHeight = () => {
    const query = Taro.createSelectorQuery().in(this.$scope);
    const node = query.select('.root-class');
    node
      .fields({ size: true }, res => {
        // console.log('计算容器高度: ', res.height)
        this.setState({ wrapHeight: res.height }, () => {
          this.needLoadMore();
        })
      })
      .exec();
  }

  // 检测是否超过一屏
  needLoadMore = () => {
    const { loading, finished } = this.props;
    if (loading || finished) {
      return;
    }

    const query = Taro.createSelectorQuery().in(this.$scope);
    const node = query.select('.u-content');
    node
      .fields({ size: true }, res => {
        if (res.height <= this.state.wrapHeight) {
          this.props.onLoadMore();
        } else {
        }
      })
      .exec();
  };

  loadMore = () => {
    console.log('触发loadmore----')
    const { loading, finished } = this.props;
    if (loading || finished) {
      return;
    }
    if (_isFunction(this.props.onLoadMore)) {
      this.props.onLoadMore();
    }
  };

  render() {
    const { loading, finished, scrollTop, height } = this.props;

    return (
      <ScrollView
        className="root-class"
        scrollY
        onScrollToLower={this.loadMore}
        scrollTop={scrollTop}
        style={{ height: `${height ? height + 'px' : '100%'}` }}
      >
        <View className="u-content">
          {this.props.children}
          {loading ? <View className="u-loading">加载中</View> : null}
          {finished ? <View className="u-finished">没有更多了</View> : null}
          { !loading && !finished ? <View className="u-tip" onTouchStart={this.loadMore}>点击加载更多</View> :null}
        </View>
      </ScrollView>
    );
  }
}
