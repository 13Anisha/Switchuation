import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideBarDash from './SideBarDash';

const Dashboard = ({ currentUser }) => {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('https://switchuation.onrender.com/api/teams');
        setTeams(response.data);
      } catch (error) {
        setError('Failed to fetch teams.');
      }
    };
    fetchTeams();
  }, []);

  const shuffleIdeas = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true); // Start loading

    try {
      const response = await axios.post('https://switchuation.onrender.com/api/teams/shuffle');
      if (response.data.message === 'Zip and report files shuffled successfully') {
        const updatedTeams = await axios.get('https://switchuation.onrender.com/api/teams');
        setTeams(updatedTeams.data);
        setSuccess('Ideas and PDFs shuffled successfully!');
      } else {
        throw new Error('Shuffling failed');
      }
    } catch (error) {
      setError('Failed to shuffle ideas.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const getFileName = (filePath) => {
    return filePath.split('/').pop(); // Extract file name
  };

  return (
    <div style={{ display: 'flex' }}>
      <SideBarDash />
      <main style={{ padding: '20px', flex: 1 }}>
        <h2 className="mb-4">Team Dashboard</h2>

        {currentUser && currentUser.isAdmin && teams.length > 1 && (
          <button onClick={shuffleIdeas} className="btn btn-primary mb-3">Shuffle</button>
        )}

        {loading && <p>Shuffling in progress...</p>}
        {success && <p className="text-success">{success}</p>}
        {error && <p className="text-danger">{error}</p>}

        {/* Responsive table */}
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover mt-4">
            <thead className="thead-dark">
              <tr>
                <th>Team Name</th>
                <th>Team ID</th>
                <th>ZIP Folder</th>
                <th>Report File</th>
              </tr>
            </thead>
            <tbody>
              {teams.length > 0 ? (
                teams.map(team => (
                  <tr key={team.team_id}>
                    <td>{team.team_name}</td>
                    <td>{team.team_id}</td>
                    <td>
                      {team.zip_folder_path ? (
                        <a href={`https://switchuation.onrender.com/${getFileName(team.zip_folder_path)}`} className="btn btn-link">
                          {getFileName(team.zip_folder_path)}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {team.report_file_path ? (
                        <a href={`https://switchuation.onrender.com/${getFileName(team.report_file_path)}`} className="btn btn-link">
                          {getFileName(team.report_file_path)}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No teams available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
