export const types = {
    NEW_ARRAY: 'NEW_ARRAY',
    FILTERED_ARRAY: 'FILTERED_ARRAY',
    GET_WORD: 'GET_WORD',
    CLEAR_ARRAY: 'CLEAR_ARRAY'
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

