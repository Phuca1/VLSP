const audioInCompetitionDAO = require('../daos/audioInCompetition');
const teamDAO = require('../daos/team');
const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');

const getAudioInCompetitionById = async (audioInCompetitionId) => {
  const audioInCompetition =
    await audioInCompetitionDAO.findOneAudioIncompetition(audioInCompetitionId);
  return audioInCompetition;
};

const getAudioForTeamToVerify = async (teamId) => {
  const team = await teamDAO.findOneTeam(teamId);
  const audios = await audioInCompetitionDAO.findAudiosInCompetition({
    competitionId: team.competitionId,
  });

  const audioValid = audios
    .filter((audio) => {
      if (team.audiosVerifiedId.includes(audio.id)) {
        console.log('audio verified here: ', audio.id);
        return false;
      }
      return true;
    })
    .sort(function (firstAudio, secondAudio) {
      return firstAudio.totalVerifiedTimes - secondAudio.totalVerifiedTimes;
    });
  // console.log('audio valid:', audioValid);

  const audio =
    audioValid.length >= 3
      ? audioValid.slice(0, 3)[Math.floor(Math.random() * 3)]
      : audioValid[0];

  return { audio };
};

//khi 1 team nào đó gõ lại text của audio và gửi về
const inputContentAudio = async ({
  teamId,
  audioInCompetitionId,
  sentenceContent,
}) => {
  // console.log(teamId, audioIndex, sentenceContent);
  const team = await teamDAO.findOneTeam(teamId);
  const currentAudio = await audioInCompetitionDAO.findOneAudioIncompetition(
    audioInCompetitionId,
  );

  if (!team) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy đội của bạn');
  }

  if (!currentAudio) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy audio');
  }

  // B1: update audioInCompetition
  currentAudio.sentences.push({
    teamId: team.id,
    teamName: team.name,
    content: sentenceContent,
    numberOfVotes: 0,
  });

  currentAudio.totalVerifiedTimes += 1;

  // B2 : update team.audiosVerifiedId
  team.audiosVerifiedId.push(audioInCompetitionId);

  await team.save();
  await currentAudio.save();

  return { message: 'Thẩm định thành công' };
};

const voteForAudio = async ({
  teamId,
  audioInCompetitionId,
  teamGainVoteId,
}) => {
  const team = await teamDAO.findOneTeam(teamId);
  const currentAudio = await audioInCompetitionDAO.findOneAudioIncompetition(
    audioInCompetitionId,
  );

  if (!team) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy đội của bạn');
  }

  if (!currentAudio) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy audio');
  }

  // B1: update số vote và số tương tác ở bên audioInCompetition
  const targetSentenceGainVoteIndex = currentAudio.sentences.findIndex(
    (sentence) => {
      if (sentence.teamId.toString() === teamGainVoteId) {
        return true;
      }
      return false;
    },
  );
  if (targetSentenceGainVoteIndex === -1) {
    throw new CustomError(
      codes.NOT_FOUND,
      'Không tìm thấy đội đã thẩm định audio này',
    );
  }

  currentAudio.sentences[targetSentenceGainVoteIndex].numberOfVotes += 1;
  currentAudio.totalVerifiedTimes += 1;

  // B2: update là team đã verify audio này rồi

  team.audiosVerifiedId.push(audioInCompetitionId);

  await team.save();
  await currentAudio.save();

  return { message: 'Thẩm định thành công' };
};

const getAudiosInOneCompetition = async (competitionId) => {
  const audiosInCompetition =
    await audioInCompetitionDAO.findAudiosInCompetition({ competitionId });
  return { audiosInCompetition };
};

module.exports = {
  getAudioInCompetitionById,
  inputContentAudio,
  voteForAudio,
  getAudioForTeamToVerify,
  getAudiosInOneCompetition,
};
