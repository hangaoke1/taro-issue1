import { get } from '../global_config'
import { SET_EVALUATION_VISIBLE } from '../constants/chat';
import { applyKefu,cancelQueue } from '../actions/chat';
import{INIT_CURRENT_EVALUATION} from '../constants/evaluation';

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
  dispatch(setEvaluationVisible(false));
}
