const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    actived: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 32,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    job: {
      type: String,
    },
    role: {
      type: String, // admin || manager || user
      default: 0,
    },
    competitions: [
      {
        _id: false,
        competitionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Competition',
        },
        teamId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Team',
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);
