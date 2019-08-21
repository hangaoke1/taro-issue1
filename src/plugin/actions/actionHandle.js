import {get} from '../global_config'
import {SET_EVALUATION_VISIBLE} from '../constants/chat';

export const anctionHandle = (type) => {
    const dispatch = get('store').dispatch;

    switch(type){
        case 'evaluation':
            dispatch(setEvaluationVisible(true));    
        break;
    }
}

const setEvaluationVisible = value => {
    return{
        type: SET_EVALUATION_VISIBLE,
        value
    }
}

export const closeEvaluationModal = () => dispatch => {
    dispatch(setEvaluationVisible(false));
}