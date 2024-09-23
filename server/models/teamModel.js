import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registration_number: { type: String, required: true, unique: true },
});

const teamSchema = new mongoose.Schema({
  team_name: { type: String, required: true, unique: true },
  team_id: { type: String, required: true, unique: true },
  team_member_size: { type: Number, required: true },
  team_members: [teamMemberSchema],

  // Fields for Round 1 file uploads
  report_file_path: { type: String, default: '' },  // Path to report file
  zip_folder_path: { type: String, default: '' },   // Path to zip folder

  // Field for idea assignment
  // idea_id: { type: Number, default: null }
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
