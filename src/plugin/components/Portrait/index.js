/**
 * 表情组件
 */
import Taro from '@tarojs/taro';
import { View, Swiper, SwiperItem } from '@tarojs/components';

import './index.less';
import './emoji.less';
import emojiData from './data.json';

export default function Portrait(props) {
  const { row = 4, col = 7 } = props;
  const rowArray = [...Array(row).keys()];
  const colArray = [...Array(col).keys()];
  const pageLen = Math.ceil(emojiData.plist.length / (row * col));
  const pageArray = [...Array(pageLen).keys()];
  
  function handleClick (item) {
    props.onEmojiClick(item)
  }

  return (
    <View className='m-Portrait'>
      <Swiper className='m-Portrait__swiper' indicatorDots>
        {pageArray.map(pageIndex => {
          return (
            <SwiperItem key={pageIndex}>
              {rowArray.map(rowIndex => {
                return (
                  <View className='item__list' key={rowIndex}>
                    {colArray.map(colIndex => {
                      const itemIdx = pageIndex * row * col + rowIndex * col + colIndex;
                      const item = emojiData.plist[itemIdx];
                      return item ? (
                        <View className='item__icon' key={colIndex} style={`width: ${100/col}%`} onClick={() => handleClick(item)}>
                          <View className={`item__val portrait_img portrait_icon_${item.file.split('.')[0]}`} data-name={item.tag} />
                        </View>
                      ): null;
                    })}
                  </View>
                );
              })}
            </SwiperItem>
          );
        })}
      </Swiper>
    </View>
  );
}
