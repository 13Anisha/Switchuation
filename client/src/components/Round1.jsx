import React, { useState } from 'react';
import axios from 'axios';

const Round1 = () => {
  const [teamId, setTeamId] = useState('');
  const [zipFile, setZipFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('team-id', teamId);
    formData.append('zip-folder', zipFile);
    formData.append('report-file', reportFile);

    console.log('Submitting Team ID:', teamId);

    try {
      const response = await axios.post('https://switchuation.onrender.com/api/round1/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Files submitted successfully!');
    } catch (err) {
      console.error('Error submitting files:', err);
      setError('Error submitting files. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1 className="mt-4">Round 1 Form</h1>
      <p>Download the Round 1 template to submit your report file:</p>
      <a href="/files/switchuationRound1.pdf" className="btn btn-link" download>Report Template</a>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="form-group mb-3">
          <label htmlFor="team-id">Team Round ID:</label>
          <input
            type="text"
            className="form-control w-50" // Set width to 50%
            id="team-id"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="zip-folder">Upload ZIP Folder:</label>
          <input
            type="file"
            className="form-control-file"
            id="zip-folder"
            onChange={(e) => setZipFile(e.target.files[0])}
            accept=".zip"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="report-file">Upload Report File:</label>
          <input
            type="file"
            className="form-control-file"
            id="report-file"
            onChange={(e) => setReportFile(e.target.files[0])}
            accept=".pdf,.doc,.docx"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {error && <p className="text-danger mt-3">{error}</p>}
      {success && <p className="text-success mt-3">{success}</p>}
    </div>
  );
};

export default Round1;
