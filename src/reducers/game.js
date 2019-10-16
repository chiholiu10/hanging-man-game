import { types } from "../actions/index";

const initialState = {
    emptyArray: [],
    filterArray: []
};

export const game = (state = initialState, action) => {
    switch(action.type) {
        case types.NEW_ARRAY: {
            return {
                ...state,
                filterArray: action.getFilterArray
            }
        }
        default: 
            return state;
    }
}

export default game;