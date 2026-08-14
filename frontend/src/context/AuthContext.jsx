import { jwtDecode } from 'jwt-decode';
import React, { createContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();


export default AuthContext


export function AuthProvider({children}) {
    const [authTokens, setAuthTokens] = useState(
        JSON.parse(localStorage.getItem('authTokens')) || null
    );

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );

    const nav = useNavigate()

    const url = import.meta.env.VITE_API_URL

    // Mirrors authTokens for the refresh interval, which is registered once
    // and would otherwise only ever see the value from first render.
    const authTokensRef = useRef(authTokens);
    authTokensRef.current = authTokens;

    // Returns { ok, error } so the caller can surface failures. Previously a
    // rejected login fell into an empty else branch and the form sat there
    // with no feedback at all.
    const loginUser = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(url + 'token/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value})
            });

            if (response.ok) {
                const data = await response.json();

                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
                localStorage.setItem('user', JSON.stringify(jwtDecode(data.access)));
                nav('/');

                return { ok: true };
            }

            const detail = await response.json().catch(() => null);

            return {
                ok: false,
                error:
                    detail?.detail ||
                    'Those credentials did not match our records.',
            };
        } catch (error) {
            console.error('Error during login:', error);

            return {
                ok: false,
                error: 'Could not reach the server. Check your connection and try again.',
            };
        }
    };
    
    const logoutUser = () => {
        setUser(null);
        setAuthTokens(null);
        localStorage.removeItem('authTokens');
        localStorage.removeItem('user');
    }


    const updateToken = async () => {
        // Read through the ref rather than the closed-over value: the refresh
        // interval is registered once on mount, so it used to capture whatever
        // authTokens was at that moment — null for anyone who signed in during
        // the session — and then throw on every tick.
        const tokens = authTokensRef.current;

        if (!tokens?.refresh) {
            return;
        }

        try {
            const response = await fetch(url+'token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({ 'refresh': tokens.refresh }),
            });

            if (response.ok) {
                const data = await response.json();
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
                localStorage.setItem('user', JSON.stringify(jwtDecode(data.access)));
            } else {
                logoutUser();
            }
        } catch (error) {
            console.error('Error updating tokens:', error);
        }
    };

    useEffect(() => {
        

        const interval = setInterval(() => {
            updateToken();
        }, 600000);

        return () => clearInterval(interval);
    }, []);

    

    var context = {
        loginUser:loginUser,
        logOut:logoutUser,
        user:user,
        authTok:authTokens,
        



    }
    return (
        <AuthContext.Provider value={context}>
            {children}
        </AuthContext.Provider>
        )
    }
