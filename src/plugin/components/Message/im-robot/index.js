import Taro from '@tarojs/taro';
import { useDispatch, useSelector } from '@tarojs/redux';
import PropTypes from 'prop-types';
import { View, Text, Textarea } from '@tarojs/components';
import Avatar from '../u-avatar';
import ParserRichText from '../../ParserRichText/parserRichText';
import Iconfont from '../../Iconfont';

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
  // 0: 不显示 1: 未评价 2: 有用 3: 没用
  const { item, index } = props;
  let {
    content,
    evaluation,
    evaluation_reason,
    evaluation_content,
    type,
    idClient,
    msg = {}
  } = item;
  const dispatch = useDispatch();
  const Session = useSelector(state => state.Session)

  // 根据index修改消息内容
  function changeMessage(message) {
    dispatch(changeMessageByUUID(message));
  }

  // 点击富文本链接
  function handleLinkpress(event) {
    const { detail } = event;
    parseUrlAction(detail);
  }

  // 评价机器人答案
  function handleAction(val) {
    // 会话有效期判断
    if (item.sessionid !== Session.sessionid) {
      return Taro.showToast({
        title: '该会话已结束，暂不支持评价',
        icon: 'none'
      })
    }

    let userEvaluation = val;
    if (evaluation === val) {
      userEvaluation = 1;
    }

    // TODO修改数据状态
    changeMessage(
      Object.assign({}, item, { evaluation: userEvaluation }),
      index
    );

    evalRobotAnswer(idClient, userEvaluation).then(() => {
      console.log('-----🙏success 评价完成🙏----');
    });

    // 用户差评且无需评价原因
    if (userEvaluation === 3 && evaluation_reason === 0) {
      evaluationContent(idClient, '').then(() => {
        console.log('-----🙏success 差评原因提交完成🙏----');
      });
    }
  }

  // 差评原因修改
  function handleEvalReson(event) {
    const usrEvaluationContent = event.detail.value;

    changeMessage(
      Object.assign({}, item, { evaluation_content: usrEvaluationContent }),
      index
    );

    evaluationContent(idClient, usrEvaluationContent).then(() => {
      console.log('-----🙏success 差评原因提交完成🙏----');
    });
  }

  // 点击关联问题
  function handleQuestionClick(q) {
    const { question, id } = q;

    dispatch(sendRelateText({
      text: question,
      id,
      idClient
    }));
  }

  return (
    <View
      className={
        item.fromUser ? 'm-message m-message-right' : 'm-message m-message-left'
      }
    >
      <Avatar fromUser={item.fromUser} staff={item.staff} />
      <View className='u-text-arrow' />
      <View className='u-text'>
        <ParserRichText html={content} onLinkpress={handleLinkpress} />
        {type === 'qa-list' && item.list.length ? (
          <View className='u-qalist'>
            {item.list.map(q => (
              <View
                className='u-qaitem'
                key={q.id}
                onClick={() => handleQuestionClick(q)}
              >
                <View className='u-dot' />
                {q.question}
              </View>
            ))}
          </View>
        ) : null}
        {evaluation !== 0 ? (
          <View className='u-action'>
            <View className='u-button' onClick={() => handleAction(2)}>
              <Iconfont
                type='icon-dianzanx'
                color={evaluation === 2 ? '#5092e1' : '#ccc'}
                size='16'
              />
              <Text className='u-tip'>有用</Text>
            </View>
            <View className='u-hr' />
            <View className='u-button' onClick={() => handleAction(3)}>
              <Iconfont
                type='icon-dianchapingx'
                color={evaluation === 3 ? '#5092e1' : '#ccc'}
                size='16'
              />
              <Text className='u-tip'>没用</Text>
            </View>
          </View>
        ) : null}
        {evaluation_reason === 1 && evaluation === 3 ? (
          <Textarea
            className='u-textarea'
            value={evaluation_content}
            onBlur={handleEvalReson}
          />
        ) : null}
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
