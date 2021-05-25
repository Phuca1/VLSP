const mongoose = require('mongoose');

const testSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    type: {
      type: String, // MOS test || transcript test
      trim: true,
    },

    competitionId: {
      type: String,
    },

    usersListenPerAudio: {
      type: Number,
    },

    numberOfTestSet: {
      type: Number,
    },

    access: {
      type: String, // public || private
    },

    dataDirPath: {
      type: String,
    },

    voices: [
      {
        type: String,
        trim: true,
      },
    ],

    audioTestSet: [
      {
        _id: false,
        audioSet: [
          {
            type: mongoose.Schema.Types.ObjectId,
          },
        ],
        assignedTimes: {
          type: Number,
        },
        index: {
          type: Number,
        },
      },
    ],

    // ref to User
    joinedUser: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    dateOpened: {
      type: Date,
    },

    dateClosed: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Test', testSchema);
