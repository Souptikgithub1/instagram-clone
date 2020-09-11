import { Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post/Post';
import { db, auth } from './config/firebaseConfig';

import InstaModal from './components/Modal/Modal';
import ImgUpload from './components/ImgUpload/ImgUpload';

import ImgAvatar from './components/ReusableComponents/ImgAvatar';
import Fab from '@material-ui/core/Fab';

const App = () => {

  const [typeOfModal, setTypeOfModal] = useState('signup');
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username] = useState('');
  const [isImgUploadModalOpen, setIsImgUploadModalOpen] = useState(false);
  

  const [user, setUser] = useState(null);

  useEffect(() => {
    
  }, []);

  // fetching posts
  useEffect(() => {
    let count = 0;
    window.addEventListener('scroll', (e) => {
      if (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight) {
        count += 2 
        console.log(count);
      }
    });
    
    const postCollection = db.collection('posts');
      postCollection.get().then(snap => console.log(snap.size));
      postCollection
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        if (snap.docs.length === 0) {
          setPosts(null);
        } 
        setPosts(snap.docs.map(doc => {
          return {...doc.data(), postId: doc.id};
        }));
      });

  }, []);

  //fetching authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (!!authUser) {
        setUser(authUser);
        console.log(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [user, username]);


  const openAuthModal = (e, authType) => {
    e.preventDefault();
     
    setTypeOfModal(authType);
    setIsModalOpen(true);
  }

  const handleSignup = (username, email, password) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser
                  .user
                  .updateProfile({ displayName: username})
                  .then(() => setIsModalOpen(false));
      })
      .catch(err => alert(err));
  }

  const handleLogin = (email, password) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setIsModalOpen(false);
      })
      .catch(err => alert(err.message));
  }

  return (
    <div className="App">
      <div className="app-header">
        <div className="img-container">
          <img src="https://firebasestorage.googleapis.com/v0/b/firegram-sk.appspot.com/o/instagram-text-logo.png?alt=media&token=e2d26a56-1a3c-4e6a-b09f-b4b91f7a15e8" alt="" className="app-header-img"/>
        </div>
        

        { !!user ? (
            <div 
              className="login__signup__btn"
              >
              <Button onClick={(e) => auth.signOut()}>Logout</Button>
              <ImgAvatar 
                spacing={4}
                alt={user.displayName}  
              />
                
            </div>
          ) : (
            <div className="login__signup__btn">
              <Button onClick={(e) => openAuthModal(e, 'login')} >Login</Button>
              <Button onClick={(e) => openAuthModal(e, 'signup')} >Signup</Button>
            </div>
          )
        }
        </div>
      <div className="content__section">

        
        
        <div className="post__container">
        { posts.length > 0 ?
          posts.map((post, id) => {
            return (
              <Post key={id} postId={post.postId} loggedInUser={user} {...post}  /> 
            )
          })
          : !posts ? <div className="posts__zero__level">No posts Yet</div> : ''
        }
        </div>
      </div>
      {!!user 
          ? <div className="add__post__btn__container">
              <Fab variant="extended" className="add__post__btn" onClick={(e) => setIsImgUploadModalOpen(true)} >
                Add Post
              </Fab>
            </div>
          : ''
      }
      {!!user 
          ? 
            <ImgUpload 
              user={user}
              isImgUploadModalOpen={isImgUploadModalOpen}
              setIsImgUploadModalOpen={e => setIsImgUploadModalOpen(e)}
            /> 
          : ''}
      <InstaModal
        modalType={typeOfModal}
        isModalOpen={isModalOpen}
        setIsModalOpen={(e) => setIsModalOpen(e)} 
        onSignup={handleSignup}
        onLogin={handleLogin} />
    </div>
  );
}

export default App;
