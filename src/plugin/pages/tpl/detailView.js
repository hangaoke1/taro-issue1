import Taro, { Component } from '@tarojs/taro';
import { View, Block, Image } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import _get from 'lodash/get';
import { genClassAndStyle } from '@/utils';

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
        <View className="u-list">
          {tpl.detail.list.map(rows => {
            return (
              <View className="u-list-item-wrap" key={JSON.stringify(rows)}>
                {rows.map((rowMap) => {
                  const keys = Object.keys(rowMap);
                  return (
                    <View key={JSON.stringify(rowMap)}>
                      {keys.map(key => {
                        const len = 2;
                        const row = rowMap[key];
                        const { style, customerClass } = genClassAndStyle(
                          row,
                          len
                        );
                        const type = row.type;
                        return (
                          <View
                            className={`u-list-item${customerClass}`}
                            style={style}
                            key={row.value}
                          >
                            {type === 'image' ? (
                              <Image
                                className="u-image"
                                style="width: 32px;"
                                mode="widthFix"
                                src={row.value}
                              ></Image>
                            ) : (
                              <Text className="u-text">{row.value}</Text>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    ) : null;
  }
}

export default DetailView;
