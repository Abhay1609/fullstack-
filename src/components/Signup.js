import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function Signup() {
const navigate=useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const[email,setEmail]=useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    try {
        const response = await axios.post('http://localhost:8000/api/signup/', { username, password,email });
      const access = response.data.access;
      const refresh=response.data.refresh;
      const id=response.data.id;
      //save user data 
        localStorage.setItem('access',JSON.stringify(access));
      localStorage.setItem('refresh',JSON.stringify(refresh));
      localStorage.setItem('user',JSON.stringify(username));
      localStorage.setItem('id',JSON.stringify(id))

      navigate('/');
    } catch (error) {
      setError('Error signing up');
    }
  };

  return (
    <div className='body'>
    <div className="logincard">
    <div className='x'><h2>SignUp</h2>
      <Link to='/' className='ink'>X</Link></div>
      <div className="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" placeholder="Enter your username"  value={username} onChange={(e) => setUsername(e.target.value)}/>
      </div>
      <div className="form-group">
        <label for="email">Email:</label>
        <input type="text" id="email" name="username" placeholder="Enter your Email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>

      <div className="form-group">
        <label for="password">Password:</label>
        <input type="password" placeholder="Enter your username" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div className="btn-container">
        
        <button type="submit" className="btn" onClick={handleSignup}>Signup</button>
      </div>
      <span >Already Have Account? <span ><Link to="/login"> Login</Link></span></span>

 
    </div>
    </div>

  );
}

export default Signup;
