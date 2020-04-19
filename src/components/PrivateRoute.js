import React from 'react';
import {Route, Redirect} from 'react-router-dom';


export default function PrivateRotue({children, ...rest}) {
    const fakeAuth = {isAuthenticated: true};
    return (
        <Route
            {...rest}
            render={({location}) => 
                    fakeAuth.isAuthenticated ? (
                        chilren
                    ) : (
                        <Redirect
                            to={{ pathname: '/login'}}
                        />
                    )
            }
        />
    );
};
