import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';
import Back from "@/components/Back";

import MDetailViewList from '@/components/Bot/m-detail-view-list';
import './detailView.less';

@connect(
  ({ Message }) => ({
    Message
  }),
  dispatch => ({})
)
class DetailView extends Component {
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

  render() {
    const { item } = this.state;
    const tpl = _get(item, 'content.template');
    return item ? (
      <View className="m-detail">
        <Back />
        <MDetailViewList list={tpl.detail.list}></MDetailViewList>
      </View>
    ) : null;
  }
}

export default DetailView;
