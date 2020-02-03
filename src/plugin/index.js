import Taro from '@tarojs/taro'

class DataFormatError extends Error{
  constructor(info){
    super(`${info} Data format parsing error`);
    this.name = 'DataFormatError'
  }
}
