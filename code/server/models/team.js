const mongoose = require('mongoose');

const teamSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    member: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Competition',
    },

    audiosVerifiedId: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    // số audio mỗi đội phải thẩm định
    numberOfAudiotoVerify: {
      type: Number,
    },

    commitmentLink: {
      type: String,
    },

    resultSubmittedLink: {
      type: String,
    },

    reportSubmittedLink: {
      type: String,
    },

    voice: {
      type: String,
    },

    // mảng chứa các Id của các Test đã được manager xác nhận gửi kết quả test
    sentResultTestId: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Team', teamSchema);
