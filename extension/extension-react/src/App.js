import './App.css';
import React, { useState } from 'react';


// APP
function App() {

  const [page, setPage] = useState('settings');

  return (
    <div className="App">
      <Header page={page} setPage={setPage}/>
      {page === 'search' ? <Search/> : <Settings/>}
    </div>
  );
}





// HEADER
function Header(props){
  const {page, setPage} = props

  const buttons = ['search', 'settings'].map(
    icon => <IconButton className={page === icon ? 'selected' : ''} icon={icon} setPage={setPage} key={icon}/>
  )

  return <header> {buttons} </header>
}




// ICON
function Icon(props){
  const {icon, onClick} = props
  return <span className="material-icons icon" onClick={()=>onClick && onClick()}>{icon}</span>
}




// ICON BUTTON
function IconButton(props){
  const {icon, className, setPage} = props
  return  (
    <button className={className} onClick={() => setPage(icon)}>
      <Icon icon={icon}/>
    </button>
  )
}





// SEARCH PAGE
function Search(){
  const [results, setResults] = useState()

  console.log(results)
  
  const getEmailLocations = (email) => { 
    setResults({email})
    fetch(`https://5aijchuyn4.execute-api.us-east-1.amazonaws.com/prod/get-email?email=${email}`)
      .then(response => response.json())
      .then(result => setResults({email, results:result.results}))
      .catch(error => console.log('error', error));
  }

  let links = ''

  if (results && results.results){
    if (results.results.length > 0){
      links = results.results.map(
        link => <p>{link}</p>
      )
    }
    else{
      links = <p>No results found</p>
    }
  }


  return (
    <div className={'search ' + (results ? 'results' : '')}>
      <h1>friendlybot.org</h1>
      <InputBar type='email' icon='search' submit={getEmailLocations} placeholder='you@example.com'/>
      {links}
    </div>
  )
}







// INPUT BAR
function InputBar(props){
  const {type, icon, submit, placeholder=''} = props
  const [val, setVal] = useState('')
  return (
    <div className='inputBar'>
      <input autoFocus type={type} placeholder={placeholder} onChange={e=>setVal(e.target.value)} onKeyUp={e => e.key === 'Enter' && submit(val)}/>
      <Icon icon={icon} onClick={()=>submit(val)}/>
    </div>
  )
}


// SETTINGS PAGE
function Settings(){

  const [status, setStatus] = useState('enabled')
  const [disabledSites, setDisabledSite] = useState([])

  const addDisabledSite = (domain) => {
    let tmp = disabledSites
    if (!tmp.includes(domain)){
      tmp.push(domain)
      setDisabledSite(tmp)
    }
  }

  const removeDisabledSite = (domain) => {
    let tmp = disabledSites

  }


  return (
    <div className='settings'>
      <div className='section'>
        <h6>Discovery</h6>
        <div className={'state ' + status} onClick={()=>status === 'enabled' ? setStatus('disabled') : setStatus('enabled')}>
          <h2>{status}</h2>
          <button></button>
        </div>
      </div>

      <div className='section'>
        <h6>Disabled Sites</h6>
        <InputBar type='email' icon='add' submit={addDisabledSite} placeholder='example.com'/>
      </div>
    </div>
  )
}

export default App;
