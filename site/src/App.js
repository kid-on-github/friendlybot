import './App.css';
import React, { useState } from 'react';


function App() {
  const [email, setEmail] = useState('')
  const [results, setResults] = useState([])




  const getEmailLocations = () => { 
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    setResults({email})
    
    fetch(`https://5aijchuyn4.execute-api.us-east-1.amazonaws.com/prod/get-email?email=${email}`, requestOptions)
      .then(response => response.json())
      .then(result => setResults({email, results:result.results}))
      .catch(error => console.log('error', error));

  }


  return (
    <div className="App">

      <div className='search'>
        <h1>friendlybot.org</h1>
        <p className='fs24 fw300'>Where can <b className='color-blue'>YOUR</b> email be found?</p>
        <div id='searchBar'>
          <input autoFocus type='email' id='emailInput' placeholder='you@example.com' onKeyUp={e => e.key === 'Enter' && getEmailLocations()} onChange={e=>setEmail(e.target.value)}/>
          <span class="material-icons" id='searchIcon' onClick={getEmailLocations}>search</span>
        </div>
        <Results results={results}/>
      </div>
    </div>
  );
}





function Results(props){
  const {results} = props
  console.log('r',results)

  const loaded = 'results' in results

  const renderResults = loaded
    ? results.results.map(url => <p>{url}</p>)
    : <p></p>


  return (
    <div className='results'>
      {results.email && <p>Results for {results.email}</p>}
      {renderResults}
    </div>
  )
}



export default App;
