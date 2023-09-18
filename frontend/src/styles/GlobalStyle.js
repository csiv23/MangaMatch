import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

  body {
    margin: 0;
    padding: 0;
    background-color: #F5F5F5;
    color: #333; // Adjusted the text color to a neutral gray
    font-family: 'Roboto', sans-serif;
  }

  a {
    color: #4B0082; 
  }

  .btn {
    background-color: #4B0082; 
    border: none;
    font-family: 'Roboto', sans-serif;
    &:hover {
      background-color: #3a0066;
    }
  }
  
  .btn-primary {
    background-color: #4B0082;
    &:hover {
      background-color: #3a0066;
    }
  }

  .container {
    background-color: white; 
    padding: 20px;
    border-radius: 8px; 
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
  }
`;

export default GlobalStyle;
