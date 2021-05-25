const mongoose = require('mongoose');

const dataTrainingSchema = mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
    },
    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('DataTraining', dataTrainingSchema);
