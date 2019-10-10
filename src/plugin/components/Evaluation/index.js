import Taro, { useState, useEffect } from '@tarojs/taro';
import { useSelector, useDispatch } from '@tarojs/redux';
import { View, Button } from '@tarojs/components';
import Render2Level from './render2Level';
import Render345Level from './render345Level';
import RenderTag from './RenderTag';
import RenderMark from './renderMark';
import RenderSolve from './RenderSolve';
import { INIT_CURRENT_EVALUATION } from '../../constants/evaluation';
import eventbus from '../../lib/eventbus';

import { sendEvaluation } from '../../actions/chat';

import './index.less';

export default function Evaluation(props) {

  const Evaluation = useSelector(state => state.Evaluation);

  const { currentEvaluation, evaluationSetting } = Evaluation;
  const { tagList, name, value, remarks, evaluation_resolved, selectTagList } = currentEvaluation;
  const { resolvedEnabled, resolvedRequired, list } = evaluationSetting;

  const dispatch = useDispatch();

  useEffect(() => {
    eventbus.on('reset_evaluation', () => {
      setParams({
        remarks: '',
        evaluation_resolved: 0,
        selectTagList: []
      })
    })
    return () => {
      eventbus.off('reset_evaluation');
    };
  }, []);

  const setParams = (params) => {
    dispatch({
      type: INIT_CURRENT_EVALUATION,
      value: params
    })
  }

  const handleSelect = (tagList, value, name) => {
    let extral = {}
    if (value != currentEvaluation.value) {
      extral = {
        selectTagList: [],
        remarks: "",
        evaluation_resolved: 0
      }
    }
    setParams({
      tagList,
      value,
      name,
      ...extral
    })
  }

  const handleSelectTag = (selectTagList) => {
    setParams({
      selectTagList
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
      selectTagList, remarks } = params;

    const { tagRequired, commentRequired } = list.filter(item => {
      return item.value == evaluation;
    })[0]

    // 验证标签未填
    if (tagRequired && !selectTagList.length) {
      Taro.showToast({
        title: '请选择标签',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    // 验证备注未填
    if (commentRequired && !remarks) {
      Taro.showToast({
        title: '请填写评价备注',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    // 验证解决问题是否必填
    if (resolvedEnabled && resolvedRequired && evaluation_resolved === 0) {
      Taro.showToast({
        title: '请选择本次问题是否解决',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    dispatch(sendEvaluation({
      evaluation,
      evaluation_resolved,
      tagList: selectTagList,
      remarks,
      sessionid
    }));
  }

  return (
    <View className="m-evaluation">
      <View className="m-evaluation_icon">
        {
          evaluationSetting.type == 2 ?
            <Render2Level list={list} onSelect={handleSelect} selectValue={value} /> :
            <Render345Level list={list} onSelect={handleSelect} selectValue={value} />
        }
      </View>
      <View className="m-evaluation_icon_text">
        {name}
      </View>
      <RenderTag tagList={tagList} onSelect={handleSelectTag} selectTags={selectTagList} />
      <RenderMark onInput={handleInput} remarks={remarks} />
      {
        resolvedEnabled ?
          <RenderSolve resolved={evaluation_resolved} onSelect={handleSelectSolve} />
          : null
      }
      <View className="m-evaluation_submit">
        <Button className="u-submit" onClick={handleSubmit}>提交评价</Button>
      </View>
    </View>
  )
}

Evaluation.defaultProps = {
  evaluation: {}
}
