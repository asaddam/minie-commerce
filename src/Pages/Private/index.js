import React from 'react';
import clsx from 'clsx';

import { Switch, Route } from 'react-router-dom';

//material-ui component
import { Drawer, AppBar, Toolbar, List, ListItem,
        ListItemIcon, ListItemText, Typography,
        Divider, IconButton, Container } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import StoreIcon from '@material-ui/icons/Store';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SettingsIcon from '@material-ui/icons/Settings';

import { useFirebase } from '../../Components/firebaseProvider';
import useStyles from './styles';
import Setting from './Setting';
import Products from './Products';
import Transactions from './Transactions';
import Home from './Home';

export default function Private() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const { auth } = useFirebase();
    const handleDrawerOpen = () => {
        setOpen(true);
    }

    const handleDrawerClose = () => {
        setOpen(false);
    }

    const handleSignOut = (e) => {
        if(window.confirm("Are you sure want to sign out ?"))
            auth.signOut();
    }
    
    return (
        <div className={classes.root}>
            <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
                        <MenuIcon />
                    </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            <Switch>
                                <Route path="/setting" children="Setting" />
                                <Route path="/products" children="Products" /> 
                                <Route path="/transactions" children="Transactions" />
                                <Route children="Home" />
                            </Switch>
                        </Typography>
                        <IconButton
                            onClick={handleSignOut}
                            color="inherit">
                            <SignOutIcon />
                        </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <Route path="/" exact children={({ match, history }) => {
                        return <ListItem
                            button
                            selected={match ? true : false}
                            onClick={() => {
                                history.push('/')
                            }}
                        >
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                    }} />

                    <Route path="/products" children={({ match, history }) => {
                        return <ListItem
                            button
                            selected={match ? true : false}
                            onClick={() => {
                                history.push('/products')
                            }}
                        >
                            <ListItemIcon>
                                <StoreIcon />
                            </ListItemIcon>
                            <ListItemText primary="Products" />
                        </ListItem>
                    }} />
                    <Route path="/transactions" children={({ match, history }) => {
                        return <ListItem
                            button
                            selected={match ? true : false}
                            onClick={() => {
                                history.push('/transactions')
                            }}
                        >
                            <ListItemIcon>
                                <ShoppingCartIcon />
                            </ListItemIcon>
                            <ListItemText primary="Transactions" />
                        </ListItem>
                    }} />
                    <Route path="/setting" children={({ match, history }) => {
                        return <ListItem
                            button
                            selected={match ? true : false}
                            onClick={() => {
                                history.push('/setting')
                            }}
                        >
                            <ListItemIcon>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary="Setting" />
                        </ListItem>
                    }} />
                </List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    <Switch>
                        <Route path="/setting" component={Setting} />
                        <Route path="/products" component={Products} /> 
                        <Route path="/transactions" component={Transactions} />
                        <Route component={Home} />
                    </Switch>
                </Container>
            </main>

        </div>

    ) 
}

