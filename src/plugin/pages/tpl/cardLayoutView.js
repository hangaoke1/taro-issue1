import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';
import CardLayoutListLoad from '@/components/Bot/m-card-layout-list-load';

import './cardLayoutView.less';

@connect(
  ({ Message }) => ({
    Message
  }),
  dispatch => ({})
)
class cardLayoutView extends Component {

  state = {
    item: null
  };

  componentWillMount() {
    const uuid = this.$router.params.uuid;
    const item = this.props.Message.filter(message => message.uuid === uuid)[0];
    this.setState({ item });
    Taro.setNavigationBarTitle({
      title: _get(item, 'content.template.detail.label')
    });
  }

  componentDidMount() {}

  handleCardClick = () => {}

  render() {
    const { item } = this.state;
    const tpl = _get(item, 'content.template');
    return (
      <View className="m-card-layout-view">
        <CardLayoutListLoad
          item={item}
          tpl={tpl}
          onItemClick={this.handleCardClick.bind(this)}
        ></CardLayoutListLoad>
      </View>
    );
  }
}

export default cardLayoutView;
