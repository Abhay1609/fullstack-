import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
function Update() {
  const navigate = useNavigate();
  const eventLocation = useLocation();
  const { state } = useLocation();
  const post = eventLocation.state;
  console.log(post);
//assign previous data in fields
  const [event_name, setEventName] = useState(post?.event_name || '');
  const [date, setDate] = useState(post?.time.slice(0, 10) || '');
  const [time, setTime] = useState(post?.time.slice(11, 19) || '');
  const [data, setData] = useState(post?.data || '');
  const [location, setLocation] = useState(post?.location || '');
  const [image, setImage] = useState(post?.image || null);
  const [newImage, setNewImage] = useState(null); 
//use to handle fields on change every times
  useEffect(() => {
    setEventName(post?.event_name || '');
    setDate(post?.time.slice(0, 10) || '');
    setTime(post?.time.slice(11, 19) || '');
    setData(post?.data || '');
    setLocation(post?.location || '');
    setImage(post?.image || null);
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      const userId = localStorage.getItem('id');
      const formattedUserId = parseInt(userId.replace(/"/g, ''), 10);

      if (!token || !userId) {
        console.error('Token or user ID not found in localStorage');
        return;
      }

      const combinedDateTime = `${date}T${time}:00Z`;
        const formData = new FormData();
      formData.append('event_name', event_name);
      formData.append('data', data);
      formData.append('location', location);
      formData.append('author', formattedUserId);
      formData.append('time', combinedDateTime);
      if (newImage) {
        formData.append('image', newImage);
      } 
    const headers = {
        'Authorization': `Bearer ${token.replace(/"/g, '')}`,
        'Content-Type': 'multipart/form-data',
      };
await axios.patch(`http://localhost:8000/api/posts/${post.id}/`, formData, { headers });

      navigate('/');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="post-form">
             <div className='x'><h2>Update Event</h2>
      <Link to='/' className='ink'>X</Link></div>
      <form onSubmit={handleSubmit}>
        {post && (
          <>
            <input type="text" placeholder="Event Name" value={event_name} onChange={(e) => setEventName(e.target.value)} />
            <input type="text" placeholder="Enter Date" value={data} onChange={(e) => setData(e.target.value)} />
            <input type="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
            <input type="time" placeholder="Time" value={time} onChange={(e) => setTime(e.target.value)} />
            <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <input 
              type="file" 
              accept="image/*"  
              onChange={(e) => setNewImage(e.target.files[0])} 
            />
            {image && (
              <div>
                <h3>Current Image:</h3>
                <img src={`http://localhost:8000/${image}`} alt="Current Event" className='card-image' />
              </div>
            )}
            <button type="submit">Submit</button>
          </>
        )}
      </form>
    </div>
  );
}

export default Update;
