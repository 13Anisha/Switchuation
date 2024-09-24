// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from 'axios'; // Axios for making requests to the backend

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDUxF7iWiCw51FggrLBzDkdKNvsSTZ9Fyk",
    authDomain: "switchuation-9cc71.firebaseapp.com",
    projectId: "switchuation-9cc71",
    storageBucket: "switchuation-9cc71.appspot.com",
    messagingSenderId: "818180337960",
    appId: "1:818180337960:web:cb90713ea7c17b4d7ca01d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and setup Google provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Function to handle Google Sign-In
const signInWithGoogle = () => {
  return signInWithPopup(auth, provider)
    .then(async (result) => {
      // Successful sign-in
      const user = result.user;
      const email = user.email;

      // Check if the email ends with @vitstudent.ac.in
      if (email.endsWith('@vitstudent.ac.in')) {
        console.log('User signed in:', user);

        // Send the user email to the backend to store in MongoDB
        try {
          await axios.post('https://switchuation.onrender.com/api/users', { email });
          console.log('User sent to backend for storage');
        } catch (error) {
          console.error('Error sending user to backend:', error);
        }

        return user; // User stays signed in
      } else {
        // If the email domain is not allowed, delete the user account immediately
        return user.delete().then(() => {
          console.error('Invalid email domain. User account deleted. Please use a @vitstudent.ac.in email.');
          alert('Invalid email domain. Please use a @vitstudent.ac.in email.');
        }).catch((error) => {
          console.error('Error deleting user:', error);
        });
      }
    })
    .catch((error) => {
      // Handle errors here
      console.error('Error during sign-in:', error);
    });
};

export { signInWithGoogle, auth };
