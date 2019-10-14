import Taro, { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import _isFunction from 'lodash/isFunction';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
import eventbus from '@/plugin/lib/eventbus';
import GList from '@/plugin/components/GList';
import { getMoreBotList } from '@/plugin//actions/chat';
import MShop from '@/components/Bot/m-shop';

export default class MList extends Component {
  static propTypes = {
    tpl: PropTypes.object,
    message: PropTypes.object,
    scrollTop: PropTypes.number
  };

  state = {
    loading: false,
    finished: false,
    showList: [],
    params: {},
  };

  componentWillMount() {
    // 初始化信息
    this.setState((state, props) => ({
      showList: _cloneDeep(_get(props.tpl, 'list', [])),
      params: {
        id: props.tpl.id,
        target: props.tpl.action.target,
        params: props.tpl.action.params
      }
    }))
  }

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

    // console.log('旧的', this.state.showList);
    // console.log('新的', appendTpl.list)

    this.setState((state, props) => ({
      showList: [...state.showList, ...appendTpl.list],
      params: appendTpl.action,
      loading: false,
      finished: _get(appendTpl, 'list.length', 0) === 0 ? true : false
    }))
  };

  loadMore = () => {
    if (this.state.loading) return;
    this.setState({
      loading: true
    });
    getMoreBotList(this.state.params).then(res => {
      console.log('---加载更多请求发送成功---');
    });
  };

  render() {
    const { loading, finished, showList } = this.state;
    const { scrollTop  } = this.props;
    return (
      <GList
        loading={loading}
        finished={finished}
        onLoadMore={this.loadMore}
        scrollTop={scrollTop}
        height={400}
      >
        {showList.map(shop => {
          return <MShop shop={shop} key={shop.s_status}></MShop>;
        })}
        {finished && showList.length === 0 ? (
          <View className="u-empty-tip">{_get(tpl, 'empty_list_hint')}</View>
        ) : null}
      </GList>
    );
  }
}
