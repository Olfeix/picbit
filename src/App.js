import React, {useState, useEffect} from 'react';
import Logo from './logo.png';
import Post from './post';
import './App.css';
import {db, auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import {Button} from '@material-ui/core';
import {Input} from '@material-ui/core';
function getModalStyle() {
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
    width: '60%',
    height:'auto',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const[open, setOpen] = useState(false);
  const[openSignIn, setOpenSignIn] = useState(false);

   const [email, setEmail] = useState(''); 
   const [password, setPassword] = useState('');
   const [username, setUsername] = useState('');
  const [user, setUser]= useState(null);
   useEffect(()=> {
  const unsubscribe = auth.onAuthStateChanged((authUser)=> {
    if (authUser) {
    setUser(authUser);
    }else {
     setUser(null);
    }
  });

    return () => {
      //perform some cleanup
      unsubscribe();
    }

   },[user, username]);


useEffect(()=> {
 db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
   setPosts(snapshot.docs.map(doc => ({id:doc.id,
    post:doc.data()})));
 })
},[]);

//refresh function


const clearInput = () => {
  setUsername("");
  setEmail("");
  setPassword("");
};


 const signUp = (event) => {
  event.preventDefault();

  auth.createUserWithEmailAndPassword(email,password)
  .then((authUser)=> {
   return authUser.user.updateProfile({
      displayName:username+ '#' + Math.floor(Math.random() * 100)
    })
  })
  .catch((error)=>alert(error.message));
      clearInput();
    setOpen(false);
    setTimeout(()=>{
      window.location.reload();
     },4000);
   
 }

 const signIn = (event) => {
   event.preventDefault();
   auth.signInWithEmailAndPassword(email,password)
   .catch((error)=>alert(error.message))

   clearInput();
   setOpen(false);
  
 }


  return (
    <div className="App">
         <Modal
        open={open}
        onSubmit={()=>setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
      <center>
      <img className="app_headerImage" src={Logo}  alt="logo"/>
      </center>
      <Input placeholder="email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <Input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <Input placeholder="username" type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
      <Button type="submit" onClick={signUp}>Sign Up</Button>
      </form>
    </div>
      </Modal>

      <Modal
        open={openSignIn}
        onSubmit={()=>setOpenSignIn(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
      <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
      <center>
      <img className="app_headerImage" src={Logo}  alt="logo"/>
      </center>
      <Input placeholder="email" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
      <Input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <Button type="submit" onClick={signIn}>Log In</Button>
      </form>
    </div>
      </Modal>


    <div className="app__header">
    <img className="app_headerImage" src={Logo}  alt="logo"/>
    {user ? (
              <Button onClick={()=>auth.signOut()}>Log Out</Button>
         ) : (
           <div className="app__loginContainer">
          <Button onClick={()=>setOpenSignIn(true)}>Log In</Button>
          <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
         )}
      
         </div>
       

   <div className="section">
  {posts.map(({post,id}) => (
    <Post key={id} user={user} username={post.username} postId={id} caption={post.caption} imageUrl={post.imageUrl}/>
  
  ))}
  </div>
    </div>
  );
}

export default App;
