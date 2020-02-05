import React from 'react';

import { Switch, Route } from 'react-router-dom';

import Setting from './Setting';
import Products from './Products';
import Transactions from './Transactions';
import Home from './Home';

function Private(){
    
    return (
        <Switch>
            <Route path="/setting" component={Setting} />
            <Route path="/products" component={Products} /> 
            <Route path="/transactions" component={Transactions} />
            <Route path="/" component={Home} />
        </Switch>
    ) 
}

export default Private;