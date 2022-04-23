import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import {auth} from '../Config/Config'
import {useNavigate} from 'react-router-dom'

export const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    const handleLogin=(e)=>{
        e.preventDefault();
        // console.log(email, password);
        auth.signInWithEmailAndPassword(email,password).then(()=>{
            setSuccessMsg('Login Successfull. You will now automatically get redirected to Home page');
            setEmail('');
            setPassword('');
            setErrorMsg('');
            setTimeout(()=>{
                setSuccessMsg('');
                navigate('/');
            },3000)
        }).catch(error=>setErrorMsg(error.message));
    }

    return (
        <div className='container'>
            <br></br>
            <br></br>
            <h1>Login</h1>
            <hr></hr>
            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>}
                  <form className="form-group" autoComplete="off" onSubmit={handleLogin}>
        <div className="deets">
          <label>Email ID</label>
          <input
            type="email"
            className="form-control"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          ></input>
        </div>
        <br></br>
        <div className="deets">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></input>
        </div>
        <br></br>

        <div className="btn-box">
          <span>
            Already have an account Sign In
            <Link to="/Signup" className="link">
              {" "}
              Here
            </Link>
          </span>
        </div>
        <br></br>
        <div className="btn-box">
          <button className="btn btn-success btn-md">Login</button>
        </div>
      </form>

            {errorMsg&&<>
                <br></br>
                <div className='error-msg'>{errorMsg}</div>                
            </>}
        </div>
    )
}