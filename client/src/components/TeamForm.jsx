import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const TeamForm = ({ setHasRegistered }) => { // Accept setHasRegistered as a prop
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [teamMembers, setTeamMembers] = useState([{ name: '', registrationNumber: '' }]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleMemberChange = (index, e) => {
    const newMembers = [...teamMembers];
    newMembers[index][e.target.name] = e.target.value;
    setTeamMembers(newMembers);
  };

  const addMember = () => {
    setTeamMembers([...teamMembers, { name: '', registrationNumber: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const membersData = teamMembers.map(member => ({
      name: member.name,
      registration_number: member.registrationNumber,
    }));

    try {
      const { data } = await axios.post('http://localhost:5000/api/teams/submit', {
        team_name: teamName,
        team_member_size: teamSize,
        team_members: membersData,
      });

      console.log('Team created', data);
      setSuccess('Team successfully created!');
      setHasRegistered(true); // Call setHasRegistered to indicate the user has registered a team
    } catch (error) {
      console.error('Error creating team', error);
      setError('Error creating team. Please try again.');
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/dashboard'); // Navigate to the dashboard after a delay
      }, 1000); // 2 seconds delay for displaying the success message

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [success, navigate]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Team Registration</h2>
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <div className="mb-3">
          <label className="form-label">Team Name:</label>
          <input
            type="text"
            className="form-control"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Team Size:</label>
          <input
            type="number"
            className="form-control"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Team Members:</label>
          {teamMembers.map((member, index) => (
            <div key={index} className="mb-3">
              <input
                type="text"
                name="name"
                className="form-control mb-2"
                placeholder="Member Name"
                value={member.name}
                onChange={(e) => handleMemberChange(index, e)}
                required
              />
              <input
                type="text"
                name="registrationNumber"
                className="form-control"
                placeholder="Registration Number"
                value={member.registrationNumber}
                onChange={(e) => handleMemberChange(index, e)}
                required
              />
            </div>
          ))}
          <button type="button" className="btn btn-secondary mb-3" onClick={addMember}>
            Add Member
          </button>
        </div>
        <button type="submit" className="btn btn-primary w-100">Submit</button>
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
      {success && (
        <div className="text-success text-center mt-3">
          <FaCheckCircle size={50} />
          <p>{success}</p>
        </div>
      )}
    </div>
  );
};

export default TeamForm;
