import { types } from "../actions/index";

const initialState = {
    currentArray: [],
    currentword: [],
    filteredArray: [],
    updatedCurrentScore: 0
};

export const game = (state = initialState, action) => {
    switch(action.type) {
        case types.NEW_ARRAY: {
            console.log('NEW_ARRAY');
            return {
                ...state,
                currentArray: [...state.currentArray, action.unfilteredArray]            
            }
        }

        case types.GET_WORD: {
            console.log('GET_WORD');
            return {
                ...state,
                currentWord: action.word
            }
        }

        case types.FILTERED_ARRAY: {
            console.log('FILTERED_ARRAY');
            const allLetters = state.currentArray;
            const randomWord = state.currentWord || [];

            return {
                ...state,
                filteredArray: Array.from(new Set(allLetters.filter(el => randomWord.indexOf(el) === -1))),
                filteredArrayLength: state.filteredArray.length
            }
        }

        case types.CLEAR_ARRAY: {
            console.log('CLEAR_ARRAY');
            return {
                ...state,
                currentArray: []
            }
        }

        case types.SCORE_COUNTER: {
            console.log('SCORE_COUNTER');
            return {
                ...state,
                updatedCurrentScore: state.updatedCurrentScore + action.getScore
            }
        }

        default: 
            return state;
    }
}

export default game;