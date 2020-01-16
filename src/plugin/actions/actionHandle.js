import Taro from '@tarojs/taro';
import { get } from '../global_config'
import { SET_EVALUATION_VISIBLE, SET_SHUNT_ENTRIES_STATUS } from '../constants/chat';
import { applyKefu, cancelQueue, setEvaluationSessionId } from '../actions/chat';
import { INIT_CURRENT_EVALUATION } from '../constants/evaluation';
import { UPDATE_MESSAGE_BYACTION, PUSH_MESSAGE, UPDATE_MESSAGE_BYUUID } from '../constants/message';

import eventbus from '../lib/eventbus';

export const anctionHandle = (type, data) => {
  const dispatch = get('store').dispatch;
  const evaluation = get('store').getState().Evaluation;
  const session = get('store').getState().Session;

  switch (type) {
    case 'evaluation':
      let sessionCloseTime = session.closeTime;
      let curTime = new Date().getTime();
      let evaluation_timeout = session.shop.setting && session.shop.setting.evaluation_timeout*60*1000 || 10*60*1000;
      const isKefuOnline = session.stafftype === 0 && session.code === 200; // 客服在线状态

      if (!evaluation.evaluationSetting.list) {
        Taro.showToast({
          title: '评价已失效',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      if (sessionCloseTime && curTime - sessionCloseTime > evaluation_timeout && !isKefuOnline) {
        Taro.showToast({
          title: '评价已超时，无法进行评价',
          icon: 'none',
          duration: 2000
        })
        return;
      }

      // 更新评价的会话id
      setEvaluationSessionId(data.sessionid);
      // 打开评价窗口
      dispatch(setEvaluationVisible(true));
      break;
    case 'reApplyKefu':
      applyKefu();
      break;
    case 'selectEntries':
      applyKefu(data);
      // 访客分流已结束，更新状态
      dispatch({
        type: SET_SHUNT_ENTRIES_STATUS,
        value: false
      })
      let message = {
        content: data.label,
        type: 'text',
        time: new Date().getTime(),
        status: 0,
        fromUser: 1
      };
      dispatch({ type: PUSH_MESSAGE, message });
      //点击后禁用分流
      dispatch({
        type: UPDATE_MESSAGE_BYACTION,
        message: {
          type: 'entries',
          disabled: true,
          action: 'selectEntries'
        }
      })

      //点击当前分流隐藏
      dispatch({
        // type: UPDATE_MESSAGE_BYACTION,
        type: UPDATE_MESSAGE_BYUUID,
        message: {
          type: 'text',
          content: data.content,
          uuid: data.uuid,
          time: new Date().getTime(),
          status: 0,
          fromUser: 0
        }
      })
      break;
    case 'cancelQueue':
      dispatch(cancelQueue(data));
      break;
    case 'updateEvaluation':
      {
        let sessionCloseTime = session.closeTime;
        let curTime = new Date().getTime();
        let evaluation_timeout = session.shop.setting && session.shop.setting.evaluation_timeout*60*1000 || 10*60*1000;
        if (sessionCloseTime && curTime - sessionCloseTime > evaluation_timeout) {
          Taro.showToast({
            title: '评价已超时，无法进行评价',
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
      dispatch({
        type: INIT_CURRENT_EVALUATION,
        value: evaluation.lastEvaluation
      })
      dispatch(setEvaluationVisible(true));
      break;
  }
}

const setEvaluationVisible = value => {
  return {
    type: SET_EVALUATION_VISIBLE,
    value
  }
}

export const closeEvaluationModal = () => dispatch => {
  // 关闭的时候将产生的评价内容清除
  eventbus.trigger('reset_evaluation');
  dispatch(setEvaluationVisible(false));
}

export const openEvaluationModal = () => dispatch => {
  dispatch(setEvaluationVisible(true));
}
