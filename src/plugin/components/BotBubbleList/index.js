import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';
import FloatLayout from '@/components/FloatLayout';
import eventbus from '@/lib/eventbus';
import MCard from '@/components/Bot/m-card';
import MGroup from '@/components/Bot/m-group';
import MList from './m-list';

import './index.less';

@connect(
  ({ Message }) => ({
    Message
  }),
  dispatch => ({})
)
export default class BotList extends Component {
  static propTypes = {};

  static defaultProps = {};

  state = {
    uuid: '',
    visible: false,
    scrollTop: 0
  };

  componentDidMount() {
    eventbus.on('bot_show_bubble_list', uuid => {
      this.setState({ uuid, visible: true, scrollTop: 0 }, () => {
        // this.setState({ uuid });
      });
    });
    eventbus.on('bot_close_bubble_list', () => {
      this.handleClose()
    });
  }

  handleClose = () => {
    this.setState({
      visible: false,
      scrollTop: 10
    });
  };

  render() {
    const { Message } = this.props;
    const { visible, uuid, scrollTop } = this.state;
    const message = Message.filter(item => item.uuid === uuid)[0];
    const tpl = _get(message, 'content.template', {});
    const list = _get(message, 'content.template.list', []);
    return message ? (
      <FloatLayout
        visible={visible}
        maskClosable
        title={tpl.title}
        bodyPadding={0}
        onClose={this.handleClose}
      >
        {message ? (
          <View className="m-bot-list">
            <MList scrollTop={scrollTop} tpl={tpl} message={message}>
              {list.map(item => {
                return String(item.p_item_type) === '0' ? (
                  <MCard key={item.params} item={item} message={message}></MCard>
                ) : (
                  <MGroup key={item.params} item={item}></MGroup>
                );
              })}
            </MList>
          </View>
        ) : null}
      </FloatLayout>
    ) : null;
  }
}
