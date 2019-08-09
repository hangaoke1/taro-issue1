import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
 
import Index from '../../app';

import MessageView from '../../components/Message';
import ChatBox from '../../components/ChatBox';
import FuncBox from '../../components/FuncBox';
import Portrait from '../../components/Portrait';

import { createAccount, sendText } from '../../actions/chat';
import { toggleShowFun, toggleShowPortrait, hideAction } from '../../actions/options';


import './chat.less'

@connect(({ Message, Options }) => ({
  Message,
  Options
}), (dispatch) => ({
  hideAction () {
    dispatch(hideAction())
  },
  toggleShowFun () {
    dispatch(toggleShowFun())
  },
  toggleShowPortrait () {
    dispatch(toggleShowPortrait())
  },
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
    const { createAccount } = this.props;
    createAccount();
  }

  componentWillReceiveProps (nextProps) {
  }

  componentDidMount(){
    console.log(this.props);
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleConfirm= (event) => {
    const { sendText } = this.props;
    let value = event.detail.value;

    sendText(value);
  }

  handleBodyClick = () => {
    this.props.hideAction()
  }

  handlePortraitClick = () => {
    this.props.toggleShowPortrait();
  }

  handlePlusClick = () => {
    this.props.toggleShowFun();
  }

  handleFuncClick = item => {
    console.log(item);
  }

  render () {
    const { Message, Options } = this.props;
    const list = [
      { name: '拍照', type: 'img', icon: 'icon-camera' },
      { name: '拍视频', type: 'video', icon: 'icon-vcr' },
      { name: '小视频', type: 'video', icon: 'icon-camera' },
      { name: '评价', type: 'video', icon: 'icon-star-evaluationx' },
      { name: '退出', type: 'video', icon: 'icon-eraser' }]
    
    return (
      <Index className='m-page-wrapper'>
        <View className='m-chat'>
          <View className='m-view'>
            <ScrollView className='message-content' scrollY onClick={this.handleBodyClick}>
              <MessageView Message={Message}></MessageView>
            </ScrollView>
          </View>
          <ChatBox handleConfirm={this.handleConfirm} onPlusClick={this.handlePlusClick} onPortraitClick={this.handlePortraitClick}></ChatBox>
          {
            Options.showFunc && <FuncBox list={list} onFuncClick={this.handleFuncClick}></FuncBox>
          }
          {
            Options.showPortrait && <Portrait></Portrait>
          }
        </View>
      </Index>
    )
  }
}

export default Chat;
