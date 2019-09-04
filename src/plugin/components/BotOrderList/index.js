import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';

import FloatLayout from '@/components/FloatLayout';
import MShop from '@/components/Bot/m-shop';
import MList from './m-list';

import './index.less';

class BotOrderList extends Component {
  state = {
    message: '',
    visible: false,
    scrollTop: 0
  };

  componentWillMount() {}

  componentDidMount() {
    eventbus.on('bot_show_order_list', message => {
      if (this.state.message === message) {
        this.setState({ visible: true });
        return;
      }
      this.setState({ visible: true, message, scrollTop: 0 });
    });
    eventbus.on('bot_close_order_list', () => {
      this.handleClose();
    });
  }

  handleClose = () => {
    this.setState({
      visible: false,
      scrollTop: 10
    });
  };

  render() {
    const { visible, message, scrollTop } = this.state;
    const tpl = _get(message, 'content.template', {});
    const list = _get(tpl, 'list', []);

    return message ? (
      <FloatLayout
        visible={visible}
        maskClosable
        title={tpl.label}
        bodyPadding={0}
        onClose={this.handleClose}
      >
        <MList scrollTop={scrollTop} tpl={tpl} message={message}>
          {list.map(shop => {
            return <MShop shop={shop} key={shop.s_status}></MShop>;
          })}
        </MList>
      </FloatLayout>
    ) : null;
  }
}

export default BotOrderList;
