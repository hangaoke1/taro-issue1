import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import PropTypes from "prop-types";
import Iconfont from "../Iconfont";
import eventbus from "../../lib/eventbus";

import "./index.less";

export default class FloatLayout extends Component {
  constructor(props) {
    super(props);

    if (props.defaultVisible === undefined) {
      this.state = {
        visible: false,
        scrollTop: 0
      };
    } else {
      this.state = {
        visible: props.defaultVisible
      };
    }
  }

  componentDidMount() {
    eventbus.on("float_layout_scroll_bottom", () => {
      console.log("滚动条");
      this.setState({
        scrollTop: 1000
      });
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.defaultVisible === undefined &&
      nextProps.visible != prevState.visible
    ) {
      return {
        ...prevState,
        visible: nextProps.visible
      };
    } else {
      return {
        ...prevState
      };
    }
  }

  onClickMask = () => {
    const { onClickMask, maskClosable } = this.props;

    if (maskClosable) {
      this.onClose();
    }

    onClickMask && onClickMask();
  };

  handleScroll = event => {
    if (this.props.nativeScroll) {
      return;
    }
    let { scrollTop } = event.detail;
    this.setState({
      scrollTop
    });
  };

  onClose = () => {
    const { onClose } = this.props;

    this.setState({
      visible: false
    });

    onClose && onClose();
  };

  onTitleClick = () => {
    const { onTitleClick } = this.props;
    onTitleClick && onTitleClick()
  }

  preventTouchMove = e => {
    e.stopPropagation();
    return;
  };

  render() {
    const {
      title,
      contentHeight,
      bodyPadding,
      nativeScroll,
      position,
      mask,
      showBack
    } = this.props;
    const { visible, scrollTop } = this.state;
    return (
      <View
        className={`m-FloatLayout ${visible ? "m-FloatLayout--active" : ""}`}
      >
        {mask && (
          <View
            className="m-FloatLayout-mask"
            onClick={this.onClickMask}
            onTouchMove={this.preventTouchMove}
          ></View>
        )}
        <View className={`m-FloatLayout-layout ani-${position}`}>
          <View className="layout-header">
            <View className="layout-title">
              <View className="u-title" onClick={this.onTitleClick}>
                {showBack && <Iconfont type="icon-arrowleft" color="#666" size="24"></Iconfont>}
                <Text>{title}</Text>
              </View>
              <View className="u-close" onClick={this.onClose}>
                <Iconfont type="icon-close" color="#666" size="36"></Iconfont>
              </View>
            </View>
          </View>
          <View className="layout-body">
            <ScrollView
              className="layout-body_content"
              scrollY
              scroll-anchoring
              scrollTop={nativeScroll ? scrollTop : undefined}
              style={{
                maxHeight: contentHeight ? contentHeight + "px" : "60vh"
              }}
              onScroll={this.handleScroll}
            >
              <View
                className="layout-body_content_scroll_body"
                style={{ padding: bodyPadding + "px" }}
              >
                {this.props.children}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

FloatLayout.defaultProps = {
  title: "",
  visible: false,
  maskClosable: false,
  bodyPadding: 32,
  nativeScroll: true,
  position: "bottom",
  mask: true,
  showBack: false
};

FloatLayout.propType = {
  position: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  visible: PropTypes.bool,
  contentHeight: PropTypes.number,
  onClickMask: PropTypes.func,
  maskClosable: PropTypes.bool,
  onClose: PropTypes.func,
  defaultVisible: PropTypes.bool,
  bodyPadding: PropTypes.number,
  nativeScroll: PropTypes.bool,
  mask: PropTypes.bool,
  showBack: PropTypes.bool,
  onTitleClick: PropTypes.func
};
