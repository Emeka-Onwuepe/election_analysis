let state_data = getState()
election_type = document.querySelector('#election_type')
states = document.querySelector('#states')
constituency = document.querySelector('#constituency')
label_constituency = document.querySelector('#Constituency_label')
date = document.querySelector('#date')
local_govt = document.querySelector('#local_govt')
ward = document.querySelector('#ward')
polling_unit = document.querySelector('#polling_unit')
get_results = document.querySelector('#get_results')


elections = state_data.elections

if (Object.keys(state_data.elections).length < 1){
    
    GetElection('first_data').then(data=>{
    
    elections = data
    election_type.innerHTML = create_options(data.election_type)
    states.innerHTML = create_options(data.states)
    setState(storeReducer(set_state(data,ADD_ELECTIONS)))})
}else{
    election_type.innerHTML = create_options(elections.election_type)
    states.innerHTML = create_options(elections.states)
}


let form_state = {election_type:'',
                  election_type_id:'',
                  states:'',
                  constituency:'',
                  date:'',
                  local_govt:'',
                  ward:'',
                  polling_unit:''
                    }

// const handleElectionType = (e) =>{
//    

//     // const {election_type,state,constituency_,
//     //         date,local_govt,ward,polling_unit} = form_state
    
//     
//
//     }

// }

const updateFormState = (e,form_state) =>{
    let selected = e.target.value.toLowerCase()
    let id = e.target.id
    form_state[id] = selected
}

const handleElectionTypeAndState = (e) =>{
    updateFormState(e,form_state)

    if (form_state.election_type == 'presidential' || 
        form_state.election_type == 'governorship'){
        constituency.style.display = "None"
        label_constituency.style.display = "None"
    }else{
        constituency.style.display = "block"
        label_constituency.style.display = "block"
    }

    if (form_state.states && form_state.election_type && 
        form_state.election_type != 'presidential' && 
        form_state.election_type != 'governorship'){
        let data = elections[form_state.election_type][form_state.states]
        data = Object.keys(data)
        constituency.innerHTML = create_options(data) 
    }else if(form_state.states && form_state.election_type && 
            (form_state.election_type == 'governorship'||
            form_state.election_type == 'presidential')){
        let data = null
        if(form_state.election_type == 'presidential'){
            data = elections[form_state.election_type]
        }else{
            data = elections[form_state.election_type][form_state.states]
        }
        
        data = Object.keys(data)
        date.innerHTML = create_options(data)
        local_govt.innerHTML = create_options(elections.lgs[form_state.states])

    }

}
// const handleState = (e) =>{
//     updateFormState(e,form_state)

//     if (form_state.states && form_state.election_type && 
//                 form_state.election_type != 'presidential' && 
//                 form_state.election_type != 'governorship'){
//                 let data = elections[form_state.election_type][form_state.states]
//                 data = Object.keys(data)
//                 constituency.innerHTML = create_options(data) 
//             }
// }

const handleConstituency = (e) =>{
    updateFormState(e,form_state)
    if (form_state.states && form_state.election_type && 
                form_state.election_type != 'presidential' && 
                form_state.election_type != 'governorship' && 
                form_state.constituency){
                let {lgs,years} = elections[form_state.election_type][form_state.states][form_state.constituency]
                years = Object.keys(years)
                local_govt.innerHTML = create_options(lgs) 
                date.innerHTML = create_options(years) 
            }
}

const handleLocalGovt = (e) =>{
    updateFormState(e,form_state)
    if(form_state.local_govt){
        let local_govts = getState().local_govt
        let key_ = e.target.value
        try {
           let wards = local_govts[key_] 
           ward.innerHTML = create_options(Object.keys(wards)) 

        } catch (error) {
            GetElection('get_ward',form_state.local_govt).then(data=>{
                ward.innerHTML = create_options(Object.keys(data)) 
                setState(storeReducer(set_state({[key_]:data},ADD_LOCAL_GOVT)))
            }) 
        }  
    }

}

const handleDate = (e) =>{
    updateFormState(e,form_state)
    let date = e.target.value
    if(form_state.election_type == 'presidential'){
        let id = elections[form_state.election_type][date]
        form_state.election_type_id = id
    }else if(form_state.election_type == 'governorship'){
        let id = elections[form_state.election_type][form_state.states][date]
        form_state.election_type_id = id
    }else{
        // let id = elections[form_state.election_type][form_state.states][form_state.constituency]['years'][date]
        let id = elections[form_state.election_type][form_state.states][form_state.constituency].years[date]
        form_state.election_type_id = id
    }

    console.log(form_state)
}
const handleWard = (e) =>{
    let ward = e.target.value
    updateFormState(e,form_state)
    if(ward && form_state.local_govt ){
        let polling_units = getState().local_govt[form_state.local_govt][ward]
        polling_unit.innerHTML =  create_options(polling_units) 
    }
    
}
const handlePollingUnit = (e) =>{
    updateFormState(e,form_state)
}

const getResults = (e) =>{
    e.preventDefault()

    let {election_type_id,local_govt,ward} = form_state
    local_govt = local_govt.replace(" ","%") 
    ward = ward.replace(" ","%") 
    console.log(election_type_id)
    if(election_type_id && local_govt && ward){

            let url = `/results/${election_type_id}/${local_govt}/${ward}`
            console.log(url)
            window.location.href = url
        }
   
}

election_type.addEventListener('change', handleElectionTypeAndState)
states.addEventListener('change', handleElectionTypeAndState)
constituency.addEventListener('change', handleConstituency)
local_govt.addEventListener('change', handleLocalGovt)
date.addEventListener('change', handleDate)
ward.addEventListener('change', handleWard)
polling_unit.addEventListener('change', handlePollingUnit)
get_results.addEventListener('click', getResults)






