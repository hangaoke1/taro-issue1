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
      console.log(newMessage);
      dispatch(changeMessageByUUID(newMessage));
    }
  })
)
export default class TabList extends Component {
  static propTypes = {
    tab: PropTypes.object,
    tpl: PropTypes.object,
    message: PropTypes.object,
    scrollTop: PropTypes.number
  };

  state = {
    loading: false,
    finished: false
  };

  componentWillMount() {}

  componentDidMount() {
    eventbus.on('bot_loadmore_list', this.handleLoadMoreList);
  }

  componentWillUnmount() {
    eventbus.off('bot_loadmore_list', this.handleLoadMoreList);
  }

  handleLoadMoreList = data => {
    const { tpl, tab, message } = this.props;
    const id = _get(data, 'template.id');
    const tab_id = _get(data, 'template.tab_id');
    if (tpl.id != id) {
      return;
    }
    const appendTab = _get(data, 'template.tabList', []).filter(
      tab => tab.tab_id == tab_id
    )[0];
    if (tab.tab_id == tab_id) {
      const newMessage = _cloneDeep(message);
      const newTab = _get(newMessage, 'content.template.tabList', []).filter(
        tab => tab.tab_id == tab_id
      )[0];
      newTab.list = [...newTab.list, ...appendTab.list];
      newTab.action = appendTab.action;

      this.props.updateMessage(newMessage);

      this.setState({
        loading: false,
        finished: _get(appendTab, 'list.length') === 0
      });
    }
  };

  loadMore = () => {
    this.setState({
      loading: true
    });
    getMoreBotList({
      id: this.props.tpl.id,
      target: this.props.tab.action.target,
      params: this.props.tab.action.params
    }).then(res => {
      console.log('---加载更多请求发送成功---');
    });
  };

  render() {
    const { loading, finished } = this.state;
    const { scrollTop, tab, tpl } = this.props;
    return (
      <GList
        loading={loading}
        finished={finished}
        onLoadMore={this.loadMore}
        scrollTop={scrollTop}
      >
        {this.props.children}
        {finished && tab.list.length === 0 ? (
          <View className="u-empty-tip">{_get(tpl, 'empty_list_hint')}</View>
        ) : null}
      </GList>
    );
  }
}