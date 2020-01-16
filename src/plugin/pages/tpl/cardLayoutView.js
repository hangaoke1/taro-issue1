import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';
import CardLayoutListLoad from '@/components/Bot/m-card-layout-list-load';
import { sendTemplateText } from '@/actions/chat';
import Back from "@/components/Back";

import './cardLayoutView.less';

@connect(
  ({ Message }) => ({
    Message
  }),
  dispatch => ({})
)
class cardLayoutView extends Component {

  state = {
    item: null
  };

  componentWillMount() {
    const uuid = this.$router.params.uuid;
    const item = this.props.Message.filter(message => message.uuid === uuid)[0];
    this.setState({ item });
    Taro.setNavigationBarTitle({
      title: '查看更多'
    });
  }

  componentDidMount() {}

  handleCardClick = action => {
    if (action.type === 'url') {
      setClipboardData(action.target);
    }
    if (action.type === 'block') {
      sendTemplateText({
        label: action.label,
        target: action.target,
        params: action.params
      });
      Taro.navigateBack();
    }
    if (action.type === 'float') {
      // TODO: 不需要请求数据
    }
    if (action.type === 'popup') {
      // TODO: 需要请求数据
    }
  };

  render() {
    const { item } = this.state;
    const tpl = _get(item, 'content.template');
    return (
      <View className="m-card-layout-view" style="height: 100vh">
        <Back />
        <CardLayoutListLoad
          init={true}
          item={item}
          tpl={tpl}
          onItemClick={this.handleCardClick.bind(this)}
        ></CardLayoutListLoad>
      </View>
    );
  }
}

export default cardLayoutView;
