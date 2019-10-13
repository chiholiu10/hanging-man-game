export const types = {
    NEW_ARRAY: 'NEW_ARRAY'
}

export const newArray = getArray => ({
    type: types.NEW_ARRAY,
    getArray
});