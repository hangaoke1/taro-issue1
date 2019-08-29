import Taro, { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import _isFunction from 'lodash/isFunction';
import eventbus from '../../../lib/eventbus';
import GList from './list';
import { getMoreBotList } from '../../../actions/chat';

export default class MList extends Component {
  static propTypes = {
    tab: PropTypes.object,
    tpl: PropTypes.object
  }

  state = {
    loading: false,
    finished: false
  };

  componentWillMount() { }

  componentDidMount() {
    eventbus.on('bot_loadmore_list', this.handleLoadMoreList)
  }

  componentWillUnmount() {
    eventbus.off('bot_loadmore_list', this.handleLoadMoreList)
  }

  handleLoadMoreList = (data) => {
    // TODO: 处理加载更多
    this.setState({
      loading: false,
      finished: true
    })
  }

  loadMore = () => {
    this.setState({
      loading: true
    });
    getMoreBotList({
      id: this.props.tpl.id,
      target: this.props.tab.action.target,
      params: this.props.tab.action.params
    }).then(res => {
      console.log('---加载更多请求发送成功---', res)
    })
  };

  render() {
    const { loading, finished } = this.state;
    return (
      <GList loading={loading} finished={finished} onLoadMore={this.loadMore}>
        {this.props.children}
      </GList>
    );
  }
}
