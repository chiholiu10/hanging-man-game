export const types = {
    NEW_ARRAY: 'NEW_ARRAY',
    FILTERED_ARRAY: 'FILTERED_ARRAY'
}

export const newArray = (getFilterArray) => ({
    type: types.NEW_ARRAY,
    getFilterArray
});

