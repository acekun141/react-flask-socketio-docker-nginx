import React, {useEffect} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';


export default function PrivateRotue({children, ...rest}) {
    const user = useSelector(state => state.user);
    return (
        <Route
            {...rest}
            render={({location}) => 
                    user.name ? (
                        children
                    ) : (
                        <Redirect
                            to={{ pathname: '/login'}}
                        />
                    )
            }
        />
    );
};
