import React from 'react';
import './App.css';

function App() {
  return (
    <div className="form-container">
      <h2>User Details</h2>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="phone">Phone Number:</label>
        <input type="tel" id="phone" name="phone" required />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <div className="btnBg">
          <button type="button">Register</button>
          <button type="button">Login</button>
        </div>
      </div>
    </div>
  );
}

export default App;
