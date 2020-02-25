import React from 'react';

//material-ui
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

import { Switch, Route, Redirect } from 'react-router-dom';

import Store from './store';
import User from './user';

// styles
import useStyles from './styles';

const Setting = (props) => {
    const { location, history } = props;
    const classes = useStyles();
    const handleChangeTab = (event, value) => {

        history.push(value);
    }

    return(
        <Paper square>
            <Tabs
                value={location.pathname}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleChangeTab}
            >
                <Tab label="User" value="/setting/user" />
                <Tab label="Store" value="/setting/store" />
            </Tabs>
            <div className={classes.tabContent}>
                <Switch>
                    <Route path="/setting/user" component={User} />
                    <Route path="/setting/store" component={Store} />
                    <Redirect to="/setting/user/" />
                </Switch>
            </div>
        </Paper>

    ) 
}

export default Setting;