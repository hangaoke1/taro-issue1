import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'

import './index.less';

export default class FloatLayout extends Component {

    constructor(props) {
        super(props);
    }

    render () {
        
        return (
            <View className="m-FloatLayout">

            </View>
        )
    }
}


FloatLayout.defaultProps = {
    title: '',
    visible: false
}

FloatLayout.propType = {
    title: PropTypes.string,
    visible: PropTypes.bool
}