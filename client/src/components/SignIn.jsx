import React from 'react';
import { signInWithGoogle } from '../firebase';
import { FcGoogle } from 'react-icons/fc';  
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/team-registration');
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="bg-white p-4 rounded shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-4">Sign In</h2>
        <button
          onClick={handleGoogleSignIn}
          className="btn btn-dark w-100 d-flex align-items-center justify-content-center"
        >
          <FcGoogle className="me-2" /> 
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
