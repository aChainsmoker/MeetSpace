import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import App from "@/App";
import store from "@/store";
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/schedule/styles.css';
import '@mantine/dropzone/styles.css';
import './styles/main.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);