import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import bcrypt from "bcryptjs";
import './signup.css'
function Signup(){
    
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alert, setAlert] = useState()
    const navigate= useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(name&&lastname&&email&&password != ''){
            if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
                if(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)){
                    const hashedPassword = await bcrypt.hash(password, parseInt(import.meta.env.VITE_APP_HASHING_SALT));
                    const formData = {
                        name: name,
                        lastname: lastname,
                        email: email,
                        password: hashedPassword 
                    }
                    try {
                        const response = await fetch( import.meta.env.VITE_KEY_SIGNUP, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formData),
                          }).then((res)=>{
                            if(res.status === 200){
                                navigate('/', { replace: true });
                            }else if(res.status === 201){
                                setAlert(<Alert severity='error'>Email already exists!</Alert>)
                            }else{
                                setAlert(<Alert>Somethin went wrong!</Alert>)
                            }
                          })
                    } catch (error) {
                        console.log(error)
                    }
                }else{
                    setAlert(<Alert severity='warning'>The password is not strong enough!</Alert>)
                }
            }else{
                setAlert(<Alert severity='warning'>The email given is not real!</Alert>)
            }
        }else{
            setAlert(<Alert severity='warning'>One of the field is empty!</Alert>)
        }
    }
    return(
        <>
        <div className="signUpPage">

            <h1 className='signupTitle'>Sign Up</h1>
            <div className="signUpBox">
                <span>{alert===undefined? '': alert}</span>
                <TextField
                label="Name"
                id="standard-size-normal"
                variant="standard"
                onChange={(e)=>{setName(e.target.value)}}
                required
                />
                <TextField
                label="Lastname"
                id="standard-size-normal"
                variant="standard"
                onChange={(e)=>{setLastname(e.target.value)}}
                required
                />
                <TextField
                label="Email"
                id="standard-size-normal"
                type='email'
                variant="standard"
                onChange={(e)=>{setEmail(e.target.value)}}
                required
                />
                <TextField
                label="Password"
                id="standard-size-normal"
                type='password'
                variant="standard"
                onChange={(e)=>{setPassword(e.target.value)}}
                required
                />
                <Button onClick={handleSubmit} sx={{color: 'black', borderColor:'black'}} variant="outlined">Submit</Button>
            </div>
        </div>
        </>
    )
}
export default Signup