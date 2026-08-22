import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <ThemeProvider theme={theme}>
  <CssBaseline />
    <App />
    </ThemeProvider>
  // </React.StrictMode>
  
);
setTimeout(() => {

 const loader =
 document.getElementById("startup-loader");

 if(loader)
 {
   loader.style.display="none";
 }

},800);


