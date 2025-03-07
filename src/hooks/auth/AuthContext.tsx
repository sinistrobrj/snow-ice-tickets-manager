
import { createContext } from 'react';
import { AuthContextType } from './types';

// Create the AuthContext with a default value
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
