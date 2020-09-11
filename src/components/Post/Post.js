import React, { useState, useEffect } from 'react'
import './Post.css';
import { db, timestamp } from '../../config/firebaseConfig';
import ImgAvatar from '../ReusableComponents/ImgAvatar';

import { motion } from  'framer-motion';

const Post = ({ postId, caption, imgUrl, username, loggedInUser }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);

    // getting comments
    useEffect(() => {
        let unsubscribe;
        
        if (!!postId) {
            unsubscribe = db.collection('posts')
                            .doc(postId)
                            .collection('comments')
                            .orderBy('timestamp', 'asc')
                            .onSnapshot(snapshot => {
                                setComments(snapshot.docs.map(doc => doc.data()));
                            });
        }

        return  () => unsubscribe();

    }, [postId]);

    // getting likes
    useEffect(() => {
        const unsub = db.collection('posts')
                        .doc(postId)
                        .collection('likes')
                        .onSnapshot(snapshot => {
                            setIsLiked(snapshot.docs.filter(doc => doc.data().userId === loggedInUser?.uid).length);
                            setLikes(snapshot.docs.map(doc => {
                                return {...doc.data(), likeId: doc.id};
                            }));
                        });
                        

        return () => unsub();
    }, [postId, loggedInUser?.uid]);

    const postComment = (e) => {
        e.preventDefault();
        db.collection('posts')
          .doc(postId)
          .collection('comments')
          .add({
              text: comment,
              username: loggedInUser.displayName,
              timestamp: timestamp()
          });
        setComment('');
    }

    const handleLike = (e) => {
        e.preventDefault();

        if (!loggedInUser) {
            return
        }

        const likeCollection = db.collection('posts')
        .doc(postId)
        .collection('likes');  

        if (likes.length > 0) {
            for (const like of likes) {
                if (like.userId === loggedInUser.uid) {
                    likeCollection.doc(like.likeId).delete();
                    setIsLiked(false);
                    return;
                }
            }
        }
        
        likeCollection.add({
            userId: loggedInUser.uid,
            username: loggedInUser.displayName,
            timestamp: timestamp()
        });
        setIsLiked(true);
    }

    const handleImageDblClickLike = (e) => {
        e.preventDefault();
        
        if (!loggedInUser) {
            return
        }
        
        if (!isLiked) {
            handleLike(e);
        }
    }

    return (
            <motion.div 
                layout
                className="post"
                >
                    <div className="post__header">
                        <ImgAvatar 
                            spacing={4}
                            alt={username}  
                        />
                        <h3 className="post__header__username">{username}</h3>
                    </div>
                    <motion.img 
                        src={imgUrl}
                        alt="" 
                        className="post__img"
                        onDoubleClick={handleImageDblClickLike}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}/>
                    {
                        loggedInUser &&
                            <div className="post__action_btns">
                                <span className="material-icons fav__icon" style={!!isLiked ? {color:'#f00'} : {}} onClick={handleLike}>
                                    {!!isLiked ? 'favorite' : 'favorite_border'}
                                </span>
                            </div>
                    }
                    {
                         <span className="no__of__likes">{ likes.length } {likes.length === 1 ? 'like' : 'likes'}</span>
                    }
                    {!!caption && <h4 className="post__text"> <strong>{username}</strong> { caption }</h4>}

                    <div className="post__comments">
                        {
                            !!comments &&
                            comments.map((cmnt, index) => {
                                return (
                                    <div className="post__comment" key={index} >
                                        <strong>{ cmnt.username }</strong> {cmnt.text}
                                    </div>
                                )
                            })
                        }
                    </div>

                    {!!loggedInUser &&
                        <form className="post__form" >
                            <input 
                                type="text" 
                                className="post__input"
                                placeholder="Add a comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)} />
                            <button 
                                className="comment__btn"
                                disabled={!comment}
                                type="submit"
                                onClick={postComment}
                            >Post</button>
                        </form>
                    }
            </motion.div>
    )
}

export default Post
