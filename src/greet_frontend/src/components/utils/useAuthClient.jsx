import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { createActor } from '../../../../declarations/greet_backend/index';
import Login from '../Login';
import Navbar from '../Navbar';


const AuthContext = createContext();

export const useAuthClient = () => {
    const [authClient, setAuthClient] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [identity, setIdentity] = useState(null);
    const [principal, setPrincipal] = useState(null);
    const [backendActor, setBackendActor] = useState(null);

    const backendCanisterId =
        process.env.CANISTER_ID_GREET_BACKEND ||
        process.env.BACKEND_CANISTER_CANISTER_ID;

    const frontendCanisterId =
        process.env.CANISTER_ID_GREET_FRONTEND ||
        process.env.FRONTEND_CANISTER_CANISTER_ID;
        
    const clientInfo = async (client) => {
        const isAuthenticated = await client.isAuthenticated();
        const identity = client.getIdentity();
        const principal = identity.getPrincipal();

        setAuthClient(client);
        setIsAuthenticated(isAuthenticated);
        setIdentity(identity);
        setPrincipal(principal);

        if (isAuthenticated && identity && principal && principal.isAnonymous() === false) {
            let backendActor = createActor(backendCanisterId, { agentOptions: { identity: identity } });
            setBackendActor(backendActor);
        }

        return true;
    }

    useEffect(() => {
        (async () => {
            const authClient = await AuthClient.create();
            clientInfo(authClient);
        })();
    }, []);

    const login = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (authClient.isAuthenticated() && ((await authClient.getIdentity().getPrincipal().isAnonymous()) === false)) {
                    resolve(clientInfo(authClient));
                } else {
                    await authClient.login({
                        identityProvider: process.env.DFX_NETWORK === "ic"
                            ? "https://identity.ic0.app/"
                            : `http://be2us-64aaa-aaaaa-qaabq-cai.localhost:4943`,
                        onError: (error) => reject((error)),
                        onSuccess: () => resolve(clientInfo(authClient)),
                    });
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    const logout = async () => {
        await authClient?.logout();
    }

    return {
        login, logout, authClient, isAuthenticated, identity, principal, frontendCanisterId, backendCanisterId, backendActor
    };
}

export const AuthProvider = ({ children }) => {
    const auth = useAuthClient();
    if (!auth.isAuthenticated || !auth.backendActor) {
        return (
            <AuthContext.Provider value={auth}>
                <Navbar />
                <Login />
            </AuthContext.Provider>
        )
    }
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);
