import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text, Input, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import {createAccount,sendText} from '../../actions/chat';
 
import Index from '../../app';

import Iconfont from '../../components/Iconfont';
import MessageView from '../../components/Message';
import ChatBox from '../../components/ChatBox';

import './chat.less'


@connect(({Message}) => Message, 
(dispatch) => ({
  createAccount(){
    dispatch(createAccount())
  },
  sendText(value){
    dispatch(sendText(value))
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

  handleConfirm= (event) => {
    const {sendText} = this.props;
    let value = event.detail.value;

    sendText(value);
  }

  render () {
    const {Message} = this.props;

    return (
      <Index className='m-page-wrapper'>
        <View className='m-chat'>
          <View className='m-view'>
            <ScrollView className='message-content'>
              <MessageView Message={Message}></MessageView>
            </ScrollView>
          </View>
          <ChatBox handleConfirm = {this.handleConfirm}></ChatBox>
        </View>
      </Index>
    )
  }
}

export default Chat;
