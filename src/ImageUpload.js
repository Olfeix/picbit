import React, {useState} from 'react'
import {db,storage} from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';


const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
    button: {
        margin: theme.spacing(1),
      },
  }));

  
function ImageUpload({username}) {
    const classes = useStyles();
    const[image,setImage] = useState(null);
    const[progress, setProgress]= useState(0);
    const[caption, setCaption] = useState('');

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }
    const clearInput = () => {
   
            setImage(null);
        
       
      };

   const handleUpload = () => {
  const uploadTask = storage.ref(`images/${image.name}`).put(image);
  uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setProgress(progress);
      },
      (error) => {
        //   error function
        console.log(error);
        alert(error.message);
      },
      () => {
        //   complete function
      //   complete function
      storage
      .ref("images")
      .child(image.name)
      .getDownloadURL()
     .then(url=> {
         //post image on db
         db.collection("posts").add({
             timestamp: firebase.firestore.FieldValue.serverTimestamp(),
             caption:caption,
             imageUrl:url,
             username:username
         });
      
     });
     setProgress(0);
     setCaption("");
    clearInput();

      }
  );

   };

    return (
        
        <div className="imageupload">
            {/** 
        <progress className="imageupload_progress" value={progress} max="100"/>
            **/}
        <form>
            <input type="text" placeholder="add a caption..." value={caption}
            onChange={event => setCaption(event.target.value)}
            />
            <label style={{marginTop:"-1px"}}>
          <input onChange={handleChange} accept="image/*" className={classes.input} id="icon-button-file" type="file" />
        <IconButton color="primary" aria-label="upload picture" component="span">
          <PhotoCamera />
        </IconButton>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={handleUpload}
      >
        Send
      </Button>
      </label>
      </form>
      
        
           
           
        </div>
    
    )
}

export default ImageUpload;
