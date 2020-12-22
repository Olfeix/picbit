import React,{useEffect, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import firebase from "firebase";
import {db} from './firebase';
import './Post.css';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { useSpring, animated } from 'react-spring/web.cjs';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
   
const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && onEnter) {
          onEnter();
        }
      },
      onRest: () => {
        if (!open && onExited) {
          onExited();
        }
      },
    });
  
    return (
      <animated.div ref={ref} style={style} {...other}>
        {children}
      </animated.div>
    );
  });
  
  Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
  };  
function Post({username,postId,user, caption, imageUrl}) {
    const [modalStyle] = React.useState(getModalStyle);
    const [comments, setComments] = useState([]);
    const[comment, setComment] = useState("");
    const[open, setOpen] = useState(false);
    useEffect(()=> {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot)=>{
                setComments(snapshot.docs.map((doc)=> doc.data()));
            });
        }
        return ()=>{
            unsubscribe();
        };
    },[postId]);

    const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
        text:comment,
        username:user.displayName,
    timestamp : firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
    }
  const postDelete = (event) => {
      event.preventDefault();
       db.collection("posts").doc(postId).get()
      .then(function(doc) {
          if(doc.exists){
              var data= doc.data();
              var userDisplay = data.username;
              if(userDisplay === user.displayName) {
                db.collection("posts").doc(postId).delete()
              }
          }    
      })
  }
    return (
        <>   
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
          <Fade in={open}>
      <div style={modalStyle} className="image__modal">
      <img className="post__image" src={imageUrl} alt={username}/>
    </div>
    </Fade>
      </Modal>
        <div className="post" >
            <div className="post__header">
            <Avatar className="post__avatar"  alt={username} src="/static/images/avatar/1.jpg"/>
            <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} onClick={()=>setOpen(true)} alt={username}/>
            <div className="post__section">
    <h4 className="post__text"><strong>{username}</strong>{caption} </h4>

    {username && (
         <div className="post__delete">
         <IconButton  onClick={postDelete} aria-label="delete">
       <DeleteIcon fontSize="large" />
       </IconButton>
       </div>
    )}
 
    </div>
   {comments.map((comment)=> (
      
       <h5 className="post__comments" key={comment.username} >
           <strong>{comment.username}</strong>{comment.text}
       </h5>
      
   ))}
  
  {username && (
  <form className="post__commentBox">
  <input className="post__input"
  type="number" placeholder="add a rating..."
  value={comment} onChange={(e)=>setComment(e.target.value)}
  />
  <button disabled={!comment}
  className="post__button" type="submit"
  onClick={postComment}>Post</button>
</form>
  )}
  
        </div>
      
        </>
    )
}

export default Post
