import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function PostForm() {
 const navigate=useNavigate();
  const [event_name, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [data, setData] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      const userId = localStorage.getItem('id');
      const formattedUser = userId.replace(/"/g, '');
    const formattedUserId = parseInt(formattedUser);
      
      if (!token || !userId) {
        console.error('Token or user ID not found in localStorage');
        return;
      }

      const combinedDateTime = `${date}T${time}:00Z`;
//append all data to formdata object
      const formData = new FormData();
      formData.append('event_name', event_name);
      formData.append('data', data);
      formData.append('location', location);
      formData.append('author',formattedUserId);
      formData.append('time', combinedDateTime);
      formData.append('image', image); 

      const headers = {
        'Authorization': `Bearer ${token.replace(/"/g, '')}`,
        'Content-Type': 'multipart/form-data',
      };

      await axios.post('http://localhost:8000/api/posts/', formData, { headers });

      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="post-form">
        <div className='x'><h2>Create Event</h2>
      <Link to='/' className='ink'>X</Link></div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Event Name" value={event_name} onChange={(e) => setEventName(e.target.value)} />
        <input type="text" placeholder="Enter Date" value={data} onChange={(e) => setData(e.target.value)} />
        <input type="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="time" placeholder="Time" value={time} onChange={(e) => setTime(e.target.value)} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PostForm;
