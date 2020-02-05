import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import Store from './store';
import User from './user';

function Setting(){
    
    return(
        <Switch>
            <Route path="/setting/user" component={User} />
            <Route path="/setting/store" component={Store} />
            <Redirect to="/setting/user/" />
        </Switch>
    ) 
}

export default Setting;