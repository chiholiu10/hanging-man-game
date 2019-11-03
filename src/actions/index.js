export const types = {
    NEW_ARRAY: 'NEW_ARRAY',
    FILTERED_ARRAY: 'FILTERED_ARRAY',
    GET_WORD: 'GET_WORD',
    CLEAR_ARRAY: 'CLEAR_ARRAY',
    SCORE_COUNTER: 'SCORE_COUNTER',
    HIGH_SCORE: 'HIGH_SCORE'
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
})

export const clearArray = () => ({
    type: types.CLEAR_ARRAY
});

export const scoreCounter = getScore => ({
    type: types.SCORE_COUNTER,
    getScore
});

export const highScore = getHighScore => ({
    type: types.HIGH_SCORE,
    getHighScore
});