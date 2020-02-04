import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import ForgetPass from './Pages/ForgetPass';
import NotFound404 from './Pages/NotFound404'; 

function App() {
  return (
    <Router>
      <Route path='/registration' component={Registration} />
      <Route path='/login' component={Login} />
      <Route path='/forget-pass' component={ForgetPass} />
      <Route  component={NotFound404} />

    </Router>
  
  );
}

export default App;
