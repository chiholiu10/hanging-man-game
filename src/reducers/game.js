import { types } from "../actions/index";

const initialState = {
    emptyArray: []
};

export const game = (state = initialState, action) => {
    switch(action.type) {
        case types.NEW_ARRAY: {
            console.log(action)
            return {
                ...state,
                emptyArray: action.getArray
            }
        }
        default: 
            return state;
    }
}

export default game;