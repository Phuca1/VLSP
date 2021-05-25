const mongoose = require('mongoose');

//audio for training data

audioInCompetitionSchema = new mongoose.Schema({
  audioLink: {
    type: String,
    required: true,
  },
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  //số lượng tương tác với audio này
  totalVerifiedTimes: {
    type: Number,
    default: 0,
  },

  sentences: [
    {
      _id: false,
      teamId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      teamName: {
        type: String,
      },
      content: {
        type: String,
      },
      numberOfVotes: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model('AudioInCompetition', audioInCompetitionSchema);
