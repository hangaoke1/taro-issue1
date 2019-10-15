import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import PropTypes from 'prop-types';
import _isFunction from 'lodash/isFunction';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import eventbus from '@/plugin/lib/eventbus';
import GList from '@/plugin/components/GList';
import { getMoreBotList, changeMessageByUUID } from '@/plugin//actions/chat';

import './index.less'

@connect(
  ({}) => ({}),
  dispatch => ({
    updateMessage(newMessage) {
      dispatch(changeMessageByUUID(newMessage));
    }
  })
)
export default class TabList extends Component {
  static propTypes = {
    tab: PropTypes.object,
    tpl: PropTypes.object,
    message: PropTypes.object,
    scrollTop: PropTypes.number,
    active: PropTypes.bool
  };

  state = {
    loading: false,
    finished: false
  };

  componentDidMount() {
    eventbus.on('bot_loadmore_list', this.handleLoadMoreList);
    eventbus.on('bot_drawer_list_reset', this.reset);
  }

  componentWillUnmount() {
    eventbus.off('bot_loadmore_list', this.handleLoadMoreList);
    eventbus.on('bot_drawer_list_reset', this.reset);
  }

  reset = () => {
    this.setState({
      loading: false,
      finished: false
    })
  };

  handleLoadMoreList = data => {
    if (!this.state.loading) { return }
    this.state.loading = true;

    const { tpl, tab, message } = this.props;
    const id = _get(data, 'template.id');
    const tab_id = _get(data, 'template.tab_id');
    // 判断模版类型是否一致
    if (tpl.id != id) {
      return;
    }
    const appendTab = _get(data, 'template.tabList', []).filter(
      tab => tab.tab_id == tab_id
    )[0];
    // 判断是否是当前tab
    if (tab.tab_id == tab_id) {
      const newMessage = _cloneDeep(message);
      const newTab = _get(newMessage, 'content.template.tabList', []).filter(
        tab => tab.tab_id == tab_id
      )[0];
      newTab.list = [...newTab.list, ...appendTab.list];
      newTab.action = appendTab.action;

      // this.props.updateMessage(newMessage);
      this.props.update(newMessage);

      this.setState({
        loading: false,
        finished: _get(appendTab, 'list.length') === 0
      });
    }
  };

  loadMore = () => {
    if (this.state.loading) return;
    this.state.loading = true;
    // console.log('---加载更多请求发送开始---');
    // console.log('---action---', this.props.tab.action);
    // console.log('---加载更多请求发送结束---');
    
    this.setState({
      loading: true
    });
    getMoreBotList({
      id: this.props.tpl.id,
      target: this.props.tab.action.target,
      params: this.props.tab.action.params
    });

  };

  render() {
    const { loading, finished } = this.state;
    const { scrollTop, tab, tpl, active } = this.props;
    return (
      <GList
        loading={loading}
        finished={finished}
        onLoadMore={this.loadMore}
        scrollTop={scrollTop}
        // height={400}
        active={active}
      >
        {this.props.children}
        {finished && tab.list.length === 0 ? (
          <View className="u-empty-tip">{_get(tpl, 'empty_list_hint')}</View>
        ) : null}
      </GList>
    );
  }
}
