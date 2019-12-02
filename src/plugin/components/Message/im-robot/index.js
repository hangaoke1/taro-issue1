import Taro, { useState } from '@tarojs/taro';
import { useDispatch, useSelector } from '@tarojs/redux';
import PropTypes from 'prop-types';
import { View, Textarea } from '@tarojs/components';
import Avatar from '../u-avatar';
import ParserRichText from '@/components/ParserRichText/parserRichText';
import Iconfont from '@/components/Iconfont';
import Modal from '@/components/Modal';
import { get } from '@/plugin/global_config';

import {
  sendRelateText,
  evalRobotAnswer,
  evaluationContent,
  parseUrlAction,
  changeMessageByUUID
} from '../../../actions/chat';

import './index.less';

/**
 * 机器人消息解析
 */
export default function RobotView(props) {
  const [isOpened, setIsOpened] = useState(false);
  const [reason, setReason] = useState('');
  const [disableList, setDisableList] = useState([])
  // 0: 不显示 1: 未评价 2: 有用 3: 没用
  const { item, index } = props;
  let {
    content,
    evaluation,
    evaluation_reason,
    evaluation_content,
    evaluation_guide,
    type,
    idClient,
    transferRgType
  } = item;
  const dispatch = useDispatch();
  const Session = useSelector(state => state.Session);
  const Setting = useSelector(state => state.Setting);

  // 根据index修改消息内容
  function changeMessage(message) {
    dispatch(changeMessageByUUID(message));
  }

  // 点击富文本链接
  function handleLinkpress(event) {
    const { detail } = event;
    parseUrlAction(detail, transferRgType);
  }

  // 评价机器人答案
  function handleAction(val) {

    // 会话有效期判断
    if (item.sessionid !== Session.sessionid) {
      return Taro.showToast({
        title: '该会话已结束，暂不支持评价',
        icon: 'none'
      });
    }

    let userEvaluation = val;

    // 已经评价的不能取消
    if (evaluation === val) {
      return;
    }

    // TODO修改数据状态
    changeMessage(
      Object.assign({}, item, { evaluation: userEvaluation }),
      index
    );

    evalRobotAnswer(idClient, userEvaluation).then(() => {});

    // 用户差评且无需评价原因
    if (userEvaluation === 3 && evaluation_reason === 0) {
      evaluationContent(idClient, '').then(() => {});
    }

    // 用户差评且需要评价原因
    if (userEvaluation === 3 && evaluation_reason === 1) {
      setReason(evaluation_content);
      setIsOpened(true);
    }
  }

  // 差评原因修改
  function handleEvalReason() {
    changeMessage(
      Object.assign({}, item, { evaluation_content: reason }),
      index
    );

    evaluationContent(idClient, reason).then(() => {});
  }

  // 点击关联问题
  function handleQuestionClick(q) {

    // 判断是否是机器人
    if (!get('isRobot')) {
      setDisableList([...disableList, q])
      return Taro.showToast({ title: '消息已失效，无法选择', icon: 'none'})
    }

    const { question, id } = q;

    dispatch(
      sendRelateText({
        text: question,
        id,
        idClient
      })
    );
  }

  function openModal() {
    setReason(evaluation_content);
    setIsOpened(true);
  }
  function handleConfirm() {
    handleEvalReason();
    setIsOpened(false);
  }
  function handleCancel() {
    setIsOpened(false);
  }
  function handleClose() {
    handleEvalReason();
    setIsOpened(false);
  }
  function handleChangeReson(event) {
    setReason(event.detail.value);
  }
  return (
    <View
      className={
        item.fromUser ? 'm-message m-message-right' : 'm-message m-message-left'
      }
    >
      <Avatar fromUser={item.fromUser} staff={item.staff} />
      <View className="u-text-arrow" />
      <View className={`u-text ${evaluation !== 0 ? 'u-text-limit' : ''}`}>
        <ParserRichText html={content} onLinkpress={handleLinkpress} />
        {type === 'qa-list' && item.list.length ? (
          <View className="u-qalist">
            {item.list.map(q => (
              <View
                className="u-qaitem"
                style={Setting.themeText}
                key={q.id}
                onClick={() => handleQuestionClick(q)}
              >
                <View className={`u-dot`} style={Setting.themeBg}/>
                {q.question}
              </View>
            ))}
          </View>
        ) : null}
        {evaluation !== 0 ? (
          <View className="u-action">
            <View className="u-button" onClick={() => handleAction(2)}>
              <Iconfont
                type="icon-dianzanx"
                color={evaluation === 2 ? Setting.themeColor : '#ccc'}
                size="16"
              />
            </View>
            <View className="u-button" onClick={() => handleAction(3)}>
              <Iconfont
                type="icon-dianchapingx"
                color={evaluation === 3 ? Setting.themeColor : '#ccc'}
                size="16"
              />
            </View>
          </View>
        ) : null}
        {evaluation_reason === 1 && evaluation === 3 ? (
          <View
            className="u-textarea"
            onClick={openModal}
          >{evaluation_content || evaluation_guide}</View>
        ) : null}
        <Modal
          isOpened={isOpened}
          onClose={handleClose}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          title="请告知我们具体原因"
          confirmText="确认"
          closeOnClickOverlay
        >
          {isOpened ? (
            <Textarea
              className="u-textareaInput"
              value={reason}
              onInput={handleChangeReson}
              placeholder={evaluation_guide}
            ></Textarea>
          ) : null}
        </Modal>
      </View>
    </View>
  );
}

RobotView.defaultProps = {
  item: {}
};

RobotView.propTypes = {
  item: PropTypes.object
};
