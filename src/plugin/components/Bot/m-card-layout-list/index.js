import Taro, { Component } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import PropTypes from 'prop-types';
import { genClassAndStyle } from '@/utils';
import GImg from '@/components/GImg';
import './index.less';

class CardLayoutList extends Component {
  static propTypes = {
    list: PropTypes.array,
    onItemClick: PropTypes.func
  };

  componentWillMount() {}

  componentDidMount() {}

  handleClick = (action) => {
    this.props.onItemClick && this.props.onItemClick(action)
  }

  render() {
    const { list } = this.props;
    return list ? (
      <View className="u-list">
        {list.map(subItem => {
          return (
            <View className="u-sub-list" key={JSON.stringify(subItem.action)} onClick={this.handleClick.bind(this, subItem.action)}>
              {subItem.list.map(rows => {
                return (
                  <View className="u-list-item-wrap" key={JSON.stringify(rows)}>
                    {rows.map(row => {
                      const len = rows.length;
                      const { style, customerClass } = genClassAndStyle(
                        row,
                        len
                      );
                      return (
                        <View
                          key={row.value}
                          className={`u-list-item${customerClass}`}
                          style={style}
                        >
                          {row.type === 'image' ? (
                            <GImg
                              className="u-image"
                              maxWidth={16}
                              src={row.value}
                            ></GImg>
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

export default CardLayoutList;
