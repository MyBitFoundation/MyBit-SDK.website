import React, { Fragment, useState, useEffect } from 'react';
import { useWeb3Context } from 'web3-react';
import emoji from 'emojilib';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Web3 from 'web3';
import SDK_CONTRACTS from '@mybit/contracts/networks/ropsten/Contracts';

import './App.css';

const Form = styled.form`
  display: flex;
  flex-wrap: 'wrap';
`

const StyledFormControl = styled(FormControl)`
  form & {
    margin: 16px;
    min-width: 120px;
  }
`

const StyledSelect = styled(Select)`
  form & {
    color: white;
  }
`

function useMyBitNetwork() {
  const [ network, setNetwork ] = useState(null);
  const [ api, setAPI ] = useState(null);

  useEffect(() => {
    async function loadNetwork() {
      if (typeof window.web3 !== 'undefined') {
        console.log('[ useMyBitNetwork ] init');
        const web3 = new Web3(window.web3.currentProvider);
        const network = 
          require('@mybit/network.js')(web3, SDK_CONTRACTS);
        const api = await network.api();
        setNetwork(network);
        setAPI(api);
      }
    }
    loadNetwork();
  }, []);

  return { network, api };
}

async function getAssets(network) {
  console.log('[ getAssets ] init');
  const assets = await network.getTotalAssets();
  return assets;
}

function MyComponent() {
  const context = useWeb3Context();
  const mybit = useMyBitNetwork();

  const [ assets, setAssets ] = useState([])
  const [ asset, setAsset ] = useState('')
  
  useEffect(() => {
    context.account || context.unsetConnector("MetaMask")
  }, [ context.account ]);

  return (
    context.account ? (
      <Fragment>
        <h1>Account info </h1>
        <p><code>{ context.account }</code></p>
        <br/>
        {
          mybit.api &&
          <Button
            variant="contained" 
            color="primary"
            onClick={
              async () => 
                setAssets(await getAssets(mybit.network))
            }
          >
            Retrieve assets
          </Button>
        }
        { 
          assets.length > 0 && 
          <Fragment>
            <h2> Assets in the MyBit Network </h2>
            <Form autoComplete="off">
              <StyledFormControl>
                <InputLabel htmlFor="asset-id">Asset</InputLabel>
                <StyledSelect
                  value={asset}
                  onChange={(event) => setAsset(event.target.value)}
                  inputProps={{
                    name: 'asset',
                    id: 'asset-id'
                  }}
                >
                  {
                    assets.map( asset => 
                      <MenuItem key={asset} value={asset}>
                        {asset}
                      </MenuItem>
                    )
                  }
                </StyledSelect>
              </StyledFormControl>
            </Form>
          </Fragment>
        }
        {
          asset &&
            <Fragment>
              <h2> Current Asset </h2>
              <p><code>{ asset }</code></p>
            </Fragment>
        }
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
