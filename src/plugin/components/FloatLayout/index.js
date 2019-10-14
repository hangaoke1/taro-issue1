import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import PropTypes from 'prop-types';
import Iconfont from '../Iconfont';
import eventbus from '../../lib/eventbus';

import './index.less';

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

  componentDidMount(){
    eventbus.on('float_layout_scroll_bottom', () => {
      console.log('滚动条')
      this.setState({
        scrollTop: 1000
      })
    })
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
      // this.setState({
      //     visible: false
      // })
      this.onClose();
    }

    onClickMask && onClickMask();
  };

  handleScroll = (event) => {
    let {scrollTop} = event.detail;
    this.setState({
      scrollTop
    })
  }

  onClose = () => {
    const { onClose } = this.props;

    this.setState({
      visible: false
    });

    onClose && onClose();
  };

  preventTouchMove = e => {
    e.stopPropagation();
    return;
  };

  render() {
    const {
      title,
      contentHeight,
      bodyPadding
    } = this.props;
    const { visible,scrollTop } = this.state;

    return (
      <View
        className={`m-FloatLayout ${visible ? 'm-FloatLayout--active' : ''}`}
      >
        <View
          className="m-FloatLayout-mask"
          onClick={this.onClickMask}
          onTouchMove={this.preventTouchMove}
        ></View>
        <View className="m-FloatLayout-layout">
          <View className="layout-header">
            {/* {title ? (
              <View className="layout-title">
                <Text>{title}</Text>
                <View className="u-close" onClick={this.onClose}>
                  <Iconfont type="icon-close" color="#666" size="36"></Iconfont>
                </View>
              </View>
            ) : null} */}
            <View className="layout-title">
              <Text>{title}</Text>
              <View className="u-close" onClick={this.onClose}>
                <Iconfont type="icon-close" color="#666" size="36"></Iconfont>
              </View>
            </View>
          </View>
          <View className="layout-body">
            <ScrollView
              className="layout-body_content"
              scrollY
              scrollTop = {scrollTop}
              style={{
                maxHeight: contentHeight ? contentHeight + 'px' : '60vh'
              }}
              onScroll={this.handleScroll}
            >
              <View
                className="layout-body_content_scroll_body"
                style={{ padding: bodyPadding + 'px' }}
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
  title: '',
  visible: false,
  maskClosable: false,
  bodyPadding: 32
};

FloatLayout.propType = {
  title: PropTypes.string,
  visible: PropTypes.bool,
  contentHeight: PropTypes.number,
  onClickMask: PropTypes.func,
  maskClosable: PropTypes.bool,
  onClose: PropTypes.func,
  defaultVisible: PropTypes.bool,
  bodyPadding: PropTypes.number
};
