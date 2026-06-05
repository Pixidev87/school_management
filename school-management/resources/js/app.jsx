import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/app.css';

function App() {
    return (
        <div className="container mt-5">
            <h1>School Management App</h1>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
