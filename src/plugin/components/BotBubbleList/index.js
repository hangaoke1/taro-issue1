import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';
import _cloneDeep from 'lodash/cloneDeep';
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
    scrollTop: 0,
    message: ''
  };

  componentDidMount() {
    eventbus.on('bot_show_bubble_list', uuid => {
      // 重置list
      eventbus.trigger('bot_bubble_list_reset');

      this.setState((state, props) => {
        return {
          uuid,
          visible: true,
          scrollTop: 0,
          message: _cloneDeep(
            props.Message.filter(item => item.uuid === uuid)[0]
          )
        };
      });
    });
    eventbus.on('bot_close_bubble_list', () => {
      this.handleClose();
    });
  }

  handleClose = () => {
    this.setState({
      visible: false,
      scrollTop: 10
    });
  };

  handleUpdate = message => {
    this.setState({
      message: message
    });
  };

  render() {
    const { visible, scrollTop, message } = this.state;
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
          <View className="m-bot-list" style="height: 60vh">
            <MList
              scrollTop={scrollTop}
              tpl={tpl}
              message={message}
              update={this.handleUpdate}
            >
              {list.map(item => {
                return String(item.p_item_type) === '0' ? (
                  <MCard
                    key={item.params}
                    item={item}
                    message={message}
                  ></MCard>
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
