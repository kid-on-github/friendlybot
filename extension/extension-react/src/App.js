import './App.css';
import React, { useState } from 'react';


// APP
function App() {

  const [page, setPage] = useState('search');

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

  const links = results && results.results && results.results.map(
    link => <p>{link}</p>
  )

  return (
    <div className={'search ' + (results ? 'results' : '')}>
      <h1>friendlybot.org</h1>
      <InputBar type='email' icon='search' submit={getEmailLocations}/>
      {links}
    </div>
  )
}







// INPUT BAR
function InputBar(props){
  const {type, icon, submit} = props
  const [val, setVal] = useState('')
  return (
    <div className='inputBar'>
      <input type={type} onChange={e=>setVal(e.target.value)} onKeyUp={e => e.key === 'Enter' && submit(val)}/>
      <Icon icon={icon} onClick={()=>submit(val)}/>
    </div>
  )
}


// SETTINGS PAGE
function Settings(){
  return (
    <div>
      
    </div>
  )
}

export default App;
