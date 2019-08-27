import Taro from '@tarojs/taro';
import TextView from '../im-text/text';
import { View } from '@tarojs/components';
import { anctionHandle } from '../../../actions/actionHandle';

import './action.less';

export default function ActionView(props) {
  const item = props.item;

  const actionFun = (data) => {
    anctionHandle(item.action, data);
  }

  const richProps = {
    ...item,
    type: 'rich'
  }

  return (
    <TextView item={richProps} actionFun={actionFun}>
      {
        item.type == 'action' ?
          (<View className='m-action'>
            <View className={item.disabled ? 'u-action-btn u-action-btn-disabled' : 'u-action-btn'}
              onClick={(ev) => { actionFun({sessionid: item.sessionid}) }}>{item.actionText}
            </View>
          </View>) : null
      }

      {
        item.type == 'entries' ?
          (<View className="m-entries">
            {
              item.entries.map(it => {
                return (
                  <View className="u-entry">
                    <View className="u-dot"></View>
                    <View className="u-label" onClick={(ev) => { actionFun({entryid: it.entryid}) }}>{it.label}</View>
                  </View>
                )
              })
            }
          </View>) : null
      }
    </TextView>
  )
}

ActionView.defaultProps = {
  item: {}
}
