import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import Avatar from '../u-avatar';
import TplDrawerList from './TplDrawerList';
import TplBubbleList from './TplBubbleList';
import TplBubbleNodeList from './TplBubbleNodeList';
import TplItem from './TplItem';
import TplErrorMsg from './TplErrorMsg';
import TplBotForm from './TplBotForm';
import TplBotFormItem from './TplBotFormItem';
import TplOrderList from './TplOrderList';
import TplGoods from './TplGoods';
import TplOrderDetail from './TplOrderDetail';
import TplOrderStatus from './TplOrderStatus';
import TplText from './TplText';
import TplOrderLogistic from './TplOrderLogistic';
import TplStaticUnion from './TplStaticUnion';
import TplActionList from './TplActionList';
import TplRefundDetail from './TplRefundDetail';
import TplCardLayout from './TplCardLayout';
import TplDetailView from './TplDetailView';
import TplActivePage from './TplActivePage';

import './index.less';
import eventbus from '@/lib/eventbus';

@connect(
  ({ Session, Setting }) => ({
    Session,
    Setting
  }),
  dispatch => ({})
)
export default class Bot extends Component {
  static propTypes = {
    item: PropTypes.object
  };

  static defaultProps = {
    item: {}
  };

  componentWillMount() {}

  componentDidMount() {}

  // 显示bot表单
  showForm = () => {
    // 判断session是否失效
    if (
      _get(this.props, 'Session.sessionid') !==
      _get(this.props, 'item.sessionid')
    ) {
      return Taro.showToast({
        title: '该会话已结束，表单已失效',
        icon: 'none'
      });
    }
    const uuid = _get(this.props.item, 'uuid');
    eventbus.trigger('bot_show_bot_form', uuid);
  };

  render() {
    const { item, Setting } = this.props;
    const tpl = _get(item, 'content.template', {});
    let layout = null;
    let showFormAction = false;
    switch (tpl.id) {
      case 'active_page': {
        layout = <TplActivePage item={item} tpl={tpl}></TplActivePage>;
        break;
      }
      case 'detail_view': {
        layout = <TplDetailView item={item} tpl={tpl}></TplDetailView>;
        break;
      }
      case 'card_layout': {
        layout = <TplCardLayout item={item} tpl={tpl}></TplCardLayout>;
        break;
      }
      case 'refund_detail': {
        layout = <TplRefundDetail item={item} tpl={tpl}></TplRefundDetail>;
        break;
      }
      case 'action_list': {
        layout = <TplActionList item={item} tpl={tpl}></TplActionList>;
        break;
      }
      case 'static_union': {
        layout = <TplStaticUnion item={item} tpl={tpl}></TplStaticUnion>;
        break;
      }
      case 'order_logistic': {
        layout = <TplOrderLogistic item={item} tpl={tpl}></TplOrderLogistic>;
        break;
      }
      case 'qiyu_template_text': {
        layout = <TplText item={item} tpl={tpl}></TplText>;
        break;
      }
      case 'order_status': {
        layout = <TplOrderStatus item={item} tpl={tpl}></TplOrderStatus>;
        break;
      }
      case 'order_detail': {
        layout = <TplOrderDetail item={item} tpl={tpl}></TplOrderDetail>;
        break;
      }
      case 'qiyu_template_goods': {
        layout = <TplGoods item={item} tpl={tpl}></TplGoods>;
        break;
      }
      case 'order_list': {
        layout = <TplOrderList item={item} tpl={tpl}></TplOrderList>;
        break;
      }
      case 'bot_form': {
        showFormAction = !tpl.submitted;
        layout = <TplBotForm item={item} tpl={tpl}></TplBotForm>;
        break;
      }
      case 'qiyu_template_botForm': {
        layout = <TplBotFormItem item={item} tpl={tpl}></TplBotFormItem>;
        break;
      }
      case 'drawer_list': {
        layout = <TplDrawerList item={item} tpl={tpl}></TplDrawerList>;
        break;
      }
      case 'bubble_list': {
        layout = <TplBubbleList item={item} tpl={tpl}></TplBubbleList>;
        break;
      }
      case 'bubble_node_list': {
        layout = <TplBubbleNodeList item={item} tpl={tpl}></TplBubbleNodeList>;
      }
      case 'qiyu_template_item': {
        layout = <TplItem item={item} tpl={tpl}></TplItem>;
        break;
      }
      case 'error_msg': {
        layout = <TplErrorMsg item={item} tpl={tpl}></TplErrorMsg>;
        break;
      }
      default: {
        layout = <View className="u-tip">微信小程序不支持展示该消息类型</View>;
      }
    }

    let className = item.fromUser ? 'm-bot m-bot-right' : 'm-bot m-bot-left';
    let themeColor = item && item.fromUser ? _get(Setting, 'setting.dialogColor') : '';

    // 下列模版特殊处理聊天内容却与b背景颜色
    if ([
      'qiyu_template_goods',
      'qiyu_template_item',
      'qiyu_template_botForm'
    ].includes(tpl.id)) {
      themeColor = '#fff';
    }

    // 下列模版特殊处理聊天内容区域宽度
    if ([
      'bubble_list',
      'bubble_node_list',
      'qiyu_template_goods',
      'qiyu_template_item'
    ].includes(tpl.id)) {
      className += ' z-large';
    }

    return (
      <View className={className}>
        <Avatar fromUser={item.fromUser} staff={item.staff} />
        <View className="u-text-arrow" style={`${item.fromUser ? 'border-left-color: ' + themeColor : ''}`} />
        <View className="u-content">
          <View className="u-text" style={`${item.fromUser ? 'background-color: ' + themeColor : ''}`}>{layout}</View>
          {showFormAction ? (
            <View className="u-action" onClick={this.showForm} style={Setting.themeText}>
              填写表单
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
