import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'primereact/resources/themes/saga-blue/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import { GoogleOAuthProvider } from '@react-oauth/google';

import QueryClientProviderWrapper from './components/QueryClientProvider'; 

const clientIdEnv = process.env.REACT_APP_CLIENT_ID


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <QueryClientProviderWrapper>
    <GoogleOAuthProvider clientId={clientIdEnv}>
     <App />
     </GoogleOAuthProvider>
    </QueryClientProviderWrapper>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
