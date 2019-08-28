import Taro from '@tarojs/taro';
import { View, Textarea } from '@tarojs/components';

import './index.less';

export default function RenderMark(props) {
  const { remarks } = props;

  const onFocus = (event) => {
    console.log('event', event);
  }

  const handleInput = (event) => {
    props.onInput(event);
  }

  return (
    <View className="m-evaluation_mark">
      <Textarea placeholder="请输入您要反馈的意见"
        maxlength={200} className="u-mark"
        placeholderStyle={"color:#999;"}
        value={remarks}
        placeholderClass="u-mark-placeholder"
        onFocus={onFocus}
        cursorSpacing={175}
        showConfirmBar={false}
        onInput={handleInput}>
      </Textarea>
    </View>
  )
}
