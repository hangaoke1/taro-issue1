import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import PropTypes from "prop-types";

import "./index.less";

class GRadio extends Component {
  componentWillMount() {}

  componentDidMount() {}

  render() {
    const prefixCls = "ehome-index";

    return <View className={prefixCls}></View>;
  }
}

GRadio.defaultProps = {};

GRadio.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  value: PropTypes.string,
  options: PropTypes.array,
  onClick: PropTypes.func
};

export default GRadio;
