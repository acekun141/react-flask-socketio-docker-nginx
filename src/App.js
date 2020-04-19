import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DirectPage from './pages/DirectPage';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';


function App() {
    return (
        <Router>
        <div className="App">
            <Header />
            <Switch>
                <Route exact path='/'>
                    <HomePage />
                </Route>
                <Route exact path='/direct'>
                    <DirectPage />
                </Route>
                <Route path='/login'>
                    <LoginPage />
                </Route>
            </Switch>
            <Footer />
        </div>
        </Router>
    );
}

export default App;
