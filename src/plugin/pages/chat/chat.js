import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux'
 
import Index from '../../app';

import MessageView from '../../components/Message';
import ChatBox from '../../components/ChatBox';
import FuncBox from '../../components/FuncBox';
import Portrait from '../../components/Portrait';

import { createAccount, sendText, sendImage } from '../../actions/chat';
import { toggleShowFun, toggleShowPortrait, hideAction } from '../../actions/options';
import eventbus from '../../lib/eventbus';

import functionList from './function.config';
import './chat.less';

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
  },
  sendImage(value){
    dispatch(sendImage(value))
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

  // 扩展功能栏点击处理
  handleFuncClick = item => {
    console.log(item);
    const { sendImage } = this.props;
    switch (item.type) {
      case 'album':
        // 照片
        Taro.chooseImage({
          sourceType: ['album']
        }).then(res => {
          console.log('选择图片: ', res)
          sendImage(res)
        })
        break;
      case 'camera':
        // 拍摄
        Taro.chooseImage({
          sourceType: ['camera']
        }).then(res => {
          console.log('照相: ', res)
        })
        break;
      default:
        console.log(`暂不支持${item.type}`);
    }
  }

  // 处理emoji表情点击
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

  /** 消息体点击事件处理 **/
  handleImgClick = (item) => {
    const imgMessageList = this.props.Message.filter(msg => msg.type === 'image');
    const imgList = imgMessageList.map(msg => JSON.parse(msg.content).url);
    Taro.previewImage({
      current: JSON.parse(item.content).url,
      urls: imgList
    });
  }

  render () {
    const { Message, Options } = this.props;
    const { lastId, height } = this.state;
    
    return (
      <Index className='m-page-wrapper'>
        <View className='m-chat' style={`height: calc(100vh - ${height}px)`}>
          <View className='m-view'>
            <ScrollView className='message-content' scrollY scrollWithAnimation scrollIntoView={lastId} onClick={this.handleBodyClick}>
              <MessageView Message={Message} onImgClick={this.handleImgClick}></MessageView>
              <View id='m-bottom'></View>
            </ScrollView>
          </View>
          <ChatBox handleConfirm={this.handleConfirm} onPlusClick={this.handlePlusClick} onPortraitClick={this.handlePortraitClick} onFocus={this.handleFocus} onBlur={this.handleBlur}></ChatBox>
          {
            Options.showFunc && <FuncBox list={functionList} onFuncClick={this.handleFuncClick}></FuncBox>
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
