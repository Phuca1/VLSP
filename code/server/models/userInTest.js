const mongoose = require('mongoose');

const userInTestSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Test',
    },
    audioToEvaluate: [
      {
        _id: false,
        audioInTest: {
          type: mongoose.Schema.Types.ObjectId,
        },
        evaluated: {
          type: Boolean,
        },
        index: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('UserInTest', userInTestSchema);
