import Taro, { Component } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';
import eventbus from '@/lib/eventbus';
import WeModal from '@/components/Modal';
import MCard from '@/components/Bot/m-card';
import { sendBotCard } from '@/actions/chat';

import './index.less';

export default class BotCard extends Component {
  state = {
    isOpened: false,
    item: null,
    message: null
  };

  componentWillMount() {}

  componentDidMount() {
    eventbus.on('bot_card_show', (item, message) => {
      this.setState({
        isOpened: true,
        item,
        message
      });
    });
  }

  handleClose = () => {
    this.setState({
      isOpened: false
    });
  };

  handleConfirm = () => {
    sendBotCard(this.state.item, this.state.message);
    eventbus.trigger('bot_close_drawer_list');
    eventbus.trigger('bot_close_bubble_list');
    this.handleClose();
  };

  handleCancel = () => {
    this.handleClose();
  };

  render() {
    const { isOpened, item } = this.state;

    return (
      <WeModal
        className="bot-card"
        isOpened={isOpened}
        onClose={this.handleClose}
        onConfirm={this.handleConfirm}
        onCancel={this.handleCancel}
        title="确认要发送吗？"
        cancelText="取消"
        confirmText="确认"
        closeOnClickOverlay
      >
        <MCard item={item} disabled={true}></MCard>
      </WeModal>
    );
  }
}
