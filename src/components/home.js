import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Home() {
// define all states
  const [allPosts, setAllPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [showAllPosts, setShowAllPosts] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  //isLiked function return true if user like post
  const isLiked = (like) => {
    const userId = localStorage.getItem('id');
    if (!userId) {
        console.error('User ID not found in localStorage');
        return false;
    }
    const formattedUserId = parseInt(userId.replace(/"/g, ''));
    const likedSet = new Set(like);
    return likedSet.has(formattedUserId);
};

//it use to handle like of an event only authenticate user can like
const handleLike = async (postId, like, fun) => {
    try {

        let accessToken = localStorage.getItem('access');
        if (!accessToken) {
        return;
        }
         const headers = {
            'Authorization': `Bearer ${accessToken.replace(/"/g, '')}`
        };
        const action = isLiked(like) ? "dislike" : "like";
        const response = await fetch(`http://localhost:8000/api/posts/${postId}/${action}/`, {
            method: 'POST',
            headers: headers
        });

        if (response.ok) {
             fun();
        } else if (response.status === 401) {
            accessToken = await refreshToken();
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken.replace(/"/g, '')}`;
                const retryResponse = await fetch(`http://localhost:8000/api/posts/${postId}/${action}/`, {
                    method: 'POST',
                    headers: headers
                });
                if (retryResponse.ok) {
                    fun();
                } else {
                    console.error('Failed to fetch useer posts after token refresh:', retryResponse.statusText);
                }
            } else {
                console.error('Failed to refresh access token');
            }
        } else {
            console.error('Failed to fetch user posts:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user posts:', error.message);
    }
}

const navigate=useNavigate(); 
//It handle SignOUt
const handleSignOut = () => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('id');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      navigate('/');
    };
//It is for get access token from refresh token when expired
const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh').replace(/"/g, '');
        if (!refreshToken) {
            console.error('Refresh token not found in localStorage');
            return null;
        }
       
        const response = await axios.post('http://127.0.0.1:8000/api/token/verify/', { "token":refreshToken.replace(/"/g, '')});

        if (response.ok) {
            const data = await response.json();
            const newAccessToken = data.access_token;
            localStorage.setItem('access', newAccessToken);
            return newAccessToken;
        } else {
            console.error('Failed to refresh access token:', response.statusText);
            return null;
        }
    } catch (error) {
         console.error('Error refreshing access token:', error.message);
        return null;
    }
}
//it use to all some function which call on Change

useEffect(() => {
    const checkLogin = async () => {
        try {
            const accessToken = localStorage.getItem('access'.replace(/"/g, ''));

            if (accessToken) {
                 const response = await axios.post('http://127.0.0.1:8000/api/token/verify/', { "token":accessToken.replace(/"/g, '')});

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    var userna=localStorage.getItem('user')
                    setUsername(userna.replace(/"/g, ''))

                } else {
                    setIsLoggedIn(false);
                    console.error('Token verification failed:', response.statusText);
                }
            } else {
                setIsLoggedIn(false);
                console.error('Access token not found');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {

                console.error('Unauthorized: Token verification failed');
            } else {
                 console.error('Error:', error.message);
            }
        }
    };
checkLogin();
fetchAllPosts();
}, []);
//handle delete of event
const handleDelete = async (postId) => {
    try {
        let accessToken = localStorage.getItem('access');
        if (!accessToken) {
            console.error('Access token not found in localStorage');
            return;
        }
    const headers = {
            'Authorization': `Bearer ${accessToken.replace(/"/g, '')}`
        };
        const response = await fetch(`http://localhost:8000/api/posts/${postId}/`, {
        method: 'DELETE',
        headers: headers,
      });
      if (response.ok) {
        const updatedPosts = posts.filter(post => post.id !== postId);
        setPosts(updatedPosts);
        fetchUserPosts()
      } else {
        console.error('Failed to delete post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };


//fetch all the posts/event from DB
  const fetchAllPosts = async () => {
    try {
    const response = await fetch('http://localhost:8000/api/posts/');
      if (response.ok) {
        const data = await response.json();
         setAllPosts(data);
} else {
        console.error('Failed to fetch posts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
  };
  //fetch post/event of specific user
const fetchUserPosts = async () => {
    try {
        let accessToken = localStorage.getItem('access');
         if (!accessToken) {
            return;
        }
const headers = {
            'Authorization': `Bearer ${accessToken.replace(/"/g, '')}`
        };
const userId = localStorage.getItem('id').replace(/"/g, '');
        
        const response = await fetch(`http://localhost:8000/api/posts/user/${userId}/`, {
            headers: headers
        });

        if (response.ok) {
            const data = await response.json();
            setUserPosts(data);
        } else if (response.status === 401) {
         accessToken = await refreshToken();

            }
        
        }
    catch (error) {
        console.error('Error fetching user posts:', error.message);
    }
};


  return (
    <div>
<nav className='navbar'>
      <ul>
        <li  className='login'> 
        {isLoggedIn ? (<Link to="/create-post" className='login'>Add Event</Link>) : (
                        <Link to="/login" className='login'>Add Event</Link>)}   

        </li>
        {isLoggedIn ? ( <>
                            <li className='login'>{username}</li>
                            <li className='login' onClick={handleSignOut}>Logout</li>
                     </>
        ) : (

          <>
            <li className='login'><Link to="/login" className='login'>Login</Link></li>
            <li className='login'><Link to="/signup" className='login'>SignUp</Link></li>
          </>
        )}
      </ul>
      </nav>


      <main>
{isLoggedIn ?(
        <div className='toggle'>
          <button onClick={() => { setShowAllPosts(true); fetchAllPosts();  }} className='button'>All Posts</button>
          <button onClick={() => { setShowAllPosts(false); fetchUserPosts(); }} className='button'>My Posts</button>
        </div>):(<></>)}

        <div>
          {showAllPosts ? (
 <div className='card_body'>
 {allPosts.map(post => (
    
   <div key={post.event_name} className='card'>
     
     <img src={`http://localhost:8000/${post.image}`} alt="Post Image" className='card-image' />
     <h2 className='card-name'>{post.event_name}</h2>
     <p className='card-content'>{post.data}</p>
     <p className='time'>
       <span className='date-icon' style={{ color: '#000' }}>&#128197;</span> {post.time.slice(0, 10)} {/* Date */}
       <br />
       <span className='time-icon' style={{ color: '#000' }}>&#128337;</span> {post.time.slice(11, 19)} {/* Time */}
     </p>
     <p className='location'>
       <FontAwesomeIcon icon={faMapMarkerAlt} className='fa' /> {post.location}
     </p>

  <div className='heart' onClick={() => handleLike(post.id,post.likes,fetchAllPosts)}><svg className="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.54 0 3.04.73 4 1.88.96-1.15 2.46-1.88 4-1.88 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={isLiked(post.likes) ? "red" : "none"}stroke="black"/>
    </svg></div>

   </div>
 ))}
</div>) : (
 <div className='card_body'>
 {userPosts.map(post => (
   <div key={post.event_name} className='card'>
     
     <img src={`http://localhost:8000/${post.image}`} alt="Post Image" className='card-image' />
     <h2 className='card-name'>{post.event_name}</h2>
     <p className='card-content'>{post.data}</p>
     <p className='time'>
       <span className='date-icon' style={{ color: '#000' }}>&#128197;</span> {post.time.slice(0, 10)} {/* Date */}
       <br />
       <span className='time-icon' style={{ color: '#000' }}>&#128337;</span> {post.time.slice(11, 19)} {/* Time */}
     </p>
     <p className='location'>
       <FontAwesomeIcon icon={faMapMarkerAlt} className='fa' /> {post.location}
     </p>
     <div className='heart' onClick={() => handleLike(post.id,post.likes,fetchUserPosts)}><svg className="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.54 0 3.04.73 4 1.88.96-1.15 2.46-1.88 4-1.88 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={isLiked(post.likes) ? "red" : "none"}stroke="black"/>
    </svg></div>
    <div className="buttons">
    <div className='updel'>
      {/* Pass the post data as state to the Update component */}
      <button>
      <Link to="/update" state={ post }  className='update'>Update</Link>
      </button>
    
        <button onClick={() => handleDelete(post.id)} className='delete'>Delete</button>
      </div>
      </div>
     </div>
 ))}
    </div>)}
</div>
</main>
</div>
  );
}

export default Home;
