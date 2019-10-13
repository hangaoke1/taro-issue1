import { get } from '../global_config'
import { SET_EVALUATION_VISIBLE, SET_SHUNT_ENTRIES_STATUS } from '../constants/chat';
import { applyKefu, cancelQueue } from '../actions/chat';
import { INIT_CURRENT_EVALUATION } from '../constants/evaluation';
import { UPDATE_MESSAGE_BYACTION } from '../constants/message';

import eventbus from '../lib/eventbus';

export const anctionHandle = (type, data) => {
  const dispatch = get('store').dispatch;
  const evaluation = get('store').getState().Evaluation;

  switch (type) {
    case 'evaluation':
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

      // 点击后禁用分流
      dispatch({
        type: UPDATE_MESSAGE_BYACTION,
        message: {
          type: 'entries',
          disabled: true,
          action: 'selectEntries'
        }
      })
      break;
    case 'cancelQueue':
      dispatch(cancelQueue(data));
      break;
    case 'updateEvaluation':
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
