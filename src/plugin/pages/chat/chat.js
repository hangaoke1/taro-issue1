import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
 
import Index from '../../app';

import MessageView from '../../components/Message';
import ChatBox from '../../components/ChatBox';
import FuncBox from '../../components/FuncBox';
import Portrait from '../../components/Portrait';

import { createAccount, sendText } from '../../actions/chat';
import { toggleShowFun, toggleShowPortrait, hideAction } from '../../actions/options';
import eventbus from '../../lib/eventbus';


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
    this.state = {
      lastId: '',
      height: 0
    }
  }

  createAction(){
    const { createAccount: _createAccount } = this.props;
    _createAccount();
  }

  componentDidMount () {
    eventbus.on('push_message', this.scrollToBottom)
  }

  componentWillUnmount () {
    eventbus.off('push_message', this.scrollToBottom)
  }

  componentDidShow () { }

  componentDidHide () { }

  // 重置底部区域
  scrollToBottom = () => {
    this.setState({
      lastId: ''
    })
    setTimeout(() => {
      this.setState({
        lastId: 'm-bottom'
      })
    }, 100)
  }

  handleConfirm = (event) => {
    const { sendText: _sendText } = this.props;
    let value = event.detail.value;

    _sendText(value);
  }

  handleBodyClick = () => {
    this.props.hideAction()
  }

  // 处理选择表情
  handlePortraitClick = () => {
    this.props.toggleShowPortrait();
    this.scrollToBottom()
  }

  // 处理点击加号
  handlePlusClick = () => {
    this.props.toggleShowFun();
    this.scrollToBottom()
  }

  handleFuncClick = item => {
    console.log(item);
  }

  handleEmojiClick = item => {
    eventbus.trigger('emoji_click', item)
  }

  handleFocus = (event) => {
    this.setState({ height: event.detail.height })
    this.scrollToBottom()
  }

  handleBlur = () => {
    this.setState({ height: 0 })
  }

  render () {
    const { Message, Options } = this.props;
    const { lastId, height } = this.state;
    const list = [
      { name: '拍照', type: 'img', icon: 'icon-camera' },
      { name: '拍视频', type: 'video', icon: 'icon-vcr' },
      { name: '小视频', type: 'mvideo', icon: 'icon-camera' },
      { name: '评价', type: 'comment', icon: 'icon-star-evaluationx' },
      { name: '退出', type: 'exit', icon: 'icon-eraser' }]
    
    return (
      <Index className='m-page-wrapper'>
        <View className='m-chat' style={`height: calc(100vh - ${height}px)`}>
          <View className='m-view'>
            <ScrollView className='message-content' scrollY scrollWithAnimation scrollIntoView={lastId} onClick={this.handleBodyClick}>
              <MessageView Message={Message}></MessageView>
              <View id='m-bottom'></View>
            </ScrollView>
          </View>
          <ChatBox handleConfirm={this.handleConfirm} onPlusClick={this.handlePlusClick} onPortraitClick={this.handlePortraitClick} onFocus={this.handleFocus} onBlur={this.handleBlur}></ChatBox>
          {
            Options.showFunc && <FuncBox list={list} onFuncClick={this.handleFuncClick}></FuncBox>
          }
          {
            Options.showPortrait && <Portrait onEmojiClick={this.handleEmojiClick}></Portrait>
          }
        </View>
      </Index>
    )
  }
}

export default Chat;
