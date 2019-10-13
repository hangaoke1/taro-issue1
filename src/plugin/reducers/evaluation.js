import { INIT_CURRENT_EVALUATION, INIT_LAST_EVALUATION, INIT_EVALUATION_SETTING } from '../constants/evaluation';

const init = {
  lastEvaluation: {},
  evaluationSetting: {},
  currentEvaluation: {
    tagList: [],
    value: 100,
    name: '非常满意',
    remarks: '',
    evaluation_resolved: 0,
    selectTagList: []
  },
  sessionid: null
}

const Evaluation = (state = init, action) => {
  switch (action.type) {
    case INIT_CURRENT_EVALUATION:
      return { ...state, currentEvaluation: JSON.parse(JSON.stringify({ ...state.currentEvaluation, ...action.value }))};
    case INIT_LAST_EVALUATION:
      return { ...state, lastEvaluation: JSON.parse(JSON.stringify({ ...state.lastEvaluation, ...action.value })) };
    case INIT_EVALUATION_SETTING:
      const evaluation = { ...action.value.evaluation };
      const list = evaluation.list;
      const defaultStatus = {
        tagList: [],
        value: 100,
        name: '非常满意'
      }

      if (action.value.evaluation.type != 2) {
        list.sort((a, b) => {
          return a.value - b.value;
        })
      }else{
        list.sort((a,b) => {
          return b.value - a.value;
        })
      }

      list.forEach(item => {
        if (item.value == 100) {
          defaultStatus.tagList = item.tagList;
          defaultStatus.name = item.name;
        }
      })
      return {
        ...state, evaluationSetting: { ...state.evaluationSetting, ...evaluation },
        currentEvaluation: { ...state.currentEvaluation, ...defaultStatus },
        sessionid: action.value.sessionid
      };
    default:
      return state;
  }
}

export default Evaluation;
