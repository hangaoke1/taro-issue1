import Taro from '@tarojs/taro';
import { View, Text,Image } from '@tarojs/components';
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
                      {
                        selectValue == 100 ?
                        <Iconfont type="icon-zan-offx" color={selectValue == 100 ? "#FFAF0F" : "#666"} size='26' />
                        :
                        <Image className="image" src='http://nos.netease.com/ysf/24ec7f276b8bb1d96c423aab742ccbe4'></Image>
                      }
                  </View> : null
              }
              {
                item.value == 1 ?
                  <View className="u-evaluation-icon" onClick={handleClick.bind(undefined, item.tagList, item.value, item.name)}>
                    {
                      selectValue == 1 ?
                      <Iconfont type="icon-unzan-offx" color={selectValue == 1 ? "#FFAF0F" : "#666"} size='26' />
                      :
                      <Image className="image" src='http://nos.netease.com/ysf/124e96661fe2a17ad7998fb700dc9aa0'></Image>
                    }
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
