
import { initializeApp } from "firebase/app";
import { 
    getFirestore,collection, onSnapshot, addDoc, deleteDoc, doc,query, orderBy, serverTimestamp, updateDoc
} from "firebase/firestore";
import { 
    getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBF-NSKn85c8qGFB_ey8ZJjuFI_ACmPtKY",
    authDomain: "nija-firebase.firebaseapp.com",
    projectId: "nija-firebase",
    storageBucket: "nija-firebase.appspot.com",
    messagingSenderId: "615436899031",
    appId: "1:615436899031:web:4eeae0e3233601782ed692"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore();
const auth = getAuth();

// Collection ref
const colRef = collection(db,'books');

//  Query
const q = query(colRef,orderBy('createdAt','desc'));

// Realtime get collection data *
onSnapshot(q, (snapshot)=>{
    let books =[];
    snapshot.docs.forEach((doc)=>{
        books.push({...doc.data(),id : doc.id});
    })
    console.log(books);
});

//  Adding Document
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    addDoc(colRef,{
        title : addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt : serverTimestamp()
    })
    .then(()=>addBookForm.reset());
})

//  Deleting Document
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const colRef = doc(db,'books',deleteBookForm.id.value);
    deleteDoc(colRef).then(()=>deleteBookForm.reset());
});

//  Get Single document
const colRefSingle = doc(db,'books','wH4awmHEvaHmjop2OCF3');
onSnapshot(colRefSingle,(single)=>{
    console.log(single.data(),single.id)
});

//  Update Document
const updateBookForm = document.querySelector('.update');
updateBookForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const colRef = doc(db,'books',updateBookForm.id.value);
    updateDoc(colRef,{
        title : "update-title"
    })
    .then(()=>{
        updateBookForm.reset()
    });
}); 

//  Signup
const singupForm = document.querySelector('.signup');
singupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = singupForm.email.value;
    const password = singupForm.password.value;
    createUserWithEmailAndPassword(auth,email,password)
    .then((credential)=>{
        console.log(credential.user);
    })
    .catch((error)=>{
        console.log(error.message)
    });
});  

//  Login
const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    signInWithEmailAndPassword(auth,email,password)
    .then((credential)=>{
        // console.log('The user is login right now',credential.user)
    })
    .catch((error)=>{
        console.log(error.message)
    })
}); 

//  Logout
const logoutForm = document.querySelector('.logout');
logoutForm.addEventListener('click',(e)=>{
    signOut(auth)
    .then(()=>{
        // console.log('The user log out right now');
    })
    .catch((error)=>{
        console.log(error.message)
    });
}); 

//  Subscribe to Auth changes
onAuthStateChanged(auth,(status)=>{
    console.log('Current user status is ',status);
});

//  Unsubscribe from changes (auth and db)
// const unsub = document.querySelector('.unsub');
// unsub.addEventListener('click',()=>{
//     console.log('unsubscribing ... ');
//     unsubCol();
//     unsubDoc();
//     unsubAuth();
// });
