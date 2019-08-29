import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import PropTypes from 'prop-types';
import _isFunction from 'lodash/isFunction';

import './list.less';

export default class GList extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    finished: PropTypes.bool
  };

  static defaultProps = {
    loading: false,
    finished: false
  };

  componentWillMount() {}

  componentDidMount() {
    const query = Taro.createSelectorQuery().in(this.$scope)
    const node = query.select('.u-content')
    node.fields({ size: true }, res => {
      console.log('---node---', res)
    }).exec()

  }

  loadMore = () => {
    const { loading, finished } = this.props;
    if (loading || finished) {
      return;
    }
    if (_isFunction(this.props.onLoadMore)) {
      this.props.onLoadMore();
    }
  };

  render() {
    const { loading, finished } = this.props;
    return (
      <ScrollView
        className="u-list"
        scrollY
        onScrollToLower={this.loadMore}
      >
        <View className="u-content">
          {this.props.children}
          {loading ? <View>加载中</View> : null}
          {finished ? <View>没有更多了</View> : null}
        </View>
      </ScrollView>
    );
  }
}
