import React, { Fragment, useEffect } from 'react';
import { useWeb3Context } from "web3-react";
import Button from '@material-ui/core/Button';
import './App.css';


function MyComponent() {
  const context = useWeb3Context();

  useEffect(() => {
    context.account || context.unsetConnector("MetaMask")
  }, [ context.account ]);

  return (
    context.account ? (
      <Fragment>
        <h1>Account info </h1>
        <p>{ context.account }</p>
      </Fragment>
    ) : <h1> No account </h1>
  );
}

function MetaMaskComponent() {
  const context = useWeb3Context();

  return (context.active ? <MyComponent /> : 
    <Fragment>
      <h1> Connnect to </h1>
      <Button 
        variant="contained" 
        color="primary"
        onClick={() => context.setConnector("MetaMask")}
      >
        MetaMask
      </Button>
    </Fragment>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MetaMaskComponent />
      </header>
    </div>
  );
}

export default App;
