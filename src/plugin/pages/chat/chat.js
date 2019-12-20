import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView, Video, RichText } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import _get from "lodash/get";

import { clearUnreadHome } from "@/lib/unread";
import Index from "../../app";
import getSystemInfo from "@/lib/systemInfo";
import { setClipboardData } from "@/utils/extendTaro";

import MessageView from "../../components/Message";
import ChatBox from "../../components/ChatBox";
import FuncBox from "../../components/FuncBox";
import Portrait from "../../components/Portrait";
import FloatLayout from "../../components/FloatLayout";
import Evaluation from "../../components/Evaluation";

import BotOrderList from "../../components/BotOrderList";
import BotForm from "../../components/BotForm";
import BotDrawerList from "../../components/BotDrawerList";
import BotBubbleList from "../../components/BotBubbleList";
import BotCard from "../../components/BotCard";
import FloatButton from "../../components/FloatButton";
import Back from "../../components/Back";

import { get } from "../../global_config";

import { NAVIGATIONBAR_TITLE } from "../../constants";

import {
  createAccount,
  sendText,
  sendImage,
  applyHumanStaff,
  emptyAssociate,
  associate,
  delApplyHumanStaffEntry,
  canSendMessage,
  getSdkSetting,
  unshiftMessage,
  initMessage,
  exitSession,
  setEvaluationSessionId
} from "../../actions/chat";
import {
  toggleShowFun,
  toggleShowPortrait,
  hideAction
} from "../../actions/options";
import {
  closeEvaluationModal,
  openEvaluationModal
} from "../../actions/actionHandle";
import eventbus from "../../lib/eventbus";
import { text2em } from "../../utils";
import _debounce from "@/lib/debounce"; // loadsh debounce在小程序下引用存在问题

import functionList from "./function.config";
import "./chat.less";

const dAssociate = _debounce(associate, 300, false);

@connect(
  ({ Session, Message, Options, CorpStatus, Bot, Associate, Setting }) => ({
    Session,
    Message,
    Options,
    CorpStatus,
    Bot,
    Associate,
    Setting
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
    getSdkSetting();
    this.lockEntrance = []; // 锁定输入框上方人工会话快捷入口
    this.state = {
      scrollIntoView: "",
      scrollWithAnimation: true,
      height: 0,
      videoUrl: "",
      wrapHeight: 0,
      showAssociate: false,
      lockBot: [], // 锁定bot入口1s
      // 位置哨兵
      bottomSentry: -1,
      scrollViewOffset: 0,
      constOffset: 0,
      showTopPlaceHolder: false,
      chatViewScrollY: true,
      // 优化体验
      showLoading: true,
      firstLoading: true,
      statusBarHeight: wx.getSystemInfoSync()["statusBarHeight"]
    };
  }

  createAction() {
    const { createAccount: _createAccount } = this.props;
    _createAccount();
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showLoading: false,
        firstLoading: false
      });
    }, 1000);
    // 清空未读消息
    clearUnreadHome();
    eventbus.on("unshift_message", this.handleUnshiftMessage);
    eventbus.on("push_message", this.handlePushMessage);
    eventbus.on("reset_scrollIntoView", this.handleResetScrollIntoView);

    eventbus.on("video_click", this.handlePlay);
    eventbus.on("disabled_chat_scrollY", () => {
      this.setState({
        chatViewScrollY: false
      });
    });
    eventbus.on("enable_chat_scrollY", () => {
      this.setState({
        chatViewScrollY: true
      });
    });

    initMessage();

    this.scrollToBottom(false, 500, true);
    this.handleOffsetCalc();
  }

  componentWillUnmount() {
    eventbus.off("unshift_message", this.handleUnshiftMessage);
    eventbus.off("push_message", this.handlePushMessage);
    eventbus.off("reset_scrollIntoView", this.handleResetScrollIntoView);
    eventbus.off("video_click", this.handlePlay);
  }

  handleResetScrollIntoView = () => {
    this.setState({
      scrollIntoView: ""
    });
  };

  componentDidShow() {
    Taro.hideNavigationBarLoading();
    Taro.setNavigationBarTitle({
      title: get("title")
    });
  }

  componentDidHide() {}

  handleUnshiftMessage = (id, finished) => {
    this.state.finished = finished;
    this.setState({
      showLoading: true
    });
    setTimeout(() => {
      Taro.hideLoading();
      this.state.loading = false;
      this.setState({
        showLoading: false
      });
    }, 1000);
    setTimeout(() => {
      this.setState({
        scrollIntoView: id,
        scrollWithAnimation: false
      });
    }, 500);
  };

  handlePushMessage = () => {
    this.scrollToBottom(true, 300, false);
  };
  // 重置底部区域
  scrollToBottom = (scrollWithAnimation = true, delay = 300, force = true) => {
    if (
      this.state.scrollIntoView !== "" &&
      this.state.scrollIntoView !== "m-bottom" &&
      !force
    ) {
      return;
    }

    if (this.timer) {
      this.handleOffsetCalc();
      return;
    }

    this.setState({
      scrollIntoView: "",
      scrollWithAnimation
    });

    this.timer = setTimeout(() => {
      this.setState({
        scrollIntoView: "m-bottom"
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
    if (this.props.Options.showFunc || this.props.Options.showPortrait) {
      this.props.hideAction();
      this.handleOffsetCalc();
    }
  };

  handleOffsetCalc = cb => {
    const query = Taro.createSelectorQuery().in(this.$scope);
    const node = query.select("#m-bottom");
    const { scrollViewOffset } = this.state;
    node
      .boundingClientRect(rect => {
        getSystemInfo.then(res => {
          const offsetBottom = res.windowHeight - rect.top;
          const offsetBottomCalc = offsetBottom - scrollViewOffset;
          const ratio = res.windowWidth / 375;
          // console.log('ratio', ratio)
          // console.log('屏幕高度', res.windowHeight)
          // console.log('哨兵距离底部距离: ', offsetBottom); // 667 ---> 0
          // console.log('哨兵距离底部距离计算: ', offsetBottomCalc); // 667 ---> 0
          if (!this.state.showTopPlaceHolder && offsetBottom <= 75 * ratio) {
            this.setState(
              {
                showTopPlaceHolder: true
              },
              () => {
                this.scrollToBottom();
              }
            );
          }

          this.setState(
            {
              bottomSentry: offsetBottomCalc > 0 ? offsetBottomCalc : 0 // 获取哨兵位置
            },
            () => {
              // 获取内容区域偏移距离
              this.getScrollViewOffset(ratio, cb);
            }
          );
        });
      })
      .exec();
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
      case "album":
        // 照片
        Taro.chooseImage({
          sourceType: ["album"]
        }).then(res => {
          _sendImage(res);
        });
        break;
      case "camera":
        // 拍摄
        Taro.chooseImage({
          sourceType: ["camera"]
        }).then(res => {
          _sendImage(res);
        });
        break;
      default:
        console.log(`暂不支持${item.type}`);
    }
  };

  // 处理emoji表情点击
  handleEmojiClick = item => {
    eventbus.trigger("emoji_click", item);
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
      this.setState({ height: 0 }, () => {
        this.handleOffsetCalc();
      });
    }
  };

  /** 消息体点击事件处理 **/
  handleImgClick = item => {
    const imgMessageList = this.props.Message.filter(
      msg => msg.type === "image"
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
    const videoCtx = Taro.createVideoContext("j-video");
    videoCtx.requestFullScreen({
      direction: 0
    });
  };
  // 点击人工会话下快捷入口
  handleQuickEntryClick = entry => {
    if (this.lockEntrance.includes(entry.label)) {
      return;
    }
    this.lockEntrance.push(entry.label);
    setTimeout(() => {
      this.lockEntrance = this.lockEntrance.filter(
        item => item !== entry.label
      );
    }, 1000);

    const { openEvaluationModal, Session, CorpStatus } = this.props;
    switch (entry.action) {
      // 链接外跳
      case "open_link":
        setClipboardData(entry.data);
        break;
      // 评价
      case "evaluate":
        // 判断是否已评价或者超时
        const entryItem = _get(CorpStatus, "entryConfig", []).filter(
          item => item.key === "evaluation"
        )[0];
        const hasEvaluate = entryItem ? entryItem.disabled : true;

        // 已经评价完毕
        if (hasEvaluate) {
          Taro.showToast({
            title: "您已经评价过啦",
            icon: "none"
          });
          return;
        }

        let sessionCloseTime = Session.closeTime;
        let curTime = new Date().getTime();

        let evaluation_timeout =
          (Session.shop.setting &&
            Session.shop.setting.evaluation_timeout * 60 * 1000) ||
          10 * 60 * 1000;
        if (
          sessionCloseTime &&
          curTime - sessionCloseTime > evaluation_timeout
        ) {
          Taro.showToast({
            title: "评价已超时，无法进行评价",
            icon: "none",
            duration: 2000
          });
          return;
        }
        // 重置评价sessionid为当前会话id
        setEvaluationSessionId();
        openEvaluationModal();
        break;
      // 关闭会话
      case "close_session":
        const isSessionOffline =
          Session.stafftype === 0 && Session.code === 206; // 会话结束状态
        if (isSessionOffline) {
          Taro.showToast({
            title: "您已退出咨询",
            icon: "none"
          });
        } else {
          Taro.showModal({
            title: "",
            content: "确认退出对话?"
          }).then(res => {
            if (res.confirm) {
              exitSession();
            }
          });
        }
        break;
      // 自定义事件
      case "custom":
        eventbus.trigger("on_entrance_click", entry);
        break;
      default:
        console.warn("暂不支持该类型快捷入口", entry);
    }
  };
  // 点击bot快捷入口
  handleBotClick = bot => {
    const label = bot.label;

    // 如果在锁列表中则中断后续操作
    if (this.state.lockBot.includes(label)) {
      return;
    }

    if (!canSendMessage()) {
      return Taro.showToast({
        title: "请等待连线成功后，再发送消息",
        icon: "none",
        duration: 2000
      });
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
    const videoCtx = Taro.createVideoContext("j-video");
    if (!e.detail.fullScreen) {
      // 退出全屏后停止视频
      videoCtx.stop();
      this.setState({
        videoUrl: ""
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
      case "evaluation":
        const { openEvaluationModal, Session } = this.props;
        const isKefuOnline = Session.stafftype === 0 && Session.code === 200; // 客服在线状态

        let sessionCloseTime = Session.closeTime;
        let curTime = new Date().getTime();
        let evaluation_timeout =
          (Session.shop.setting &&
            Session.shop.setting.evaluation_timeout * 60 * 1000) ||
          10 * 60 * 1000;
        if (
          sessionCloseTime &&
          curTime - sessionCloseTime > evaluation_timeout &&
          !isKefuOnline
        ) {
          Taro.showToast({
            title: "评价已超时，无法进行评价",
            icon: "none",
            duration: 2000
          });
          return;
        }
        // 重置评价sessionid为当前会话id
        setEvaluationSessionId();
        openEvaluationModal();
        break;
      case "applyHumanStaff":
        const { delApplyHumanStaffEntry } = this.props;
        const transferRgType = 30;
        applyHumanStaff(transferRgType);
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
    eventbus.trigger("reset_input");
    this.handleEmptyAssociate();
  };

  handleEmptyAssociate = () => {
    this.setState({
      showAssociate: false
    });
    emptyAssociate();
  };

  getScrollViewOffset = (ratio, cb) => {
    const { Options } = this.props;
    const { height, bottomSentry } = this.state;

    const isOpen = Options.showFunc || Options.showPortrait;

    let constOffset = 75 * ratio;
    let offset = height + (isOpen ? 272 * ratio : 0) + constOffset; // 动态高度

    // 如果哨兵距离底部距离 > 偏移距离，无需移动
    if (bottomSentry >= offset) {
      offset = 0;
    } else {
      // 如果哨兵距离底部距离 < 偏移距离
      offset = offset - bottomSentry;
    }

    if (bottomSentry === -1) {
      offset = 0;
    }

    this.setState(
      {
        scrollViewOffset: offset,
        constOffset
      },
      () => {
        cb && cb();
      }
    );
  };

  handleOnScrollToUpper = () => {
    if (!canSendMessage()) {
      return;
    }
    const uuid = _get(this.props, "Message[0].uuid");
    if (!uuid) {
      return;
    }
    if (this.state.loading || this.state.finished) {
      return;
    }
    this.state.loading = true;
    Taro.showLoading();
    setTimeout(() => {
      unshiftMessage(uuid);
    }, 500);
  };

  handleOnScrollToLower = () => {};

  handleBack = () => {
    Taro.navigateBack();
  };

  render() {
    const {
      Message,
      Options,
      CorpStatus,
      Bot,
      Associate,
      Session,
      Setting
    } = this.props;
    const {
      height,
      videoUrl,
      showAssociate,
      lockBot,
      scrollViewOffset,
      showTopPlaceHolder,
      chatViewScrollY,
      constOffset,
      showLoading,
      scrollWithAnimation,
      scrollIntoView,
      firstLoading,
      statusBarHeight
    } = this.state;

    const isRobot =
      (Session.stafftype === 1 || Session.robotInQueue === 1) &&
      Session.code === 200; // 机器人状态

    let hasBot = isRobot && Bot.len;

    const isKefuOnline = Session.stafftype === 0 && Session.code === 200; // 客服在线状态

    const isKefuOffline = Session.stafftype === 0 && Session.code === 201; // 客服离线状态

    const isKefuQueue = Session.stafftype === 0 && Session.code === 203; // 客服排队状态

    const isSessionOffline = Session.stafftype === 0 && Session.code === 206; // 会话结束状态

    const isKefuQuiet = isKefuOnline && Session.realStaffid === -1; // 访客未说话静默状态

    let quickEntryList = _get(Setting, "setting.entranceSetting", []); // 人工会话快捷入口列表

    let showEvaluation = _get(CorpStatus, "entryConfig", []).map(
      item => item.key === "evaluation"
    ).length; // 是否存在评价入口

    // 人工快捷入口-隐藏评价
    if (!showEvaluation) {
      quickEntryList = quickEntryList.filter(
        item => item.action !== "evaluate"
      );
    }

    // 人工快捷入口-隐藏结束会话
    // if (!isKefuOnline) {
    //   quickEntryList = quickEntryList.filter(item => item.action !== 'close_session');
    // }

    // 人工快捷入口-隐藏评价/结束会话
    if (isKefuOffline || isKefuQuiet) {
      quickEntryList = quickEntryList.filter(
        item => item.action !== "evaluate"
      );
      quickEntryList = quickEntryList.filter(
        item => item.action !== "close_session"
      );
    }

    // 人工快捷入口-排队中&有机器人
    if (isKefuQueue && Session.robotInQueue) {
      quickEntryList = [];
    }

    // 人工快捷入口-排队中&无机器人
    if (isKefuQueue && !Session.robotInQueue) {
      quickEntryList = quickEntryList.filter(
        item => item.action !== "evaluate"
      );
      quickEntryList = quickEntryList.filter(
        item => item.action !== "close_session"
      );
    }

    let hasQuickEntry =
      !isRobot && quickEntryList && quickEntryList.length && Session.code;

    let offset = scrollViewOffset + "px";

    const isOpen = Options.showFunc || Options.showPortrait;

    const gHeight = `calc(100vh)`;

    // 首次加载隐藏快捷入口
    if (firstLoading) {
      hasQuickEntry = false;
      hasBot = false;
    }

    const isFullScreen = get("fullScreen");

    return (
      <Index className="m-page-wrapper">
        <Back></Back>
        <View
          class="u-loading"
          style={`visibility: ${showLoading ? "visible" : "hidden"}`}
        >
          消息加载中...
        </View>
        {/* 视频全局对象 */}
        <View
          style={`display: ${
            videoUrl ? "block" : "none"
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
            scrollY={chatViewScrollY}
            scrollWithAnimation={scrollWithAnimation}
            scrollIntoView={scrollIntoView}
            onTouchStart={this.handleBodyClick}
            onScrollToUpper={this.handleOnScrollToUpper}
            onScrollToLower={this.handleOnScrollToLower}
          >
            <View
              style={`height: ${showTopPlaceHolder ? constOffset : 0}px`}
            ></View>
            { isFullScreen && <View
              style={`height: ${statusBarHeight}px`}
            ></View>}
            {Message.map(it => (
              <View key={it.uuid} id={it.uuid}>
                <MessageView
                  it={it}
                  onImgClick={this.handleImgClick}
                ></MessageView>
              </View>
            ))}
            <View
              style={`height: ${
                hasBot || hasQuickEntry ? Taro.pxTransform(76) : 0
              }`}
            ></View>
            <View id="m-bottom"></View>
          </ScrollView>
        </View>

        <View
          className={`u-chatbox`}
          style={`bottom: ${
            height ? height + "px" : isOpen ? Taro.pxTransform(544) : "0"
          };`}
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
              {Bot.botList.map((bot, index) => (
                <View
                  className={`m-bot-item ${
                    lockBot.includes(bot.label) ? "z-bot-disable" : ""
                  }`}
                  style={`border-color: ${Setting.themeColor ||
                    "#e1e3e6"};animation-delay: ${index * 200}ms;`}
                  key={bot.id}
                  onClick={e => this.handleBotClick(bot, e)}
                >
                  {bot.label}
                </View>
              ))}
            </ScrollView>
          ) : null}
          {hasQuickEntry ? (
            <ScrollView scrollX className="m-bot">
              {quickEntryList.map((entry, index) => (
                <View
                  className={`m-bot-item`}
                  style={`border-color: ${Setting.themeColor ||
                    "#e1e3e6"};animation-delay: ${index * 200}ms;`}
                  key={entry.label}
                  onClick={this.handleQuickEntryClick.bind(this, entry)}
                >
                  {entry.label}
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
        <View className="u-mask" style={`height: ${height}px`}></View>
        <View className={`u-funcbox ${Options.showFunc ? "open" : ""}`}>
          <FuncBox
            list={functionList}
            onFuncClick={this.handleFuncClick}
          ></FuncBox>
        </View>
        <View className={`u-funcbox ${Options.showPortrait ? "open" : ""}`}>
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
