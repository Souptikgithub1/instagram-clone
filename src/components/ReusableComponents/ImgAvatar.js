import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';



const ImgAvatar = ({spacing = 3, alt, src = "/static/images/avatar/1.jpg"}) => {
    const useStyles = makeStyles((theme) => ({
        root: {
          display: 'flex',
          '& > *': {
            margin: theme.spacing(1),
          },
        },
        size: {
          width: theme.spacing(spacing),
          height: theme.spacing(spacing),
          fontSize: theme.spacing(spacing/2),
          fontWeight: theme.spacing(spacing/2)
        }
    }));
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Avatar 
                alt={alt} 
                src={src} className={classes.size} />            
        </div>
    )
}

export default ImgAvatar
