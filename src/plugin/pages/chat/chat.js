import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Input, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import {createAccount} from '../../actions/chat';
import {add} from '../../actions/counter';
 
import Index from '../../app';

import { Iconfont } from '../../components/Iconfont';

import './chat.less'


@connect(({chat}) => chat, 
(dispatch) => ({
  createAccount(){
    dispatch(createAccount())
  }
}))
  
class Chat extends Component {

  config = {
    navigationBarTitleText: '网易七鱼'
  }

  constructor(props){
    super(props);
    this.createAction();
  }

  createAction(){
    const {createAccount} = this.props;
    createAccount();
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount(){
    console.log(this.props);
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <Index className='m-page-wrapper'>
        <View className='m-chat'>
          <View className='m-view'>
            <ScrollView className='message-content'>
              <View className="m-message m-message-left">
                <View>
                  <Image className="u-avatar" src="http://qytest.netease.com/sdk/res/default/robot_portrait.png"></Image>
                </View>
                <View className="u-text">
                  <Text>我是网易七鱼的全智能云客服专家小七，请输入一句话描述您的问题。</Text>
                </View>
              </View>
              <View className='m-message m-message-right'>
                <View>
                  <Image className='u-avatar' src="http://qytest.netease.com/sdk/res/default/robot_portrait.png"></Image>
                </View>
                <View className="u-text">
                  <Text>你好啊。</Text>
                </View>
              </View>
            </ScrollView>
          </View>
          <View className='m-input'>
            <View className='u-voice-icon'>
              <Iconfont type='icon-chat-voice-btn' className='u-voice-icon'></Iconfont>
            </View>
            <Input type="text" placeholder='请输入您要咨询的问题' className='u-edtior'></Input>
          </View>
        </View>
      </Index>
    )
  }
}

export default Chat;
