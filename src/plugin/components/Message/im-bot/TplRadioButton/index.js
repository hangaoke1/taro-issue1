import Taro, { Component } from "@tarojs/taro";
import { connect } from '@tarojs/redux';
import { View } from "@tarojs/components";
import PropTypes from "prop-types";
import _get from "lodash/get";
import _cloneDeep from 'lodash/cloneDeep';
import { changeMessageByUUID, sendText } from '@/plugin//actions/chat';
import ParserRichText from '@/components/ParserRichText/parserRichText';
import { parseUrlAction } from '@/actions/chat';
import { get } from '@/plugin/global_config';
import _debounce from "@/lib/debounce";
import "./index.less";

@connect(
  ({ Session, Message, Setting }) => ({
    Session,
    Message,
    Setting
  }),
  dispatch => ({
    updateMessageByUUID(newMessage) {
      dispatch(changeMessageByUUID(newMessage));
    },
    sendText(value) {
      dispatch(sendText(value));
    }
  })
)
class RadioButton extends Component {
  static propTypes = {
    item: PropTypes.object,
    tpl: PropTypes.object
  };

  componentWillMount() {}

  componentDidMount() {}
  
  handleClick = _debounce((btn) => {
    const { item = {}, Session, sendText } = this.props;
    const isSameSession = Session.sessionid === item.sessionid
    // 非机器人或者跨会话则失效
    if (!isSameSession || !get('isRobot')) {
      Taro.showToast({
        title: "会话已失效",
        icon: "none"
      });
    } else {
      sendText(btn.label)
    }
  }, 300, true)

  getIndex = (message, uuid) => {
    for(let i = 0; i < message.length; i++) {
      if (message[i].uuid === uuid) {
        return i
      }
    }
  }

  checkHasUserMessageAfter = (Message, uuid) => {
    const index = this.getIndex(Message, uuid)
    const afterMessages = Message.slice(index + 1)
    const userMessages = afterMessages.filter(msg => !!msg.fromUser)
    const hide = !!userMessages.length
    let newMessage = _cloneDeep(this.props.item)
    newMessage.hideBtns = true
    if (hide) {
      this.props.updateMessageByUUID(newMessage);
    }
  }

  handleLinkpress = (event) => {
    const { detail } = event;
    const { transferRgType } = this.props.item || {};
    parseUrlAction(detail, transferRgType);
  }

  render() {
    const { tpl, Message, item = {}, Session, Setting } = this.props;
    const list = _get(tpl, "list", []);
    const label = _get(tpl, "label", '');
    const isRobot = get('isRobot');
    const isSameSession = Session.sessionid === item.sessionid
    let showBtns = list.length && !item.hideBtns;
    // 如果按钮显示，则需要进行隐藏判断
    if (!item.hideBtns && isRobot && isSameSession) {
      this.checkHasUserMessageAfter(Message, item.uuid)
    }
    return (
      <View className="u-radiobutton" style={{ marginBottom: showBtns ? "50px" : "0" }}>
        <ParserRichText
          html={label}
          onLinkpress={this.handleLinkpress}
        ></ParserRichText>
        {showBtns ? (
          <View className="u-wrap">
            <View className="u-inner-wrap">
            <View className="u-list">
              {list.map((btn, index) => (
                <View className="u-item" style={{animationDelay: `${index * 200}ms`, borderColor: Setting.themeColor}} onClick={this.handleClick.bind(this, btn)}>{btn.label}</View>
              ))}
            </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  }
}

export default RadioButton;
