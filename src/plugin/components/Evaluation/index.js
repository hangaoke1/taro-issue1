import Taro, { useState,useEffect } from '@tarojs/taro';
import { useSelector } from '@tarojs/redux';
import { View,Button } from '@tarojs/components';
import Render2Level from './render2Level';
import Render345Level from './render345Level';
import RenderTag from './RenderTag';
import RenderMark from './renderMark';
import RenderSolve from './RenderSolve';

import './index.less';


export default function Evaluation(props) {

    const session = useSelector(state => state.Session);

    let evaluation = null;

    let initTagList = [],initValue = 100,initName = '非常满意';
    if (session.evaluation) {
        evaluation = JSON.parse(session.evaluation);

        if(evaluation && evaluation.list){
            evaluation.list.forEach(item => {
                if(item.value == 100){
                    item.tagList && (initTagList = item.tagList);
                    item.name && (initName = item.name);
                }
            })
        }
    }

    const [tagList, setTagList] = useState(initTagList);
    const [selectValue, setSelectValue] = useState(initValue);
    const [selectName, setSelectName] = useState(initName);
    const [selectTags, setSelectTags] = useState([]);
    const [remarks, setRemarks] = useState("");
    const [resolved, setResolved] = useState(null);



    const handleSelect = (tagList, selectValue, selectName) => {
        setTagList(tagList);
        setSelectValue(selectValue);
        setSelectName(selectName);
    }

    const handleSelectTag = (value) => {
        setSelectTags(value);
    }

    const handleInput = (event) => {
        setRemarks(event.value);
    }

    const handleSelectSolve = (value) => {
        setResolved(value);
    }

    return (
        evaluation ?
            <View className="m-evaluation">
                <View className="m-evaluation_icon">
                    {
                        evaluation.type == 2 ?
                            <Render2Level list={evaluation.list} onSelect={handleSelect} selectValue={selectValue}/> : 
                            <Render345Level list={evaluation.list} />
                    }
                </View>
                <View className="m-evaluation_icon_text">
                    {selectName}
                </View>
                <RenderTag tagList={tagList} onSelect={handleSelectTag} selectTags={selectTags}/>
                <RenderMark onInput={handleInput} remarks={remarks} />
                <RenderSolve resolved={resolved} onSelect={handleSelectSolve} />
                <View className="m-evaluation_submit">
                    <Button className="u-submit">提交评价</Button>
                </View>
            </View>
            : null
    )
}