import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import _get from "lodash/get";
import "./index.less";

export default function MGroup(props) {
  const item = _get(props, "item", {});

  return (
    <View className="m-group">
      <View className="u-left">
        {item.p_img ? <Image className="u-img" src={item.p_img}></Image> : null}
        <View className="u-title">{item.p_title}</View>
      </View>
      {item.p_sub_title && (
        <View className="u-right">
          <Text className="u-subTitle">{item.p_sub_title}</Text>
        </View>
      )}
    </View>
  );
}
