import { TOGGLE_SHOWFUN, TOGGLE_SHOWPORTRAIT, HIDEACTION } from '../constants/options';

export const toggleShowFun = () => {
  return {
    type: TOGGLE_SHOWFUN
  }
}

export const toggleShowPortrait = () => {
  return {
    type: TOGGLE_SHOWPORTRAIT
  }
}

export const hideAction = () => {
  return {
    type: HIDEACTION
  }
}