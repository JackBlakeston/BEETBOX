import { Paper, Tab, Tabs, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function AuthScreen () {

  const navigate = useNavigate(); // TODO use this for navigating after login

  const [tabIndex, setTabIndex] = useState(0);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPass, setRegisterPass] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');

  function handleTabChange (event, newTabIndex) {
    setTabIndex(newTabIndex);
  }

  function handleLoginSubmit (event, value) {
    event.preventDefault();
    // Check validity ?? Does firebase do this maybe¿?¿
    // LOGIN with firebase
    // ?? redirect with router
  }

  function handleRegisterSubmit (event, value) {
    event.preventDefault();
    // Check validity ?? Does firebase do this maybe¿?¿
    // REGISTER with firebase
    // ?? redirect with router
  }

  function handleInputChange (event) {
    const inputName = event.target.name;
    const value = event.target.value;

    if (inputName === 'loginUsername') {
      setLoginUsername(value);
    }
    if (inputName === 'loginPass') {
      setLoginPass(value);
    }
    if (inputName === 'registerEmail') {
      setRegisterEmail(value);
    }
    if (inputName === 'registerUsername') {
      setRegisterUsername(value);
    }
    if (inputName === 'registerPass') {
      setRegisterPass(value);
    }
  }

  return (
    <div className='auth-container'>
      <Paper
        sx={{
          height: 500,
          width: 500
        }}
      >
        <Box sx={{ borderBottom: 0.5, borderColor: 'divider' }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            // textColor="secondary"
            // indicatorColor="secondary"
          >
            <Tab sx={{ width: 250 }} label="Login" />
            <Tab sx={{ width: 250 }} label="Register" />
          </Tabs>
        </Box>

        { tabIndex === 0 &&
          <div className='auth-form-container'>
            <form autoComplete='off' onSubmit={handleLoginSubmit} className='auth-form'>
              <TextField onChange={handleInputChange} value={loginUsername} name='loginUsername' label='Username' variant='outlined' />
              <TextField onChange={handleInputChange} value={loginPass} name='loginPass' label='Password' variant='outlined' type='password'/>

              <button type='submit' disabled={loginUsername.length < 3} // TODO Add more conditions
              >
                LOG IN
              </button>
            </form>
          </div>
        }

        { tabIndex === 1 &&
          <div className='auth-form-container'>
          <form autoComplete='off' onSubmit={handleRegisterSubmit} className='auth-form'>
            <TextField onChange={handleInputChange} value={registerEmail} name='registerEmail' label='Email' variant='outlined' />
            <TextField onChange={handleInputChange} value={registerUsername} name='registerUsername' label='Username' variant='outlined' />
            <TextField onChange={handleInputChange} value={registerPass} name='registerPass' label='Password' variant='outlined' type='password'/>

            <button type='submit' disabled={registerUsername.length < 3} // TODO Add more conditions OR check if firebase does
            >
              REGISTER
            </button>
          </form>
        </div>
        }

      </Paper>
    </div>
  )
}


export default AuthScreen;