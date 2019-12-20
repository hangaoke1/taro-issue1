import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Iconfont from '@/components/Iconfont';
import { get } from '../../global_config'

import "./index.less";

class Back extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusBarHeight: wx.getSystemInfoSync()["statusBarHeight"]
    };
  }

  componentWillMount() {}

  componentDidMount() {}

  handleBack = () => {
    Taro.navigateBack();
  };

  render() {
    const isFullScreen = get("fullScreen");
    const { statusBarHeight } = this.state

    return isFullScreen ? (
      <View
        onClick={this.handleBack}
        className="u-back"
        style={{ top: statusBarHeight + 6 + "px" }}
      >
        <Iconfont type="icon-arrowleft" color="#000" size="20"></Iconfont>
      </View>
    ) : null;
  }
}

export default Back;
