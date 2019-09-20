import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Swiper, SwiperItem } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';
import FloatLayout from '@/components/FloatLayout';
import eventbus from '@/lib/eventbus';
import MCard from '@/components/Bot/m-card';
import MGroup from '@/components/Bot/m-group';
import MTabList from './m-tab-list';

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
    tabIndex: 0,
    scrollTop: 0
  };

  componentDidMount() {
    eventbus.on('bot_show_drawer_list', uuid => {
      this.setState({ uuid, visible: true, scrollTop: 0, tabIndex: 0 }, () => {
        // this.setState({ uuid });
      });
    });
    eventbus.on('bot_close_drawer_list', () => {
      this.handleClose();
    });
  }

  handleClose = () => {
    this.setState({
      visible: false,
      scrollTop: 10
    });
  };

  handleSwiperChange = event => {
    this.setState({
      tabIndex: event.detail.current
    });
  };

  render() {
    const { Message } = this.props;
    const { visible, uuid, tabIndex, scrollTop } = this.state;
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
        {message ? (
          <View className="m-bot-list">
            <ScrollView scrollX className="u-tab">
              {tabList.map((tab, index) => (
                <View
                  style={`width: ${100 / (tabList.length || 1)}%;`}
                  className={`u-tab-item ${
                    tabIndex === index ? 'z-active' : ''
                  }`}
                >
                  {tab.tab_name || '未命名'}
                </View>
              ))}
            </ScrollView>
            <Swiper className="u-swiper" onChange={this.handleSwiperChange}>
              {tabList.map(tab => (
                <SwiperItem key={tab.tab_id}>
                  <MTabList
                    className="u-list"
                    scrollTop={scrollTop}
                    tab={tab}
                    tpl={tpl}
                    message={message}
                  >
                    {tab.list.map(item => {
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
                  </MTabList>
                </SwiperItem>
              ))}
            </Swiper>
          </View>
        ) : null}
      </FloatLayout>
    ) : null;
  }
}
