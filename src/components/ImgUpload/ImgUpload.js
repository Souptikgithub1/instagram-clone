import { Button, TextField, makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import '../ImgUpload/ImgUpload.css';
import { db, storage } from '../../config/firebaseConfig';
import * as firebase from 'firebase';
import ProgressBar from '../ProgressBar/ProgressBar';
import ClearIcon from '@material-ui/icons/Clear';
import Modal from '@material-ui/core/Modal/Modal';




const getModalStyle = () => {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',  
        position: 'absolute',
        minWidth: 700,
        minHeight: 300,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(8, 4, 10),
        flexDirection: 'column',
        borderRadius: '4px',
        "&:focus": {
            "outline": 'none'
        }
    },
  }));

const ImgUpload = ({ user, isImgUploadModalOpen = false,  setIsImgUploadModalOpen}) => {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);


    useEffect(() => {

        if (!isImgUploadModalOpen) {
            setCaption('');
            setImage(null);
            setProgress(0);
        }
      }, [isImgUploadModalOpen]);

    const handleFileChange = (e) => {
        const imgFile = e.target.files[0];
        if (!!imgFile) {
            setImage(imgFile);
        }
    }

    const handleClose = () => {
        setCaption('');
        setImage(null);
        setProgress(0);
        setIsImgUploadModalOpen(false);
    };

    const handleUploadPost = () => {

        console.log('uploading post triggered');

        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on( 'state_changed', (snapshot) => {
                // progress function
                const completedPercentage = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(completedPercentage);
            },  (err) => {
                //error function
                console.log(err);
                alert(err.message);
            }, () => {
                // on complete upload function
                storage
                    .ref(`images/${image.name}`)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('posts')
                          .add({
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                caption,
                                imgUrl: url,
                                username: user.displayName, 
                                userEmail: user.email,
                                userId: user.uid
                          });

                        setProgress(0);
                        setCaption('');
                        setImage(null);

                        setIsImgUploadModalOpen(false);
                    });
            }

        )
    }

    return (
        <Modal
            open={isImgUploadModalOpen}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >

        <div style={modalStyle} className={classes.paper}>
            <div style={{position: "absolute", top: 0, right: 0, padding: 15, cursor: "pointer"}} onClick={handleClose}><ClearIcon/></div>
            <div className="add__post__form__header">Add Post</div>
            <div className="img__upload__section__container" >
                <div className="img__upload__section">
                    {
                        progress > 0 
                            ?   <div style={{width: '100%', margin: '10px 0'}}>
                                    <ProgressBar value={progress}/>
                                </div>
                            : ''
                    }
                    
                    <TextField 
                        style={{margin: '10px 0'}}
                        fullWidth
                        placeholder="Enter Captions Here"
                        type="text" 
                        value={caption} 
                        onChange={(e) => setCaption(e.target.value)}    
                    />
                    <div className="upload__form">
                        
                        
                        <input type="file" onChange={handleFileChange} />

                        <Button  variant="outlined" onClick={handleUploadPost}>Upload</Button>
                    </div>
                </div>
            </div>
        </div>
        
        </Modal>
        
    )
}

export default ImgUpload
