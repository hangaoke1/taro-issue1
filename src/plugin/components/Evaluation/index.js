import { useSelector, useDispatch } from '@tarojs/redux';
import { View, Button } from '@tarojs/components';
import Render2Level from './render2Level';
import Render345Level from './render345Level';
import RenderTag from './RenderTag';
import RenderMark from './renderMark';
import RenderSolve from './RenderSolve';
import { INIT_CURRENT_EVALUATION } from '../../constants/evaluation';

import { sendEvaluation } from '../../actions/chat';

import './index.less';

export default function Evaluation(props) {

  const Evaluation = useSelector(state => state.Evaluation);

  const { currentEvaluation, lastEvaluation, evaluationSetting } = Evaluation;
  const { tagList, name, value, remarks, evaluation_resolved, selectTagList } = currentEvaluation;

  const dispatch = useDispatch()


  const setParams = (params) => {
    dispatch({
      type: INIT_CURRENT_EVALUATION,
      value: params
    })
  }

  const handleSelect = (tagList, value, name) => {
    setParams({
      tagList,
      value,
      name
    })
  }

  const handleSelectTag = (tagList) => {
    setParams({
      tagList
    })
  }

  const handleInput = (event) => {
    setParams({
      remarks: event.detail.value
    })
  }

  const handleSelectSolve = (evaluation_resolved) => {
    setParams({
      evaluation_resolved
    })
  }

  const handleSubmit = () => {
    const params = { ...currentEvaluation };
    const { sessionid } = Evaluation;
    const { evaluation = value, evaluation_resolved,
      selectTagList = tagList, remarks } = params;
    dispatch(sendEvaluation({
      evaluation,
      evaluation_resolved,
      tagList,
      remarks,
      sessionid
    }));
  }

  return (
    <View className="m-evaluation">
      <View className="m-evaluation_icon">
        {
          evaluationSetting.type == 2 ?
            <Render2Level list={evaluationSetting.list} onSelect={handleSelect} selectValue={value} /> :
            <Render345Level list={evaluationSetting.list} onSelect={handleSelect} selectValue={value} />
        }
      </View>
      <View className="m-evaluation_icon_text">
        {name}
      </View>
      <RenderTag tagList={tagList} onSelect={handleSelectTag} selectTags={selectTagList} />
      <RenderMark onInput={handleInput} remarks={remarks} />
      <RenderSolve resolved={evaluation_resolved} onSelect={handleSelectSolve} />
      <View className="m-evaluation_submit">
        <Button className="u-submit" onClick={handleSubmit}>提交评价</Button>
      </View>
    </View>
  )
}

Evaluation.defaultProps = {
  evaluation: {}
}
