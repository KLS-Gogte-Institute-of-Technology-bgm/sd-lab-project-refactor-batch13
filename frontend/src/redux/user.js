import * as ActionTypes from './ActionTypes';

export const Users= (state = {
        errMess: null,
        users:[]
    }, action) => {
    switch (action.type) {
        case ActionTypes.ADD_USERS:
            var user = action.payload;
            return {...state, users: state.users.concat(user)}

        case ActionTypes.SIGNUP_FAILURE:
            return { ...state, errMess: action.payload, users: [] };
         case ActionTypes.SIGNUP_SUCCESS:
            return {...state,  errMess: action.payload, users:[]};

        default:
            return state;
    }
}