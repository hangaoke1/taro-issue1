import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Swiper, SwiperItem, } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import FloatLayout from '../FloatLayout/index';
import UCard from './u-card';
import eventbus from '../../lib/eventbus';

import './index.less';

@connect(
  ({ Message }) => ({
    Message
  }),
  dispatch => ({})
)
export default class BotList extends Component {
  static propTypes = {}

  static defaultProps = {}

  state = {
    uuid: '',
    visible: false
  }

  componentWillMount() {}

  componentDidMount() {
    eventbus.on('show_card_list', uuid => {
      this.setState({ uuid, visible: true });
    });
  }

  handleLoadMore = (params) => {
    console.log('加载更多', params)
  }

  handleClose = () => {
    this.setState({
      visible: false
    })
  }

  render() {
    const { visible } = this.state;

    return (
      <FloatLayout visible={visible} maskClosable title='请选择咨询的商品' bodyPadding={0} onClose={this.handleClose}>
        <View className='m-bot-list'>
          <ScrollView scrollX className='u-tab'>
            <View className='u-tab-item z-active'>热门商品</View>
            <View className='u-tab-item'>我的订单</View>
          </ScrollView>
          <Swiper className='u-swiper'>
            <SwiperItem>
              <ScrollView scrollY className='u-list' onScrollToLower={this.handleLoadMore.bind(this, 'aaa')}>
                {(new Array(10)).map((item, index) => <UCard key={index}></UCard>)}
              </ScrollView>
            </SwiperItem>
            <SwiperItem>
              <ScrollView scrollY className='u-list' onScrollToLower={this.handleLoadMore.bind(this, 'aaa')}>
                {(new Array(10)).map((item, index) => <UCard key={index}></UCard>)}
              </ScrollView>
            </SwiperItem>
          </Swiper>
        </View>
      </FloatLayout>
    );
  }
}
