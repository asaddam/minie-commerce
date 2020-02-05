import React from 'react';

import { Switch, Route } from 'react-router-dom';

import EditProduct from './edit';
import GridProduct from './grid';

function Products(){
    
    return(
        <Switch>
            <Route path="/products/edit/:productId" component={EditProduct}/>
            <Route component={GridProduct} />

        </Switch>
    ) 
}

export default Products;