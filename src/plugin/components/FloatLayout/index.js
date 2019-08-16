import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Iconfont from '../Iconfont';
import PropTypes from 'prop-types'

import './index.less';

export default class FloatLayout extends Component {

    constructor(props) {
        super(props);

        if (props.defaultVisible === undefined) {
            this.state = {
                visible: false
            }
        } else {
            this.state = {
                visible: props.defaultVisible
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.defaultVisible === undefined && nextProps.visible != prevState.visible) {
            return {
                ...prevState,
                visible: nextProps.visible
            }
        } else {
            return {
                ...prevState
            }
        }
    }

    onClickMask = () => {
        const { onClickMask, maskClosable } = this.props;

        if (maskClosable) {
            this.setState({
                visible: false
            })
        }

        onClickMask && onClickMask();
    }

    onClose = () => {
        const { onClose } = this.props;

        this.setState({
            visible: false
        })

        onClose && onClose();
    }

    render() {
        const { title, contentHeight } = this.props;
        const { visible } = this.state;

        return (
            visible ?
                <View className="m-FloatLayout">
                    <View className="m-FloatLayout-mask" onClick={this.onClickMask}></View>
                    <View className="m-FloatLayout-layout">
                        <View className="layout-header">
                            {
                                title ?
                                    <View className="layout-title">
                                        <Text>{title}</Text>
                                        <View className="u-close" onClick={this.onClose}>
                                            <Iconfont type="icon-close" color="#666" size="36"></Iconfont>
                                        </View>
                                    </View> : null
                            }
                        </View>
                        <View className="layout-body">
                            <ScrollView className="layout-body_content" scrollY={true} style={{
                                height: contentHeight + 'px'
                            }}>
                                <View className="layout-body_content_scroll_body">
                                    {this.props.children}
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
                : null
        )
    }
}


FloatLayout.defaultProps = {
    title: '',
    visible: false,
    contentHeight: 500,
    maskClosable: false
}


FloatLayout.propType = {
    title: PropTypes.string,
    visible: PropTypes.bool,
    contentHeight: PropTypes.number,
    onClickMask: PropTypes.func,
    maskClosable: PropTypes.bool,
    onClose: PropTypes.func,
    defaultVisible: PropTypes.bool
}