GET_ELCTIONS = "GET_ELECTION"
ADD_ELECTIONS = 'ADD_ELECTIONS'
LOADING = 'LOADING'
LOADED = 'LOADED'
ADD_LOCAL_GOVT = 'ADD_LOCAL_GOVT'
const rootUrl = "http://127.0.0.1:8000"

const load = (type) => {
    return {
        type: type
    }
}

const set_state = (data,type) => {
    return {
        type: type,
        data:data
    }
}

const getState = () => {
    const localdata = localStorage.getItem("storestate");
    let finaldata = ""
    if (localdata) {
        const jsonify = JSON.parse(localdata)
        finaldata = {
            // User: "",
            loading: false,
            // logged: false,
            elections: {},
            local_govt:{},
            ...jsonify,
            // message: "",
            // status: "",
            // messages: "",
        }
    } else {
        finaldata = {
            // User: "",
            loading: false,
            // logged: false,
            elections: {},
            local_govt:{},
            // message: "",
            // status: "",
            // messages: "",
        }
    }
    return finaldata
}

//Reducer
const storeReducer = (action) => {
    let state = getState()
    switch (action.type) {

        case ADD_ELECTIONS:
            return {
                ...state,
                elections:action.data,
                loading: false,
            }

        case ADD_LOCAL_GOVT:
                let length = Object.keys(state.local_govt).length
                state.local_govt = length>5?{}:state.local_govt
                return {
                    ...state,
                    local_govt:{...state.local_govt,
                                ...action.data},
                    loading: false,
                }
    

        case LOADING:
            return {
                ...state,
                loading: true
            }
        case LOADED:
            return {
                ...state,
                loading: false,
            }

        default:
            return {
                ...state
            }
    }
}

const setState = (storestate) => {
    localStorage.setItem("storestate", JSON.stringify(storestate))
}

const GetElection = async(action,local=null) => {
    local = local?local.replace(' ',"%"):local
    setState(storeReducer(load(LOADING)))
    let response = await fetch(`${rootUrl}/elections?action=${action}&local=${local}`)

    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return await response.json()
}



// const GetCustomer = async(data, token) => {
//     setState(storeReducer(load(LOADING)))
//     let response = await fetch(`${rootUrl}/user/customer/0/get`, {
//         method: 'POST', // or 'PUT'
//         credentials: 'same-origin',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': token
//         },
//         body: JSON.stringify(data),
//     })

//     if (!response.ok) {
//         throw new Error(response.statusText)
//     }
//     return await response.json()
// }
