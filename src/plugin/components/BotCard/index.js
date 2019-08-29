import Taro, { Component } from '@tarojs/taro'
import eventbus from '@/lib/eventbus'
import WeModal from '@/components/Modal'
import MCard from '@/components/Bot/m-card'

import './index.less'

export default class BotCard extends Component {
  state = {
    isOpened: false,
    item: null
  }

  componentWillMount () { }

  componentDidMount () {
    eventbus.on('bot_show_card', (item) => {
      this.setState({
        isOpened: true,
        item
      })
    })
  }

  handleClose = () => {
    this.setState({
      isOpened: false,
    })
  }

  handleConfirm = () => {
    this.handleClose()
  }

  handleCancel = () => {
    this.handleClose()
  }

  render () {
    const { isOpened, item } = this.state

    return (
      <WeModal className='bot-card' isOpened={isOpened} onClose={this.handleClose} onConfirm={this.handleConfirm} onCancel={this.handleCancel} title='确认要发送吗？' cancelText='取消' confirmText='确认' closeOnClickOverlay>
        <MCard item={item} disabled={true}></MCard>
      </WeModal>
    )
  }
}