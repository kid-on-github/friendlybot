import './App.css';
import React, { useState } from 'react';


function App() {

  const [page, setPage] = useState('search');

  return (
    <div className="App">
      <Header page={page} setPage={setPage}/>
      {page === 'search' ? <Search/> : <Settings/>}
    </div>
  );
}

function Header(props){

  const {page, setPage} = props

  const buttons = ['search', 'settings'].map(
    icon => <IconButton 
              className={page === icon ? 'selected' : ''} 
              icon={icon}
              setPage={setPage}
            />
  )

  return (
    <header>
      {buttons}
    </header>
  )
}


function Icon(props){
  const {icon} = props
  return <span className="material-icons icon">{icon}</span>
}


function IconButton(props){
  const {icon, className, setPage} = props
  return  (
    <button className={className} onClick={() => setPage(icon)}>
      <Icon icon={icon}/>
    </button>
  )
}

function Search(){
  return (
    <div className='search'>
      <h1>friendlybot.org</h1>
      <InputBar type='email' icon='search'/>
    </div>
  )
}


function InputBar(props){

  const {type, icon} = props

  return (
    <div className='inputBar'>
      <input type={type}/>
      <Icon icon={icon}/>
    </div>
  )
}


function Settings(){
  return (
    <div>
      
    </div>
  )
}

export default App;
