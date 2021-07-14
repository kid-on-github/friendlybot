import './App.css';
import React, { useState } from 'react';


function App() {
  const [email, setEmail] = useState('')
  const [results, setResults] = useState([])

  const getEmailLocations = () => { 
    setResults({email})
    fetch(`https://5aijchuyn4.execute-api.us-east-1.amazonaws.com/prod/get-email?email=${email}`)
      .then(response => response.json())
      .then(result => setResults({email, results:result.results}))
      .catch(error => console.log('error', error));
  }


  return (
    <div className="App">
      <Header/>
      <div className='search'>
        <h1>friendlybot.org</h1>
        <p className='fs24 fw300'>Where can <b className='color-blue'>YOUR</b> email be found?</p>
        <div id='searchBar'>
          <input autoFocus type='email' id='emailInput' placeholder='you@example.com' onKeyUp={e => e.key === 'Enter' && getEmailLocations()} onChange={e=>setEmail(e.target.value)}/>
          <span className="material-icons" id='searchIcon' onClick={getEmailLocations}>search</span>
        </div>
        <Results results={results}/>
      </div>
    </div>
  );
}




function Header(props){
  const [clicked, setClicked] = useState('home')

  const anchor = document.URL.split('#')[1]

  anchor && anchor !== clicked && setClicked(anchor)

  return (
    <header>
      <a className={clicked === 'home' && 'selected' || ''} onClick={()=>setClicked('home')} href='./'>home</a>
      <a className={clicked === 'mission' && 'selected' || ''} onClick={()=>setClicked('mission')} href='./#mission'>mission</a>
      <a href='./'>docs</a>
      <a className='ul-blue' href='./'>download</a>
    </header>
  )
}




function Results(props){
  const {results} = props
  console.log('r',results)

  const loaded = 'results' in results

  const renderResults = loaded
    ? results.results.map(url => <p className='fs20' key={url}>{url}</p>)
    : <p></p>


  return (
    <div className='results'>
      {results.email && <p className='fw500 fs30'>Results for <span className='color-blue'>{results.email}</span></p>}
      {renderResults}
    </div>
  )
}



export default App;
