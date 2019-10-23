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
            return {
                ...state,
                currentArray: [...state.currentArray, action.unfilteredArray]            
            }
        }

        case types.GET_WORD: {
            return {
                ...state,
                currentWord: action.word
            }
        }

        case types.FILTERED_ARRAY: {
            const allLetters = state.currentArray;
            const randomWord = state.currentWord;
            // console.log('FILTEREDARRAY ' + state.filteredArray + 'word ' + randomWord); 
            return {
                ...state,
                filteredArray: Array.from(new Set(allLetters.filter(el => randomWord.indexOf(el) === -1))),
                filteredArrayLength: state.filteredArray.length
            }
        }

        case types.CLEAR_ARRAY: {
            return {
                ...state,
                currentArray: []
            }
        }

        case types.SCORE_COUNTER: {
            console.log(action.getScore);
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