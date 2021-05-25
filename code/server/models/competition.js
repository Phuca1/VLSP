const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 40,
    },

    rules: {
      type: String,
      required: true,
    },

    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],

    // timeline

    timeline: {
      verifyData: {
        type: Boolean,
        required: true,
      },
      shareTrainingData: {
        type: Boolean,
        required: true,
      },
      submitResult: {
        type: Boolean,
        required: true,
      },
      test: {
        type: Boolean,
        required: true,
      },
      submitReport: {
        type: Boolean,
        required: true,
      },
    },

    // Join competition
    joinCompetitionStartDate: {
      type: Date,
    },

    joinCompetitionEndDate: {
      type: Date,
    },

    //task verify data :

    taskVerifyData: {
      audiosPerTeamToVerify: {
        type: Number,
      },

      minVotesToAcceptAudio: {
        type: Number,
      },

      verifyDataStartDate: {
        type: Date,
      },

      verifyDataEndDate: {
        type: Date,
      },

      threshold: {
        type: Number, // 0 -100 %
      },
    },

    // request data

    dataToShare: {
      dataTrainingId: {
        type: mongoose.Schema.Types.ObjectId,
      },

      dataDescription: {
        type: String,
      },

      commitmentTemplateLink: {
        type: String,
      },

      requestTeams: [
        {
          _id: false,
          teamId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          commitmentLink: {
            type: String,
          },
          accepted: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },

    //  submit result
    taskSubmitResult: {
      submitDescription: {
        type: String,
      },
      submitResultStartDate: {
        type: Date,
      },

      submitResultEndDate: {
        type: Date,
      },
      teamSubmitted: [
        {
          _id: false,
          teamId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          resultSubmittedLink: {
            type: String,
          },
        },
      ],
    },

    taskSubmitReport: {
      submitReportStartDate: {
        type: Date,
      },

      submitReportEndDate: {
        type: Date,
      },

      teamSubmitted: [
        {
          _id: false,
          teamId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          reportSubmittedLink: {
            type: String,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Competition', competitionSchema);
