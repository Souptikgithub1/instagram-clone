import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal/Modal';
import { TextField, Button } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import './Modal.css';

  // function rand() {
  //   return Math.round(Math.random() * 20) - 10;
  // }
  
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
      position: 'absolute',
      width: 700,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(8, 4, 10),
      borderRadius: '4px',
      "&:focus": {
        "outline": 'none'
      }
    },
  }));

const InstaModal = ({modalType = 'signup', isModalOpen = false, setIsModalOpen, onSignup, onLogin}) => {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {

      if (!isModalOpen) {
        setUsername('');
        setEmail('');
        setPassword('');
      }
    }, [isModalOpen]);

    const handleClose = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setIsModalOpen(false);
    };

    const handleSignup = (e) => {
      e.preventDefault();
      modalType === 'signup'
        ? onSignup(username, email, password)
        :  onLogin(email, password);
    }

    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
        <div style={modalStyle} className={classes.paper}>
        <div style={{position: "absolute", top: 0, right: 0, padding: 15, cursor: "pointer"}} onClick={handleClose}><ClearIcon/></div>
          <center>
            <img 
              className="app-header-img"
              style={{paddingBottom:'40px'}} 
              src="https://firebasestorage.googleapis.com/v0/b/firegram-sk.appspot.com/o/instagram-text-logo.png?alt=media&token=e2d26a56-1a3c-4e6a-b09f-b4b91f7a15e8" alt="" />
          </center>
          <center>
            <form style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              {
                modalType === 'signup' 
                  ? <TextField
                      className="inputField" 
                      id="standard-basic" 
                      label="Username" 
                      type="text"
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}/>
                  : ''
              }
              <TextField 
                className="inputField" 
                id="standard-basic" 
                label="email" 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} />
              <TextField 
                className="inputField" 
                id="standard-basic" 
                label="password" 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} />
              <Button 
                className="inputField submitBtn" 
                type="submit" 
                variant="outlined" 
                onClick={e => handleSignup(e)}>
                { modalType === 'login' ? 'Login' : 'signup' }
              </Button>
            </form>
          </center>
        </div>
      </Modal>
    )
}

export default InstaModal
