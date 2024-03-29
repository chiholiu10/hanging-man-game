export const types = {
    NEW_ARRAY: 'NEW_ARRAY',
    FILTERED_ARRAY: 'FILTERED_ARRAY',
    GET_WORD: 'GET_WORD',
    CLEAR_ARRAY: 'CLEAR_ARRAY',
    SCORE_COUNTER: 'SCORE_COUNTER',
    HIGH_SCORE: 'HIGH_SCORE',
    CLEAN_FILTERED_ARRAY: 'CLEAN_FILTERED_ARRAY',
    RESET_SCORE: 'RESET_SCORE',
    WORD_COUNTER: 'WORD_COUNTER',
    RESET_COUNTER: 'RESET_COUNTER',
    GUESS_WORD: 'GUESS_WORD'
}

export const newArray = unfilteredArray => ({
    type: types.NEW_ARRAY,
    unfilteredArray
});

export const filteredArray = getWord => ({
    type: types.FILTERED_ARRAY,
    getWord
});

export const getString = word => ({
    type: types.GET_WORD,
    word
});

export const clearArray = () => ({
    type: types.CLEAR_ARRAY
});

export const scoreCounter = getScore => ({
    type: types.SCORE_COUNTER,
    getScore
});

export const highScore = () => ({
    type: types.HIGH_SCORE
});

export const resetCurrentScore = () => ({
    type: types.RESET_SCORE
});

export const wordCounter = () => ({
    type: types.WORD_COUNTER
});

export const resetCounter = () => ({
    type: types.RESET_COUNTER
});
