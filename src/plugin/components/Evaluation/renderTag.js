import Taro, { onGetWifiList } from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.less';

export default function RenderTag(props) {
  const { tagList, selectTags } = props;

  const tags = selectTags;
  const handleClick = (item) => {
    if (tags.indexOf(item) != -1) {
      tags.splice(tags.indexOf(item), 1);
    } else {
      tags.push(item);
    }
    props.onSelect(tags);
  }

  return (
    <View className="m-evaluation_tags">
      {
        tagList.map(item => {
          return (
            <View className={selectTags.indexOf(item) == -1 ? "m-evaluation_tags_item" : "m-evaluation_tags_item z-sel"}
              onClick={handleClick.bind(undefined, item)} key={item}>
              {item}
            </View>
          )
        })
      }
    </View>
  )
}

RenderTag.defaultProps = {
  tagList: [],
  selectTags: []
}
