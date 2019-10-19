import { types } from "../actions/index";

const initialState = {
    currentArray: [],
    currentword: [],
    filteredArray: []
};

export const game = (state = initialState, action) => {
    switch(action.type) {
        case types.NEW_ARRAY: {
            console.log('NEWARRAY ' + state.currentArray);
            return {
                ...state,
                currentArray: [...state.currentArray, action.unfilteredArray]            }
        }

        case types.GET_WORD: {
            console.log(action.word);
            return {
                ...state,
                currentWord: action.word
            }
        }

        case types.FILTERED_ARRAY: {
            const allLetters = state.currentArray;
            const randomWord = state.currentWord;
            console.log('FILTEREDARRAY ' + state.currentArray + 'word ' + state.currentWord);
            return {
                ...state,
                filteredArray: allLetters.filter(el => randomWord.indexOf(el) === -1)
            }
        }

        case types.CLEAR_ARRAY: {
            console.log('clear Array');
            return {
                ...state,
                currentArray: []
            }
        }

        default: 
            return state;
    }
}

export default game;