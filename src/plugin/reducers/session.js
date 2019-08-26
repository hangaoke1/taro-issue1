import {INIT_SESSION} from '../constants/session';

const initSession = {};

const Session = (state = initSession, action) => {
    switch(action.type){
        case INIT_SESSION:
            if(action.session.evaluation){
                let evaluation = JSON.parse(action.session.evaluation);
                if(evaluation.type != 2){
                    evaluation.list.sort((a,b) => {
                        return  a.value - b.value;
                    })
                }

                action.session.evaluation = evaluation;
            }
            return {...state, ...action.session};
        default:
            return state;
    }
}

export default Session;
