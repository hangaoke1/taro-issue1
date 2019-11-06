import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View, CoverView } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import { genClassAndStyle } from '@/utils';
import { setClipboardData } from '@/utils/extendTaro';
import { sendTemplateText } from '@/actions/chat';
import { get } from '@/plugin/global_config';
import FloatLayout from '@/components/FloatLayout';
import CardLayoutList from '@/components/Bot/m-card-layout-list';
import MDetailViewList from '@/components/Bot/m-detail-view-list';

import './index.less';
@connect(
  ({ Setting }) => ({
    Setting
  }),
  dispatch => ({})
)
class DetailView extends Component {
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

  handleLinklongpress = (action) => {
    if (action.type === 'url') {
      setClipboardData(action.target);
    }
  }

  handleActionClick = action => {
    // 判断是否是机器人
    if (!get('isRobot')) {
      return Taro.showToast({ title: '消息已失效，无法选择', icon: 'none'})
    }

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
      // 底部浮层弹窗
      this.setState({ visible: true });
    }
    if (action.type === 'popup') {
      // TODO: 需要请求数据
      Taro.navigateTo({
        url: `plugin://myPlugin/detailView?uuid=${this.props.item.uuid}`
      });
    }
  };

  render() {
    const { item, tpl, Setting } = this.props;
    const { visible } = this.state;
    return item ? (
      <View className="m-detail-view">
        <FloatLayout
          visible={visible}
          maskClosable
          title={tpl.detail.label}
          onClose={this.handleClose}
          bodyPadding={12}
          contentHeight={200}
        >
          <MDetailViewList list={tpl.detail.list}></MDetailViewList>
        </FloatLayout>
        <CardLayoutList list={[tpl.thumbnail]}></CardLayoutList>
        {tpl.thumbnail.action ? (
          <View
            className="u-action"
            onClick={this.handleActionClick.bind(this, tpl.thumbnail.action)}
            onLongPress={this.handleLinklongpress.bind(this, tpl.thumbnail.action)}
            style={`color: ${Setting.themeColor}`}
          >
            {tpl.thumbnail.action.label}
          </View>
        ) : null}
      </View>
    ) : null;
  }
}

export default DetailView;
