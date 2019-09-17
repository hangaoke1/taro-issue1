import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import _get from 'lodash/get';
import PropTpyes from 'prop-types';
import { genClassAndStyle } from '@/utils';

import './index.less';

class DetailViewList extends Component {
  static propTypes = {
    list: PropTpyes.array
  };

  componentDidMount() {}

  render() {
    const { list } = this.props;
    return list ? (
      <View className="u-list">
        {list.map(rows => {
          return (
            <View className="u-list-item-wrap" key={JSON.stringify(rows)}>
              {rows.map(rowMap => {
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
    ) : null;
  }
}

export default DetailViewList;
