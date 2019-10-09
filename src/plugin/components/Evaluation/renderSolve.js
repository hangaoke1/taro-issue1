import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.less';

export default function RenderSolve(props) {
  const { resolved } = props;

  const handleClick = (value) => {
    props.onSelect(value);
  }

  return (
    <View className="m-evaluation_slove">
      <View className="m-evaluation_slove_label">
        您的问题
            </View>
      <View className="m-evaluation_slove_btn">
        <View className={resolved === 1 ? "m-evaluation_slove_btn_stu z-sel" : "m-evaluation_slove_btn_stu"} onClick={handleClick.bind(undefined, 1)}>已解决</View>
        <View className={resolved === 2 ? "m-evaluation_slove_btn_stu z-sel" : "m-evaluation_slove_btn_stu"} onClick={handleClick.bind(undefined, 2)}>未解决</View>
      </View>
    </View>
  )
}
