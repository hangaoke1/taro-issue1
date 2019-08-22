import Taro, { useState, useEffect } from '@tarojs/taro';
import { useDispatch } from '@tarojs/redux';
import PropTypes from 'prop-types';
import { View, Text } from '@tarojs/components';
import Avatar from '../u-avatar';
import ParserRichText from '../../ParserRichText/parserRichText';
import Iconfont from '../../Iconfont';

import { sendText, evalRobotAnswer, parseUrlAction } from '../../../actions/chat';

import './index.less';

/**
 * 机器人消息解析
 */
export default function RobotView(props) {
  // 0: 不显示 1: 未评价 2: 有用 3: 没用
  const item = props.item;
  let { content, evaluation: initEvaluation = 0, type, msg } = item;
  const [evaluation, setEvaluation] = useState(initEvaluation);
  const dispatch = useDispatch();

  useEffect(() => {
    setEvaluation(initEvaluation);
    return () => {};
  }, [initEvaluation]);

  // 点击富文本链接
  function handleLinkpress(event) {
    const { detail } = event;
    parseUrlAction(detail)
  }

  // 评价机器人答案
  function handleAction(val) {
    let userEvaluation = val;
    const msgidClient = msg.idClient;
    if (evaluation === val) {
      userEvaluation = 1
    }
    setEvaluation(userEvaluation);
    evalRobotAnswer(msgidClient, userEvaluation).then(() => {
      console.log('-----🙏success 评价完成🙏----')
    })
  }

  // 点击关联问题
  function handleQuestionClick(q) {
    const { question } = q;
    dispatch(sendText(question))
  }

  return (
    <View
      className={
        item.fromUser ? 'm-message m-message-right' : 'm-message m-message-left'
      }
    >
      <Avatar fromUser={item.fromUser} />
      <View className='u-text-arrow' />
      <View className='u-text'>
        <ParserRichText html={content} onLinkpress={handleLinkpress} />
        {type === 'qa-list' && item.list.length ? (
          <View className='u-qalist'>
            {item.list.map(q => (
              <View className='u-qaitem' key={q.id} onClick={() => handleQuestionClick(q)}>
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
