const create_options = (arr)=>{
    // sort
    arr = arr.sort()
    let result = '<option value=""></option>'
    for (const type_ of arr) {
        result += `<option value='${type_}'>${type_.toUpperCase()}</option>`
    }
    return result
}