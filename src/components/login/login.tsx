import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { ReactSession } from 'react-client-session';
import bcrypt from "bcryptjs";
import './login.css'
function Login(){
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alert, setAlert] = useState()
    async function handelSubmit(e){
        e.preventDefault();
        if(email&&password != ''){
            if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
                if(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)){
                    const loginData = {
                        email: email,
                        password: password
                    }
                    try {
                        const response = await fetch( import.meta.env.VITE_KEY_LOGIN, {
                            mode: 'cors',
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(loginData),
                          }).then(async (res)=>{
                            if(res.status === 200){
                                const hashedCode = await bcrypt.hash(import.meta.env.VITE_SECRET_CODE, parseInt(import.meta.env.VITE_APP_HASHING_SALT));
                                ReactSession.set("passcode", hashedCode);
                                navigate('/home', { replace: true });
                            }else if(res.status === 401){
                                setAlert(<Alert severity='error'>One of the fields is not correct!</Alert>)
                            }else{
                                setAlert(<Alert>Somethin went wrong!</Alert>)
                            }
                          })
                    } catch (error) {
                        console.log(error)
                    }
                }else{
                    setAlert(<Alert>Password is not strong enough!</Alert>)
                }
            }else{
                setAlert(<Alert>Enter a valid email!</Alert>)
            }
        }else{
            setAlert(<Alert>One of the fields is empty!</Alert>)
        }
    }
    return(
        <>
        <div className="pageLogin">
        <h1>Login</h1>
            <div className="loginBox">
                <span>{alert===undefined? '': alert}</span>
                <TextField
                label="Email"
                variant="standard"
                onChange={(e)=>{setEmail(e.target.value)}}
                required
                />
                <TextField
                label="Password"
                variant="standard"
                type='password'
                onChange={(e)=>{setPassword(e.target.value)}}
                required
                />
                <span className='underline'>If you don't have an acount <a href="/signup">sign up</a></span>
                <Button onClick={handelSubmit} sx={{color: 'black', borderColor:'black'}} variant="outlined">Submit</Button>
            </div>
        </div>
        </>
    )
}
export default Login