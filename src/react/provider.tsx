import { createContext, useContext, useMemo, ReactNode } from 'react';
import { JuronoApiClient } from '../client';
import { Auth } from '../endpoints/auth';
import { Users } from '../endpoints/users';
import { Organizations } from '../endpoints/organizations';
import { Clients } from '../endpoints/clients';
import { Mandates } from '../endpoints/mandates';
import { Documents } from '../endpoints/documents';
import { JuronoApiOptions } from '../types';

export interface JuronoSDK {
  client: JuronoApiClient;
  auth: Auth;
  users: Users;
  organizations: Organizations;
  clients: Clients;
  mandates: Mandates;
  documents: Documents;
}

const JuronoContext = createContext<JuronoSDK | null>(null);

export interface JuronoProviderProps extends JuronoApiOptions {
  children: ReactNode;
}

export function JuronoProvider({ children, ...options }: JuronoProviderProps): JSX.Element {
  const sdk = useMemo(() => {
    const client = new JuronoApiClient(options);
    
    return {
      client,
      auth: new Auth(client),
      users: new Users(client),
      organizations: new Organizations(client),
      clients: new Clients(client),
      mandates: new Mandates(client),
      documents: new Documents(client),
    };
  }, [options.apiKey, options.baseUrl, options.timeout, options.retries, options.retryDelay]);

  return (
    <JuronoContext.Provider value={sdk}>
      {children}
    </JuronoContext.Provider>
  );
}

export function useJurono(): JuronoSDK {
  const context = useContext(JuronoContext);
  if (!context) {
    throw new Error('useJurono must be used within a JuronoProvider');
  }
  return context;
}