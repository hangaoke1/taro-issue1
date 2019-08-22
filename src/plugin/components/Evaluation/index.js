import Taro, { useState,useEffect } from '@tarojs/taro';
import { useSelector,useDispatch } from '@tarojs/redux';
import { View,Button } from '@tarojs/components';
import Render2Level from './render2Level';
import Render345Level from './render345Level';
import RenderTag from './RenderTag';
import RenderMark from './renderMark';
import RenderSolve from './RenderSolve';

import {sendEvaluation} from '../../actions/chat';

import './index.less';

const submitParam = {
    evaluation: 100
};

export default function Evaluation(props) {

    const session = useSelector(state => state.Session);
    const evaluation = session.evaluation;
    submitParam.sessionid = session.sessionid;

    let initTagList = [],initValue = 100,initName = '非常满意';

    if(evaluation && evaluation.list){
        evaluation.list.forEach(item => {
            if(item.value == 100){
                item.tagList && (initTagList = item.tagList);
                item.name && (initName = item.name);
            }
        })
    }
    

    const [tagList, setTagList] = useState(initTagList);
    const [selectValue, setSelectValue] = useState(initValue);
    const [selectName, setSelectName] = useState(initName);
    const [selectTags, setSelectTags] = useState([]);
    const [remarks, setRemarks] = useState("");
    const [resolved, setResolved] = useState(null);

    const dispatch = useDispatch()



    const handleSelect = (tagList, selectValue, selectName) => {
        setTagList(tagList);
        setSelectValue(selectValue);
        setSelectName(selectName);
        submitParam.evaluation = selectValue;
    }

    const handleSelectTag = (value) => {
        setSelectTags(value);
        submitParam.tagList = JSON.stringify(value);
    }

    const handleInput = (event) => {
        setRemarks(event.detail.value);
        submitParam.remarks = event.detail.value;
    }

    const handleSelectSolve = (value) => {
        setResolved(value);
        submitParam.evaluation_resolved = value;
    }

    const handleSubmit = () => {
        dispatch(sendEvaluation(submitParam));
    }

    return (
        evaluation ?
            <View className="m-evaluation">
                <View className="m-evaluation_icon">
                    {
                        evaluation.type == 2 ?
                            <Render2Level list={evaluation.list} onSelect={handleSelect} selectValue={selectValue}/> : 
                            <Render345Level list={evaluation.list} onSelect={handleSelect} selectValue={selectValue}/>
                    }
                </View>
                <View className="m-evaluation_icon_text">
                    {selectName}
                </View>
                <RenderTag tagList={tagList} onSelect={handleSelectTag} selectTags={selectTags}/>
                <RenderMark onInput={handleInput} remarks={remarks} />
                <RenderSolve resolved={resolved} onSelect={handleSelectSolve} />
                <View className="m-evaluation_submit">
                    <Button className="u-submit" onClick={handleSubmit}>提交评价</Button>
                </View>
            </View>
            : null
    )
}