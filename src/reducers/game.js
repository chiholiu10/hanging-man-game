import { types } from "../actions/index";

const initialState = {
    currentArray: [],
    currentword: [],
    filteredArray: [],
    filteredArrayLength: 0,
    updatedCurrentScore: 0,
    sortedAllHighScores: [],
    unsortedAllHighScores: [],
    counter: 0,
    counterStep: 1
};

export const game = (state = initialState, action) => {
    switch(action.type) {
        case types.NEW_ARRAY: {
            return {
                ...state,
                currentArray: [...state.currentArray, action.unfilteredArray],
                filteredArray: []            
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
            const randomWord = state.currentWord || [];

            if(state.filteredArray.length < 5) {
                return {
                    ...state,
                    filteredArray: Array.from(new Set(allLetters.filter(el => randomWord.indexOf(el) === -1)))
                }
            } else {
                return state
            }
        }

        case types.CLEAR_ARRAY: {
            return {
                ...state,
                currentArray: [],
                filteredArray: [],
                updatedCurrentScore: Math.floor(state.updatedCurrentScore / 5)
            }
        }

        case types.SCORE_COUNTER: {
            return {
                ...state,
                updatedCurrentScore: state.updatedCurrentScore + action.getScore
            }
        }

        case types.HIGH_SCORE: {
            const unsortedHighScores = [...state.unsortedAllHighScores, state.updatedCurrentScore];
            const sortedHighScores = [].concat(unsortedHighScores).sort((a, b) => { return b - a });

            return {
                ...state,
                unsortedAllHighScores: unsortedHighScores,
                sortedAllHighScores: sortedHighScores
            }
        }

        case types.WORD_COUNTER: {
            return {
                ...state,
                counter: state.counter + state.counterStep
            }
        }

        case types.RESET_COUNTER: {
            return {
                ...state,
                counter: 0
            }
        }

        default: 
            return state;
    }
}

export default game;