import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import Iconfont from '../Iconfont';

import './index.less';

export default function Render2Level(props) {

  const { list, selectValue } = props;

  const handleClick = (tagList, value, name) => {
    props.onSelect(tagList, value, name);
  }

  return (
    <View className="m-evaluation_icon_2level">
      {
        list.map((item) => {
          return (
            <View className="m-evaluation_icon_content">
              {
                item.value == 100 ?
                  <View className="u-evaluation-icon"
                    onClick={handleClick.bind(undefined, item.tagList, item.value, item.name)}>
                    <Iconfont type="icon-zan-offx" color={selectValue == 100 ? "#FFAF0F" : "#666"} size='26' />
                  </View> : null
              }
              {
                item.value == 1 ?
                  <View className="u-evaluation-icon" onClick={handleClick.bind(undefined, item.tagList, item.value, item.name)}>
                    <Iconfont type="icon-unzan-offx" color={selectValue == 1 ? "#FFAF0F" : "#666"} size='26' />
                  </View> : null
              }
            </View>
          )
        })
      }
    </View>
  )

}

Render2Level.defaultProps = {
  list: []
}
