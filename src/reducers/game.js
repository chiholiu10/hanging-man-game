import { types } from "../actions/index";

const initialState = {
    emptyArray: []
};

export const game = (state = initialState, action) => {
    switch(action.type) {
        case types.NEW_ARRAY: {
            console.log('not true')
            return {
                ...state,
                emptyArray: 0
            }
        }
        default: 
            return state;
    }
}

export default game;