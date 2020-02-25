import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//komponen halaman
import Registration from './Pages/Registration';
import Login from './Pages/Login';
import ForgetPass from './Pages/ForgetPass';
import NotFound404 from './Pages/NotFound404'; 
import Private from './Pages/Private';
import PrivateRoute from './Components/privateRoute';

//komponen firebase
import FirebaseProvider from './Components/firebaseProvider';

//import materialUI
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import theme from './config/theme';

import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <>
    <CssBaseline />
    <ThemeProvider theme={theme} >
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
    <FirebaseProvider>
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
    </FirebaseProvider>
    </SnackbarProvider>
    </ThemeProvider>
    </>
  );
}

export default App;
