import Taro, { Component } from '@tarojs/taro';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';

import FloatLayout from '@/components/FloatLayout';
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

    return message ? (
      <FloatLayout
        visible={visible}
        maskClosable
        title={tpl.label}
        bodyPadding={0}
        onClose={this.handleClose}
      >
        {visible ? (
          <MList scrollTop={scrollTop} tpl={tpl} message={message}></MList>
        ) : null}
      </FloatLayout>
    ) : null;
  }
}

export default BotOrderList;
