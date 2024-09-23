import express from 'express';
import Team from '../models/teamModel.js';
import { nanoid } from 'nanoid';
import mongoose from 'mongoose';

const router = express.Router();

// Helper function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Route to get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find({});
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error.message);
    res.status(500).json({ message: 'Error fetching teams.' });
  }
});

// Route to submit a new team
router.post('/submit', async (req, res) => {
  const { team_name, team_member_size, team_members } = req.body;

  if (!team_name || !team_member_size || !Array.isArray(team_members) || team_members.length === 0) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const team_id = nanoid(8); // Generate a unique team ID

  const team = new Team({
    team_name,
    team_id,
    team_member_size: parseInt(team_member_size),
    team_members,
  });

  try {
    const createdTeam = await team.save();
    res.status(201).json(createdTeam);
  } catch (error) {
    console.error('Error creating team:', error.message);
    res.status(500).json({ message: 'Error creating team. Please try again.' });
  }
});

// Route to shuffle zip and report files
// Route to shuffle zip and report files
router.post('/shuffle', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch all teams
    const teams = await Team.find({}).session(session);
    if (teams.length <= 1) {
      return res.json({ message: 'Not enough teams to shuffle' });
    }

    // Extract zip and report file paths as pairs
    const pairs = teams.map(team => ({
      _id: team._id,
      zip_folder_path: team.zip_folder_path,
      report_file_path: team.report_file_path,
    }));

    let validShuffle = false;
    let shuffledPairs;

    // Loop until we get a valid shuffle where no team gets its original files
    while (!validShuffle) {
      shuffledPairs = shuffleArray([...pairs]);
      validShuffle = shuffledPairs.every((shuffledPair, index) => {
        // Ensure the shuffled pair does not assign the original team's zip or report files
        return shuffledPair.zip_folder_path !== pairs[index].zip_folder_path &&
               shuffledPair.report_file_path !== pairs[index].report_file_path;
      });
    }

    // Perform bulk update in a single transaction
    const bulkOps = shuffledPairs.map((shuffledPair, idx) => ({
      updateOne: {
        filter: { _id: pairs[idx]._id },
        update: {
          $set: {
            zip_folder_path: shuffledPair.zip_folder_path,
            report_file_path: shuffledPair.report_file_path,
          },
        },
      },
    }));

    await Team.bulkWrite(bulkOps, { session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: 'Zip and report files shuffled successfully' });
  } catch (error) {
    // Log the error message and stack trace
    console.error('Error during shuffling:', error.message);
    console.error('Stack Trace:', error.stack);

    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    
    res.status(500).json({ message: 'Error shuffling files. Please try again.' });
  }
});


export default router;
