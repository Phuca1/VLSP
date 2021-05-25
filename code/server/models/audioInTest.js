const mongoose = require('mongoose');

//audio for training data

audioInTestSchema = new mongoose.Schema(
  {
    // initial

    audioLink: {
      type: String,
      required: true,
    },

    name: {
      type: String,
    },

    sentenceLink: {
      type: String,
    },

    testId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Test',
    },

    voice: {
      type: String,
    },

    sentence: {
      type: String,
    },

    //update

    numberOfRate: {
      type: Number,
    },

    averagePoint: {
      type: Number,
    },

    users: [
      {
        _id: false,
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        transcript: {
          type: String,
        },
        numberOfVotes: {
          type: Number,
        },
        point: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('AudioInTest', audioInTestSchema);
