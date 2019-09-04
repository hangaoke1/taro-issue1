import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import PropTypes from 'prop-types';
import _isFunction from 'lodash/isFunction';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import eventbus from '@/plugin/lib/eventbus';
import GList from '@/plugin/components/GList';
import { getMoreBotList, changeMessageByUUID } from '@/plugin//actions/chat';

@connect(
  ({}) => ({}),
  dispatch => ({
    updateMessage(newMessage) {
      dispatch(changeMessageByUUID(newMessage));
    }
  })
)
export default class MList extends Component {
  static propTypes = {
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
    if (!this.state.loading) { return }

    const { tpl } = this.props;
    const appendTpl = _get(data, 'template', {});
    const id = appendTpl.id;
    if (tpl.id != id) {
      return;
    }
    const newMessage = _cloneDeep(this.props.message);
    const newTpl = _get(newMessage, 'content.template');
    newTpl.list = [...newTpl.list, ...appendTpl.list];
    newTpl.action = appendTpl.action;

    this.props.updateMessage(newMessage);

    this.setState({
      loading: false,
      finished: _get(appendTpl, 'list.length', 0) === 0 ? true : false
    });
  };

  loadMore = () => {
    this.setState({
      loading: true
    });
    getMoreBotList({
      id: this.props.tpl.id,
      target: this.props.tpl.action.target,
      params: this.props.tpl.action.params
    }).then(res => {
      console.log('---加载更多请求发送成功---');
    });
  };

  render() {
    const { loading, finished } = this.state;
    const { scrollTop, tpl } = this.props;
    return (
      <GList
        loading={loading}
        finished={finished}
        onLoadMore={this.loadMore}
        scrollTop={scrollTop}
      >
        {this.props.children}
        {finished && tpl.list.length === 0 ? (
          <View className="u-empty-tip">{_get(tpl, 'empty_list_hint')}</View>
        ) : null}
      </GList>
    );
  }
}
