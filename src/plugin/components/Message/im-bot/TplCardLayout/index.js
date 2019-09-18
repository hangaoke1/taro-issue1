import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import { setClipboardData } from '@/utils/extendTaro';
import { sendTemplateText } from '@/actions/chat';

import FloatLayout from '@/components/FloatLayout';
import CardLayoutList from '@/components/Bot/m-card-layout-list';
import CardLayoutListLoad from '@/components/Bot/m-card-layout-list-load';

import './index.less';

class CardLayout extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };

  state = {
    visible: false
  };

  componentWillMount() {}

  componentDidMount() {}

  handleClose = () => {
    this.setState({ visible: false });
  };

  handleActionClick = () => {
    const action = _get(this, 'props.tpl.action', {});
    if (action.type === 'url') {
      setClipboardData(action.target);
    }
    if (action.type === 'block') {
      sendTemplateText({
        label: action.label,
        target: action.target,
        params: action.params
      });
    }
    if (action.type === 'float') {
      this.setState({ visible: true });
    }
    if (action.type === 'popup') {
      // Taro.navigateTo({
      //   url: `plugin://myPlugin/cardLayoutView?uuid=${this.props.item.uuid}`
      // });
    }
  };

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
      this.setState({ visible: false });
    }
    if (action.type === 'float') {
      // TODO: 不需要请求数据
    }
    if (action.type === 'popup') {
      // TODO: 需要请求数据
    }
  };

  render() {
    const { item, tpl } = this.props;
    const { visible } = this.state;

    return item ? (
      <View className="m-card-layout">
        <FloatLayout
          visible={visible}
          maskClosable
          title='查看更多'
          onClose={this.handleClose}
          bodyPadding={12}
          contentHeight={600}
        >
          {visible ? (
            <CardLayoutListLoad
              height={300}
              item={item}
              tpl={tpl}
              onItemClick={this.handleCardClick.bind(this)}
            ></CardLayoutListLoad>
          ) : null}
        </FloatLayout>
        <View className="u-label">{tpl.label}</View>
        <CardLayoutList
          list={tpl.list}
          onItemClick={this.handleCardClick.bind(this)}
        ></CardLayoutList>
        <View className="u-action" onClick={this.handleActionClick}>
          {tpl.action.label}
        </View>
      </View>
    ) : null;
  }
}

export default CardLayout;
