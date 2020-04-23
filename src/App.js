import React, {useEffect} from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DirectPage from './pages/DirectPage';
import PrivateRotue from './components/PrivateRoute';
import {useDispatch, useSelector} from 'react-redux';
import {get_user} from './redux/reducer/user/actions';
import {get_token} from './redux/reducer/accessToken/actions';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';


function App() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    useEffect(() => {
        dispatch(get_user());
        window.scrollTo(0, document.body.scrollHeight);
    }, []);
    useEffect(() => {
        if (user.name) {
            dispatch(get_token());
        }
    }, [user])
    return (
        <Router>
        <div className="App">
            <Header />
            <Switch>
                <PrivateRotue exact path='/'>
                    <HomePage />
                </PrivateRotue>
                <PrivateRotue path='/direct/:room_id?'>
                    <DirectPage />
                </PrivateRotue>
                <Route path='/login'>
                    <LoginPage />
                </Route>
                <Route path="*">
                    <h1>Error</h1>
                </Route>
            </Switch>
            <Footer />
        </div>
        </Router>
    );
}

export default App;
