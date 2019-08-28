import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Video } from '@tarojs/components';
import { connect } from '@tarojs/redux';

import Index from '../../app';

import MessageView from '../../components/Message';
import ChatBox from '../../components/ChatBox';
import FuncBox from '../../components/FuncBox';
import Portrait from '../../components/Portrait';
import FloatLayout from '../../components/FloatLayout';
import Evaluation from '../../components/Evaluation';
import BotList from '../../components/BotList';
import FloatButton from '../../components/FloatButton';

import { NAVIGATIONBAR_TITLE } from '../../constants';

import { createAccount, sendText, sendImage } from '../../actions/chat';
import {
  toggleShowFun,
  toggleShowPortrait,
  hideAction
} from '../../actions/options';
import { closeEvaluationModal } from '../../actions/actionHandle';
import eventbus from '../../lib/eventbus';

import functionList from './function.config';
import './chat.less';

@connect(
  ({ Message, Options, CorpStatus, Bot }) => ({
    Message,
    Options,
    CorpStatus,
    Bot
  }),
  dispatch => ({
    hideAction() {
      dispatch(hideAction());
    },
    toggleShowFun() {
      dispatch(toggleShowFun());
    },
    toggleShowPortrait() {
      dispatch(toggleShowPortrait());
    },
    createAccount() {
      dispatch(createAccount());
    },
    sendText(value) {
      dispatch(sendText(value));
    },
    sendImage(value) {
      dispatch(sendImage(value));
    },
    closeEvaluationModal() {
      dispatch(closeEvaluationModal());
    }
  })
)
class Chat extends Component {
  config = {
    navigationBarTitleText: NAVIGATIONBAR_TITLE
  };

  constructor(props) {
    super(props);
    this.createAction();
    this.state = {
      lastId: '',
      height: 0,
      videoUrl: '',
      scrollWithAnimation: true
    };
  }

  createAction() {
    const { createAccount: _createAccount } = this.props;
    _createAccount();
  }

  componentDidMount() {
    eventbus.on('push_message', this.scrollToBottom);
    eventbus.on('video_click', this.handlePlay);
    this.scrollToBottom(false);
  }

  componentWillUnmount() {
    eventbus.off('push_message', this.scrollToBottom);
  }

  componentDidShow() {}

  componentDidHide() {}

  // 重置底部区域
  scrollToBottom = (scrollWithAnimation = true) => {
    if (this.timer) {
      return;
    }
    this.setState({
      lastId: '',
      scrollWithAnimation
    });
    this.timer = setTimeout(() => {
      this.setState({
        lastId: 'm-bottom'
      });
      this.timer = null;
    }, 150);
  };

  handleConfirm = event => {
    const { sendText } = this.props;
    let value = event.detail.value;

    // 禁止发送空文本
    if (!value.trim()) {
      return;
    }
    sendText(value);
  };

  handleBodyClick = () => {
    this.props.hideAction();
  };

  // 处理选择表情
  handlePortraitClick = () => {
    this.props.toggleShowPortrait();
    this.scrollToBottom();
  };

  // 处理点击加号
  handlePlusClick = () => {
    this.props.toggleShowFun();
    this.scrollToBottom();
  };

  // 扩展功能栏点击处理
  handleFuncClick = item => {
    console.log(item);
    const { sendImage: _sendImage } = this.props;
    switch (item.type) {
      case 'album':
        // 照片
        Taro.chooseImage({
          sourceType: ['album']
        }).then(res => {
          console.log('选择图片: ', res);
          _sendImage(res);
        });
        break;
      case 'camera':
        // 拍摄
        Taro.chooseImage({
          sourceType: ['camera']
        }).then(res => {
          console.log('照相: ', res);
        });
        break;
      default:
        console.log(`暂不支持${item.type}`);
    }
  };

  // 处理emoji表情点击
  handleEmojiClick = item => {
    eventbus.trigger('emoji_click', item);
  };

  handleFocus = event => {
    this.setState({ height: event.detail.height });
    this.scrollToBottom();
  };

  handleBlur = () => {
    this.setState({ height: 0 });
  };

  /** 消息体点击事件处理 **/
  handleImgClick = item => {
    const imgMessageList = this.props.Message.filter(
      msg => msg.type === 'image'
    );
    const imgList = imgMessageList.map(msg => msg.content.url);
    Taro.previewImage({
      current: item.content.url,
      urls: imgList
    });
  };

  /** 视频处理 **/
  handlePlay = url => {
    this.setState({
      videoUrl: url
    });
    const videoCtx = Taro.createVideoContext('j-video');
    videoCtx.requestFullScreen({
      direction: 0
    });
  };

  // 点击bot快捷入口
  handleBotClick = bot => {
    const { sendText } = this.props;
    sendText(bot.label);
  };

  handleFullscreenchange = e => {
    const videoCtx = Taro.createVideoContext('j-video');
    if (!e.detail.fullScreen) {
      // 退出全屏后停止视频
      videoCtx.stop();
      this.setState({
        videoUrl: ''
      });
    } else {
      // HACK: ios首次打开视时，播放无效问题
      setTimeout(() => {
        videoCtx.play();
      }, 100);
    }
  };

  closeEvaluationModal = () => {
    const { closeEvaluationModal } = this.props;
    closeEvaluationModal();
  };

  render() {
    const { Message, Options, CorpStatus, Bot } = this.props;
    const { lastId, height, videoUrl, scrollWithAnimation } = this.state;

    return (
      <Index className='m-page-wrapper'>
        {/* 视频全局对象 */}
        <View
          style={`display: ${
            videoUrl ? 'block' : 'none'
          };position:fixed;top:0;bottom:0;right:0;left:0;z-index:999;background-color:#000;`}
        >
          <Video
            id='j-video'
            style='width: 100%;height: 100%;'
            src={videoUrl}
            controls
            show-fullscreen-btn={false}
            play-btn-position='bottom'
            onFullscreenchange={this.handleFullscreenchange}
          />
        </View>
        <View className='m-chat' style={`height: calc(100vh - ${height}px)`}>
          <View className='m-view'>
            <ScrollView
              className='message-content'
              scrollY
              scrollWithAnimation={scrollWithAnimation}
              scrollIntoView={lastId}
              onClick={this.handleBodyClick}
            >
              <MessageView
                Message={Message}
                onImgClick={this.handleImgClick}
              ></MessageView>
              <View id='m-bottom'></View>
            </ScrollView>
          </View>
          {Bot.botList.length ? (
            <ScrollView scrollX className='m-bot'>
              { Bot.botList.map(bot => <View className='m-bot-item' key={bot.id} onClick={e => this.handleBotClick(bot, e)}>{bot.label}</View>)}
            </ScrollView>
          ) : null}
          <ChatBox
            handleConfirm={this.handleConfirm}
            onPlusClick={this.handlePlusClick}
            onPortraitClick={this.handlePortraitClick}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          ></ChatBox>
          {Options.showFunc && (
            <FuncBox
              list={functionList}
              onFuncClick={this.handleFuncClick}
            ></FuncBox>
          )}
          {Options.showPortrait && (
            <Portrait onEmojiClick={this.handleEmojiClick}></Portrait>
          )}
        </View>
        <FloatLayout
          visible={CorpStatus.evaluationVisible}
          title='请对本次服务进行评价'
          onClose={this.closeEvaluationModal}
        >
          <Evaluation />
        </FloatLayout>
        <BotList></BotList>
        <FloatButton></FloatButton>
      </Index>
    );
  }
}

export default Chat;
