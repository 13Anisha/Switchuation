import express from 'express';
import multer from 'multer';
import path from 'path';
import Team from '../models/teamModel.js'; // Adjust path as needed

const router = express.Router();

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Save all files directly in the uploads folder
  },
  filename: (req, file, cb) => {
    // Use original name and append a timestamp to avoid name clashes
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Use original name with a unique prefix
  },
});

const upload = multer({ storage }); // Use custom storage

// Route to upload Round 4 files (zip-folder and report-file)
router.post('/round4/submit', upload.fields([
  { name: 'zip-folder', maxCount: 1 },
  { name: 'report-file', maxCount: 1 }
]), async (req, res) => {
  const { 'team-id': teamId } = req.body;
  console.log('Received Team ID:', teamId);

  if (!teamId || !req.files || !req.files['zip-folder'] || !req.files['report-file']) {
    return res.status(400).json({ message: 'Team ID and files are required.' });
  }

  try {
    // Check if the team exists
    const team = await Team.findOne({ team_id: teamId });
    if (!team) {
      return res.status(404).json({ message: 'Team not found.' });
    }

    // Save the uploaded file paths in the team document
    team.report_file_path = path.join('uploads', req.files['report-file'][0].filename); // Save report file path
    team.zip_folder_path = path.join('uploads', req.files['zip-folder'][0].filename);   // Save zip folder path

    await team.save(); // Save changes to the database

    res.status(201).json({ message: 'Files uploaded successfully!' });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Error uploading files.' });
  }
});

export default router;
