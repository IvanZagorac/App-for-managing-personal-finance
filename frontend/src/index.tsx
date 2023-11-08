import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/style.css';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import AccountPage from './components/Account/AccountPage';
import TransactionPage from './components/Transaction/TransactionPage';
import CategoryPage from './components/Category/CategoryPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/category" element={<CategoryPage/>}/>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/account" element={<AccountPage/>}/>
                <Route path="/account/:aId" element={<TransactionPage/>}/>
            </Routes>

        </BrowserRouter>

    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
