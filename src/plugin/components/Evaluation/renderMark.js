import Taro, { useState } from '@tarojs/taro';
import { View, Textarea } from '@tarojs/components';
import { ParserRichText } from '../ParserRichText/parserRichText';
import eventbus from '../../lib/eventbus';

import './index.less';

export default function RenderMark(props) {
  const { remarks } = props;

  const [isEdit, setIsEdit] = useState(false);
  const [isFocus, setIsFocus] = useState();

  const onFocus = (event) => {
    console.log('event', event);
  }

  const handleInput = (event) => {
    props.onInput(event);
  }

  const onFocusView = () => {
    setIsEdit(true);
    setTimeout(() => {
      setIsFocus(true);
      eventbus.trigger('float_layout_scroll_bottom');
    },100)
  }

  const onBlur = () => {
    setIsFocus(false);
    setIsEdit(false);
  }

  return (
    <View className="m-evaluation_mark">
      {
        isEdit ?
          <Textarea placeholder="请输入您要反馈的意见"
            maxlength={200} className="u-mark"
            placeholderStyle={"color:#999;"}
            value={remarks}
            placeholderClass="u-mark-placeholder"
            onFocus={onFocus}
            onBlur={onBlur}
            autoFocus
            focus={isFocus}
            showConfirmBar={false}
            cursorSpacing={80}
            onInput={handleInput}>
          </Textarea> :
          <View
            className={remarks ? 'u-mark u-mark-view' : 'u-mark u-mark-view u-mark-placeholder'}
            onTap={onFocusView}>
              <View className="u-mark-view-inner">
                <ParserRichText
                  html={remarks ? remarks : '请输入您要反馈的意见'}
                  isRich
                ></ParserRichText>
              </View>
          </View>
      }
      <View className="m-evaluation_mark_counter">
        {remarks.length}/200
      </View>
    </View>
  )
}
