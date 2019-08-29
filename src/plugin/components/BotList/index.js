import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Swiper, SwiperItem } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';
import FloatLayout from '../FloatLayout/index';
import MCard from './m-card';
import MGroup from './m-group';
import MList from './m-list';
import eventbus from '../../lib/eventbus';

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
    tabIndex: 0
  };

  componentWillMount() {}

  componentDidMount() {
    eventbus.on('bot_show_card_list', uuid => {
      this.setState({ uuid, visible: true });
    });
  }

  handleClose = () => {
    this.setState({
      visible: false
    });
  };

  handleClick = (item, tab) => {
    eventbus.trigger('bot_show_card', item);
  };

  handleSwiperChange = event => {
    this.setState({
      tabIndex: event.detail.current
    });
  };

  render() {
    const { Message } = this.props;
    const { visible, uuid, tabIndex } = this.state;
    const message = Message.filter(item => item.uuid === uuid)[0];
    const tpl = _get(message, 'content.template', {});
    const tabList = _get(message, 'content.template.tabList', []);

    return message ? (
      <FloatLayout
        visible={visible}
        maskClosable
        title={tpl.title}
        bodyPadding={0}
        onClose={this.handleClose}
      >
        <View className="m-bot-list">
          <ScrollView scrollX className="u-tab">
            {tabList.map((tab, index) => (
              <View
                className={`u-tab-item ${tabIndex === index ? 'z-active' : ''}`}
              >
                {tab.tab_name}
              </View>
            ))}
          </ScrollView>
          <Swiper className="u-swiper" onChange={this.handleSwiperChange}>
            {tabList.map(tab => (
              <SwiperItem key={tab.tab_id}>
                <MList
                  className="u-list"
                  tab={tab}
                  tpl={tpl}
                >
                  {tab.list.length ? (
                    tab.list.map(item => {
                      return String(item.p_item_type) === '0' ? (
                        <MCard
                          key={item.params}
                          item={item}
                          onClick={this.handleClick.bind(this, item, tab)}
                        ></MCard>
                      ) : (
                        <MGroup
                          key={item.params}
                          item={item}
                        ></MGroup>
                      );
                    })
                  ) : (
                    <Text className="u-empty-tip">
                      {_get(tpl, 'empty_list_hint')}
                    </Text>
                  )}
                </MList>
              </SwiperItem>
            ))}
          </Swiper>
        </View>
      </FloatLayout>
    ) : null;
  }
}
