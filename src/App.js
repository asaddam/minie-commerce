import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Registration from './Pages/Registration';
import Login from './Pages/Login';
import ForgetPass from './Pages/ForgetPass';
import NotFound404 from './Pages/NotFound404'; 
import Private from './Pages/Private';
import PrivateRoute from './Components/privateRoute';

function App() {
  return (
    <Router>
      <Switch>
        <PrivateRoute path='/' exact component={Private} />
        <PrivateRoute path='/setting' component={Private} />
        <PrivateRoute path='/products' component={Private} />
        <PrivateRoute path='/transactions' component={Private} />
        <Route path='/registration' component={Registration} />
        <Route path='/login' component={Login} />
        <Route path='/forget-pass' component={ForgetPass} />
        <Route component={NotFound404} />
      </Switch>
    </Router>
  
  );
}

export default App;
