import Taro from '@tarojs/taro';
import { useSelector } from '@tarojs/redux';
import TextView from '../im-text/text';
import { View } from '@tarojs/components';
import { anctionHandle } from '../../../actions/actionHandle';

import './action.less';

export default function ActionView(props) {
  const item = props.item;
  const Setting = useSelector(state => state.Setting);

  const actionFun = (data) => {
    if(item.disabled)
      return;

    let {entryid} = data;

    if(entryid){
      let params = {
        entryid: data.entryid,
        stafftype: 1
      }
      if(data.type == 2){
        params.staffid = data.id
      }else{
        params.groupid = data.id
      }

      anctionHandle(item.action, params);
    }else{
      anctionHandle(item.action, data);
    }
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
            <View 
              className={`${item.disabled ? 'u-action-btn-disabled' : ''} ${item.colorful ? 'u-action-btn-colorful' : 'u-action-btn'}`}
              style={`${!item.disabled && item.colorful ? Setting.themeButton: ''}`}
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
                    <View className="u-dot" style={Setting.themeBg}></View>
                    <View className="u-label" style={Setting.themeText} onClick={(ev) => { actionFun({entryid: it.entryid, type: it.type, id: it.id}) }}>{it.label}</View>
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
