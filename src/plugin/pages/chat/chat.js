import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView, Video, RichText } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';

import { clearUnreadHome } from '@/lib/unread';
import Index from '../../app';
import getSystemInfo from '@/lib/systemInfo';

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
  associate,
  delApplyHumanStaffEntry
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
    },
    delApplyHumanStaffEntry() {
      dispatch(delApplyHumanStaffEntry());
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
      lockBot: [], // 锁定bot入口1s
      // 位置哨兵
      bottomSentry: -1,
      scrollViewOffset: 0,
      constOffset: 0,
      showTopPlaceHolder: false,
      maskHeight: 0
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
  }

  componentWillUnmount() {
    eventbus.off('push_message', this.scrollToBottom);
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidUpdate() {}

  // 重置底部区域
  scrollToBottom = (scrollWithAnimation = true, delay = 100) => {

    if (this.timer) {
      this.handleOffsetCalc();
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
      this.handleOffsetCalc();

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
    this.handleOffsetCalc();
  };

  handleOffsetCalc = () => {
    const query = Taro.createSelectorQuery().in(this.$scope);
    const node = query.select('#m-bottom');
    const { scrollViewOffset } = this.state;
    node
      .boundingClientRect(rect => {
        getSystemInfo.then(res => {
          const offsetBottom = res.windowHeight - rect.top;
          const offsetBottomCalc = offsetBottom - scrollViewOffset
          const ratio = res.windowWidth / 375;
          console.log('ratio', ratio)
          console.log('屏幕高度', res.windowHeight)
          console.log('哨兵距离底部距离: ', offsetBottom); // 667 ---> 0
          console.log('哨兵距离底部距离计算: ', offsetBottomCalc); // 667 ---> 0
          if (!this.state.showTopPlaceHolder && offsetBottom <= 65 * ratio ) {
            this.setState({
              showTopPlaceHolder: true
            })
          }

          this.setState({
            bottomSentry: offsetBottomCalc > 0 ? offsetBottomCalc : 0
          }, () => {
            this.getScrollViewOffset(ratio)
          })
        })
      })
      .exec();
  }

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
    if (isOpen) {
      this.handleOffsetCalc();
    } else {
      this.setState({ height: 0 }, () => {this.handleOffsetCalc();});
    };
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
        const { openEvaluationModal,Session } = this.props;

        let sessionCloseTime = Session.closeTime;
        let curTime = new Date().getTime();
        let evaluation_timeout = Session.shop.setting && Session.shop.setting.evaluation_timeout*60*1000 || 10*60*1000;
        if (sessionCloseTime && curTime - sessionCloseTime > evaluation_timeout) {
          Taro.showToast({
            title: '评价已超时，无法进行评价',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        openEvaluationModal();
        break;
      case 'applyHumanStaff':
        const { delApplyHumanStaffEntry } = this.props;
        applyHumanStaff();
        delApplyHumanStaffEntry();
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

  getScrollViewOffset= (ratio) => {
    const {
      Options,
      Bot,
      Session
    } = this.props;
    const {
      height,
      bottomSentry
    } = this.state;

    const isRobot = Session.stafftype === 1 || Session.robotInQueue === 1;
    const hasBot = isRobot && Bot.botList.length;
    const isOpen = Options.showFunc || Options.showPortrait;

    let constOffset = 65 * ratio + (hasBot ? 45 * ratio : 0); // chatbox固定高度
    let offset = height + (isOpen ? 272 * ratio : 0) + constOffset; // 动态高度

    // 如果哨兵距离底部距离 > 偏移距离，无需移动
    if (bottomSentry >= offset) {
      offset = 0;
    } else {
      // 如果哨兵距离底部距离 < 偏移距离
      offset = offset - bottomSentry
    }

    if (bottomSentry === -1) {
      offset = 0
    }

    this.setState({
      scrollViewOffset: offset,
      constOffset,
      maskHeight: offset
    })
  }

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
      scrollViewOffset,
      showTopPlaceHolder,
      maskHeight
    } = this.state;

    const isRobot = Session.stafftype === 1 || Session.robotInQueue === 1;

    const hasBot = isRobot && Bot.botList.length

    const isOpen = Options.showFunc || Options.showPortrait;

    let offset = scrollViewOffset + 'px'

    const gHeight = `calc(100vh)`

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
            style={`bottom: ${offset};height: ${gHeight};`}
            scrollY
            scrollWithAnimation={scrollWithAnimation}
            scrollIntoView={lastId}
            onTouchStart={this.handleBodyClick}
          >
            <View className="u-message-list">
              <View style={`height: ${showTopPlaceHolder ? constOffset : 0}px`}></View>
              <MessageView
                Message={Message}
                onImgClick={this.handleImgClick}
              ></MessageView>
              <View id="m-bottom"></View>
            </View>
          </ScrollView>
        </View>

        <View
          className={`u-chatbox`}
          style={`transform: translateY(-${
            height ? height + 'px' : isOpen ? Taro.pxTransform(544) : '0'
          });`}
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
          {hasBot ? (
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
          >
            <View id="chat-sentry"></View>
          </ChatBox>
        </View>
        <View
          className="u-mask"
          style={`height: ${maskHeight}px`}
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
