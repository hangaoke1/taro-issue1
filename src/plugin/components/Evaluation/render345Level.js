import Taro from '@tarojs/taro';
import { View,Image } from '@tarojs/components';
import Iconfont from '../Iconfont';

import './index.less';

export default function Render345Level(props) {
  const { list, selectValue } = props;

  const handleClick = (tagList, value, name) => {
    props.onSelect(tagList, value, name);
  }

  return (
    <View className="m-evaluation_icon_345level">
      {
        list.map(item => {
          return (
            <View className="m-evaluation_icon_content" key={item.value}>
              <View className="u-evaluation-icon" onClick={handleClick.bind(undefined, item.tagList, item.value, item.name)}>
                {
                  item.value <= selectValue ?
                  <Iconfont type="icon-star-offx"
                  color={item.value <= selectValue ? "#FFAF0F" : "#666"} size='26' />
                  :
                  <Image className="image" src='http://nos.netease.com/ysf/d5535ee55b17e1e70c70f2881f85b087'></Image>
                }
              </View>
            </View>
          )
        })
      }
    </View>
  )
}

Render345Level.defaultProps = {
  list: []
}
