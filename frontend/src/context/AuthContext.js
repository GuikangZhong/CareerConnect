import React from 'react';
import { useHistory } from 'react-router-dom';

export const AuthContext = React.createContext();

export const AuthContextProvider = ({children}) => {

    let history = useHistory();

    const handleLogout = () => {
        fetch('/signout/', {
            method: 'GET',
            body: null,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            history.push("/signin");
        });
    };

    return (
        <AuthContext.Provider value = {{handleLogout}}>
            {children}
        </AuthContext.Provider>
    );
};
