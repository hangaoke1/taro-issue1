import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Video, RichText } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';

import { clearUnreadHome } from '@/lib/unread';
import Index from '../../app';

import MessageView from '../../components/Message';
import ChatBox from '../../components/ChatBox';
import FuncBox from '../../components/FuncBox';
import Portrait from '../../components/Portrait';
import FloatLayout from '../../components/FloatLayout';
import Evaluation from '../../components/Evaluation';

import BotOrderList from '../../components/BotOrderList';
import BotForm from '../../components/BotForm';
import BotDrawerList from '../../components/BotDrawerList';
import BotBubbleList from '../../components/BotBubbleList';
import BotCard from '../../components/BotCard';
import FloatButton from '../../components/FloatButton';

import { NAVIGATIONBAR_TITLE } from '../../constants';

import {
  createAccount,
  sendText,
  sendImage,
  applyHumanStaff,
  emptyAssociate,
  associate
} from '../../actions/chat';
import {
  toggleShowFun,
  toggleShowPortrait,
  hideAction
} from '../../actions/options';
import {
  closeEvaluationModal,
  openEvaluationModal
} from '../../actions/actionHandle';
import eventbus from '../../lib/eventbus';
import { text2em } from '../../utils';
import _debounce from '@/lib/debounce'; // loadsh debounce在小程序下引用存在问题

import functionList from './function.config';
import './chat.less';

const dAssociate = _debounce(associate, 300, false);

@connect(
  ({ Session, Message, Options, CorpStatus, Bot, Associate }) => ({
    Session,
    Message,
    Options,
    CorpStatus,
    Bot,
    Associate
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
    },
    openEvaluationModal() {
      dispatch(openEvaluationModal());
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
      scrollTop: 0,
      height: 0,
      videoUrl: '',
      wrapHeight: 0,
      scrollWithAnimation: true,
      showAssociate: false,
      needOffset: false, // 聊天内容是否需要顶起
      lockBot: [] // 锁定bot入口1s
    };
  }

  createAction() {
    const { createAccount: _createAccount } = this.props;
    _createAccount();
  }

  componentDidMount() {
    // 清空未读消息
    clearUnreadHome();

    eventbus.on('push_message', this.scrollToBottom);
    eventbus.on('video_click', this.handlePlay);
    this.scrollToBottom(false, 1000);
    this.calcWrapHeight();
  }

  componentWillUnmount() {
    eventbus.off('push_message', this.scrollToBottom);
  }

  componentDidUpdate() {
    if (this.state.needOffset) return;
    this.needOffset();
  }

  // 计算滚动容器高度
  calcWrapHeight() {
    const query = Taro.createSelectorQuery().in(this.$scope);
    const node = query.select('.u-scroll');
    node
      .fields({ size: true }, res => {
        this.setState({ wrapHeight: res.height }, () => {
          this.needOffset();
        });
      })
      .exec();
  }

  needOffset() {
    const query = Taro.createSelectorQuery().in(this.$scope);
    const node = query.select('.u-message-list');
    node
      .fields({ size: true }, res => {
        if (res.height >= this.state.wrapHeight) {
          this.setState({ needOffset: true });
        }
      })
      .exec();
  }

  componentDidShow() {}

  componentDidHide() {}

  // 重置底部区域
  scrollToBottom = (scrollWithAnimation = true, delay = 300) => {
    if (this.timer) {
      return;
    }
    this.setState({
      lastId: '',
      scrollWithAnimation
    });
    this.timer = setTimeout(() => {
      this.setState({
        lastId: 'm-bottom',
      });

      this.timer = null;
    }, delay);
  };

  handleConfirm = event => {
    const { sendText } = this.props;
    let value = event.detail.value;

    // 清空联想文本
    this.handleEmptyAssociate();

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
    this.setState({ height: 0 });
    if (this.state.height) return;
    this.scrollToBottom();
  };

  // 处理点击加号
  handlePlusClick = () => {
    this.props.toggleShowFun();
    this.setState({ height: 0 });
    if (this.state.height) return;
    this.scrollToBottom();
  };

  // 扩展功能栏点击处理
  handleFuncClick = item => {
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
          _sendImage(res);
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
    const { Options } = this.props;
    const isOpen = Options.showFunc || Options.showPortrait;
    if (isOpen) return;
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
    const label = bot.label;

    // 如果在锁列表中则中断后续操作
    if (this.state.lockBot.includes(label)) {
      return;
    }

    const { sendText } = this.props;
    sendText(label);

    this.setState(state => {
      return {
        lockBot: [...state.lockBot, label]
      };
    });
    // 1s后释放
    setTimeout(() => {
      this.setState(state => {
        return {
          lockBot: state.lockBot.filter(item => item !== label)
        };
      });
    }, 1000);
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

  /**
   * 点击入口按钮
   */
  handleSelectEntry = key => {
    switch (key) {
      case 'evaluation':
        const { openEvaluationModal } = this.props;
        openEvaluationModal();
        break;
      case 'applyHumanStaff':
        applyHumanStaff();
        break;
    }
  };

  handleAssociate = text => {
    this.setState({
      showAssociate: true
    });
    dAssociate(text);
  };

  // 点击联想文本
  handleAssociateClick = text => {
    if (!text.trim()) {
      return;
    }
    const { sendText } = this.props;
    sendText(text);
    eventbus.trigger('reset_input');
    this.handleEmptyAssociate();
  };

  handleEmptyAssociate = () => {
    this.setState({
      showAssociate: false
    });
    emptyAssociate();
  };

  render() {
    const {
      Message,
      Options,
      CorpStatus,
      Bot,
      Associate,
      Session
    } = this.props;
    const {
      lastId,
      height,
      videoUrl,
      scrollWithAnimation,
      showAssociate,
      lockBot,
      needOffset
    } = this.state;
    const isRobot = Session.stafftype === 1 || Session.robotInQueue === 1;

    const isOpen = Options.showFunc || Options.showPortrait;

    const offset = `calc(${height}px + ${Taro.pxTransform(130)} + ${
      isOpen ? Taro.pxTransform(544) : '0px'
    } + ${isRobot && Bot.botList.length ? Taro.pxTransform(90) : '0px'})`

    const hasBot = isRobot && Bot.botList.length

    return (
      <Index className="m-page-wrapper">
        
        {/* 视频全局对象 */}
        <View
          style={`display: ${
            videoUrl ? 'block' : 'none'
          };position:fixed;top:0;bottom:0;right:0;left:0;z-index:999;background-color:#000;`}
        >
          <Video
            id="j-video"
            style="width: 100%;height: 100%;"
            src={videoUrl}
            controls
            show-fullscreen-btn={false}
            play-btn-position="bottom"
            onFullscreenchange={this.handleFullscreenchange}
          />
        </View>
        <View className="m-chat">
          <ScrollView
            className="u-scroll"
            style={
              !needOffset
                ? `padding-top: ${ needOffset && hasBot ? Taro.pxTransform(88) : 0}`
                : `bottom: ${offset};padding-top: ${ needOffset && hasBot ? Taro.pxTransform(88) : 0}`
            }
            scrollY
            scrollWithAnimation={scrollWithAnimation}
            scrollIntoView={lastId}
            onTouchStart={this.handleBodyClick}
          >
            <View className="u-message-list">
              {/* <View style={`height: ${ needOffset && hasBot ? Taro.pxTransform(88) : 0}`}></View> */}
              <MessageView
                Message={Message}
                onImgClick={this.handleImgClick}
              ></MessageView>
            </View>
            <View id="m-bottom"></View>
          </ScrollView>
        </View>

        <View
          className={`u-chatbox`}
          style={`transform: translateY(-${
            height ? height + 'px' : isOpen ? Taro.pxTransform(544) : '0'
          });`}
          // style={`transform: translateY(-500px);`}
        >
          {showAssociate ? (
            <View className="m-associate">
              <View className="m-associate-list">
                {Associate.questionContents.map(item => {
                  return (
                    <View
                      className="m-associate-item"
                      onClick={this.handleAssociateClick.bind(this, item.value)}
                    >
                      <RichText
                        nodes={text2em(item.value, Associate.content)}
                      ></RichText>
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
          {isRobot && Bot.botList.length ? (
            <ScrollView scrollX className="m-bot">
              {Bot.botList.map(bot => (
                <View
                  className={`m-bot-item ${
                    lockBot.includes(bot.label) ? 'z-bot-disable' : ''
                  }`}
                  key={bot.id}
                  onClick={e => this.handleBotClick(bot, e)}
                >
                  {bot.label}
                </View>
              ))}
            </ScrollView>
          ) : null}
          <ChatBox
            onInput={this.handleAssociate}
            onConfirm={this.handleConfirm}
            onPlusClick={this.handlePlusClick}
            onPortraitClick={this.handlePortraitClick}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          ></ChatBox>
        </View>
        <View
          className="u-mask"
          style={`height: ${offset}`}
        ></View>
        <View className={`u-funcbox ${Options.showFunc ? 'open' : ''}`}>
          <FuncBox
            list={functionList}
            onFuncClick={this.handleFuncClick}
          ></FuncBox>
        </View>
        <View className={`u-funcbox ${Options.showPortrait ? 'open' : ''}`}>
          <Portrait onEmojiClick={this.handleEmojiClick}></Portrait>
        </View>
        <FloatLayout
          visible={CorpStatus.evaluationVisible}
          title="请对本次服务进行评价"
          onClose={this.closeEvaluationModal}
        >
          <Evaluation />
        </FloatLayout>
        <BotOrderList></BotOrderList>
        <BotForm></BotForm>
        <BotDrawerList></BotDrawerList>
        <BotBubbleList></BotBubbleList>
        <BotCard></BotCard>
        {CorpStatus.entryConfig.length ? (
          <FloatButton
            entryConfig={CorpStatus.entryConfig}
            onSelect={this.handleSelectEntry}
          />
        ) : null}
      </Index>
    );
  }
}

export default Chat;
