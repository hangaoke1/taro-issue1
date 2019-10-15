import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';
import { getMoreBotList } from '@/actions/chat';

import GList from '@/components/GList';
import CardLayoutList from '../m-card-layout-list';

import './index.less';

class CardLayoutListLoad extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object,
    onItemClick: PropTypes.func,
    height: PropTypes.number,
    init: PropTypes.bool
  };

  state = {
    loading: false,
    finished: false,
    scrollTop: 0,
    list: [],
    action: ''
  };

  componentWillMount() {}

  componentDidMount() {
    this.setState({
      list: this.props.init ? [] : [...this.props.tpl.list],
      action: {
        id: _get(this, 'props.tpl.id'),
        target: _get(this, 'props.tpl.action.target'),
        params: _get(this, 'props.tpl.action.params')
      }
    });
    eventbus.on('bot_loadmore_list', this.handleLoadMore);
  }

  componentWillUnmount() {
    eventbus.off('bot_loadmore_list', this.handleLoadMore);
  }

  handleLoadMore = (data) => {
    const appendTpl = _get(data, 'template', {});
    // console.log('---监听---', appendTpl);
    if (!this.state.loading || appendTpl.id !== 'card_layout') {
      return
    };
    this.state.loading = true;

    if (!appendTpl.action || !appendTpl.list.length) {
      this.setState({
        loading: false,
        finished: true
      });
    } else {
      this.setState((state) => ({
        loading: false,
        action: appendTpl.action,
        list: [...state.list, ...appendTpl.list]
      }))
    }
  }

  loadMore = () => {
    if (!this.state.action || this.state.loading) return;
    this.state.loading = true;

    this.setState({
      loading: true
    });
    getMoreBotList(this.state.action).then(() => {
      // console.log('---加载更多 card_layout---');
    });
  };

  handleItemClick = action => {
    this.props.onItemClick && this.props.onItemClick(action);
  };

  render() {
    const { height } = this.props;
    const { finished, list, loading, scrollTop } = this.state;
    return (
      <View className="m-card-layout-list-load">
        <GList
          loading={loading}
          finished={finished}
          onLoadMore={this.loadMore}
          scrollTop={scrollTop}
          height={height}
        >
          <CardLayoutList
            list={list}
            onItemClick={this.handleItemClick.bind(this)}
          ></CardLayoutList>
          {finished && list.length === 0 ? (
            <View className="u-empty-tip">暂无数据</View>
          ) : null}
        </GList>
      </View>
    );
  }
}

export default CardLayoutListLoad;
