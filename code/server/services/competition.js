const CustomError = require('../errors/CustomError');

const decompress = require('decompress');
const fs = require('fs');
const uuid = require('uuid');
const moment = require('moment');

const competitionDAO = require('../daos/competition');
const audioInCompetitionDAO = require('../daos/audioInCompetition');
const dataTrainingDAO = require('../daos/dataTraining');
const teamDAO = require('../daos/team');
const userDAO = require('../daos/user');
const codes = require('../errors/code');
const mailer = require('../utils/mailer');
const { MAILER_EMAIL } = require('../config');

const createCompetition = async (info) => {
  const startDate = new Date(info.joinCompetitionStartDate);
  const endDate = new Date(info.joinCompetitionEndDate);
  if (startDate - endDate >= 0) {
    throw new CustomError(
      codes.DATE_TIME_INVALID,
      'Ngày bắt đầu phải trước ngày kết thúc',
    );
  }
  const competition = await competitionDAO.createCompetition(info);
  return competition;
};

const getCompetitions = async (condition) => {
  const competitions = await competitionDAO.findCompetitions(condition);
  // console.log('at competition service : ', competitions);
  return competitions;
};

const getOneCompetition = async (condition) => {
  const competition = await competitionDAO.findOneCompetition(condition);
  return competition;
};

const updateCompetitionById = async (competitionId, data) => {
  const competition = await competitionDAO.updateCompetitionById(
    competitionId,
    data,
  );
  return competition;
};

const createVerifyDataTask = async ({
  file,
  verifyDataTaskInfo,
  competitionId,
}) => {
  // console.log('At create verify data service :');
  // console.log(file, verifyDataTaskInfo, competitionId);

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const uid = uuid.v4();
  const folderName = `${year}-${month + 1}-${day}-${hour}:${min}-${uid}`;

  const extractedDataPath = `uploads/extracted/${folderName}`;

  const files = await decompress(file.path, extractedDataPath);
  fs.unlink(file.path, (err) => {
    if (err) {
      console.log('error unlink at create verify task:', err);
    }
  });
  // console.log('files:', files);
  const audioPaths = fs.readdirSync(extractedDataPath);
  console.log('audios:', audioPaths);

  if (verifyDataTaskInfo.audiosPerTeamToVerify > audioPaths.length) {
    fs.rmdir(extractedDataPath, { recursive: true }, (err) => {
      if (err) {
        console.log('error remove directory at create verify task:', err);
      }
    });
    throw new CustomError(
      codes.NOT_VALID_CONDITION,
      'Số audio mỗi đội thẩm định phải bé hơn toàn bộ số audio',
    );
  }

  // Tạo ra taskVerifyData trong competition

  const competition = await competitionDAO.updateCompetitionById(
    competitionId,
    { taskVerifyData: verifyDataTaskInfo },
  );

  // Assign audio for teams
  // B1 : Tạo ra các entity AudioInCompetition để lưu các audio trên
  const audios = await Promise.all(
    audioPaths.map(async (audio) => {
      return await audioInCompetitionDAO.createAudioInCompetition({
        audioLink: `${extractedDataPath}/${audio}`,
        competitionId,
      });
    }),
  );

  // B2 : thiết lập numberOfAudiotoVerify của các đội

  let listUsersIdInCompetition = [];

  const teamsInCompetition = await teamDAO.findTeams({ competitionId });
  const teams = await Promise.all(
    teamsInCompetition.map(async (team) => {
      listUsersIdInCompetition = listUsersIdInCompetition.concat(team.member);
      team.numberOfAudiotoVerify = verifyDataTaskInfo.audiosPerTeamToVerify;
      await team.save();
      return team;
    }),
  );

  await Promise.all(
    listUsersIdInCompetition.map(async (userId) => {
      const user = await userDAO.findOneUser(userId);
      await mailer.sendMail(
        user.email,
        `Lịch thẩm định dữ liệu cuộc thi VLSP TTS`,
        `Chào bạn <strong>${user.name}</strong>,<br />
    Thời hạn thẩm định dữ liệu sẽ kết thúc vào ngày <strong>${moment(
      new Date(verifyDataTaskInfo.verifyDataEndDate),
    ).format(
      'MMM, DD, YYYY',
    )}</strong>. Đây là quy định của cuộc thi cũng như điều kiện để bạn có thể nhận dữ liệu từ BTC. Vui lòng đăng nhập hệ thống và hoàn thành trước thời hạn quy định.<br /> <br />
    Mọi thắc mắc về hệ thống vui lòng gửi về email ${MAILER_EMAIL} <br /> <br />
    Trân trọng, <br />
    BTC VLSP TTS 2021.`,
      );
    }),
  );

  return {
    message: 'Tạo công việc thành công',
  };
};

const updateThreshold = async ({ competitionId, threshold }) => {
  const competition = await competitionDAO.findOneCompetition(competitionId);
  if (!competition) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id cuộc thi');
  }
  if (!competition.taskVerifyData) {
    throw new CustomError(
      codes.NOT_FOUND,
      'Không tìm thấy công việc thẩm định dữ liệu',
    );
  }

  competition.taskVerifyData.threshold = threshold;
  await competition.save();
  return { message: 'Cập nhật thành công' };
};

const notifyVerifyData = async ({ teamId }) => {
  const team = await teamDAO.findOneTeam(teamId);
  if (!team) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id của đội');
  }

  const competition = await competitionDAO.findOneCompetition(
    team.competitionId,
  );

  await Promise.all(
    team.member.map(async (userId) => {
      const user = await userDAO.findOneUser(userId);
      await mailer.sendMail(
        user.email,
        'Tiến độ thẩm định dữ liệu VLSP TTS',
        `Chào bạn <strong>${user.name}</strong>, <br />
    <br />
    Cho đến hiện tại, đội của bạn đã thẩm định được <strong>${
      team.audiosVerifiedId.length
    }</strong> trên tổng số  <strong>${
          team.numberOfAudiotoVerify
        }</strong> audios. 
    Để tham gia cuộc thi, đề nghị các bạn nhanh chóng hoàn tất tối thiểu <strong>${
      competition.taskVerifyData.threshold
    }%</strong> số lượng audio trước thời hạn <strong>${moment(
          new Date(competition.taskVerifyData.verifyDataEndDate),
        ).format('MMM, DD, YYYY')}</strong>. <br />
    <br />
    Trân trọng, <br />
    BTC VLSP TTS 2021`,
      );
    }),
  );
  return { message: 'Gửi email thành công' };
};

const shareData = async ({ files, competitionId, dataDescription }) => {
  // console.log(file, competitionId, dataDescription);

  // B1: create dataTraining
  const dataTraining = await dataTrainingDAO.createDataTraining({
    competitionId,
    link: files.data[0].path,
  });

  // B2: update dataToShare in competition
  const competition = await competitionDAO.findOneCompetition(competitionId);
  competition.dataToShare = {
    dataTrainingId: dataTraining.id,
    dataDescription,
    commitmentTemplateLink: files.commitmentTemplate[0].path,
  };

  await competition.save();

  const teams = await teamDAO.findTeams({ competitionId: competitionId });
  let validTeams;
  let invalidTeams;
  if (competition.timeline.verifyData) {
    validTeams = teams.filter((team) => {
      const progress =
        team.audiosVerifiedId.length / team.numberOfAudiotoVerify;
      return progress * 100 >= competition.taskVerifyData.threshold;
    });
    invalidTeams = teams.filter((team) => {
      const progress =
        team.audiosVerifiedId.length / team.numberOfAudiotoVerify;
      return progress * 100 < competition.taskVerifyData.threshold;
    });
  } else {
    validTeams = teams;
  }

  await Promise.all(
    validTeams.map(async (team) => {
      for (let i = 0; i < team.member.length; i++) {
        const user = await userDAO.findOneUser(team.member[i]);
        await mailer.sendMail(
          user.email,
          `Dữ liệu cuộc thi VLSP TTS 2020`,
          `Chào <strong>${user.name}</strong> <br />
      <br />
      Cảm ơn bạn đã tham gia và hoàn thành thẩm định dữ liệu cuộc thi TTS VLSP 2020. Bạn đã đủ điều kiện để có thể yêu cầu dữ liệu huấn luyện từ BTC.
      <br />
      Vui lòng đăng nhập hệ thống và vào mục Công <strong>việc cần hoàn thành</strong>, vào phần <strong>Yêu cầu dữ liệu</strong> <br />
      <br />
      Do các dữ liệu trong cuộc thi là nội bộ, và chỉ được chia sẻ cho các bạn đã hoàn thành việc thẩm định. Để đảm bảo bảo mật dữ liệu, 
      bạn vui lòng điền các thông tin vào thoả thuận đã được đính trong phần yêu cầu dữ liệu huấn luyện và upload bản scan có chữ kí của bạn.<br />
      <br />
      Sau khi đã yêu cầu dữ liệu xong, bạn vui lòng chờ để admin xác nhận thỏa thuận của bạn và cho phép bạn tải dữ liệu. <br />
      <br />
      Mọi thắc mắc về hệ thống vui lòng gửi về email ${MAILER_EMAIL} <br />
      <br />
      Trân trọng. <br />
      BTC VLSP TTS 2021
       `,
        );
      }
    }),
  );

  if (invalidTeams.length > 0) {
    await Promise.all(
      invalidTeams.map(async (team) => {
        for (let i = 0; i < team.member.length; i++) {
          const user = await userDAO.findOneUser(team.member[i]);
          await mailer.sendMail(
            user.email,
            `Dữ liệu cuộc thi VLSP TTS 2020`,
            `Chào ${user.name}, <br />
        <br />
        Bạn chưa đủ điều kiện để nhận dữ liệu của cuộc thi VLSP TTS 2020. Hẹn gặp lại bạn ở cuộc thi năm sau nhé! <br />
        <br />
        Trân trọng. <br />
        BTC VLSP TTS 2021
         `,
          );
        }
      }),
    );
  }

  return { dataTraining };
};

const getDataTrainingById = async (dataTrainingId) => {
  const dataTraining = await dataTrainingDAO.findOneDataTraining(
    dataTrainingId,
  );
  return dataTraining;
};

const requestData = async ({ teamId, commitmentFile }) => {
  const team = await teamDAO.findOneTeam(teamId);
  const competition = await competitionDAO.findOneCompetition(
    team.competitionId,
  );

  if (!competition.dataToShare || !competition.dataToShare.dataTrainingId) {
    throw new CustomError(
      codes.NOT_FOUND,
      'Cuộc thi này chưa có dữ liệu huấn luyện',
    );
  }

  if (
    competition.timeline.verifyData &&
    (100 * team.audiosVerifiedId.length) / team.numberOfAudiotoVerify <
      competition.taskVerifyData.threshold
  ) {
    throw new CustomError(
      codes.NOT_VALID_CONDITION,
      `Bạn chưa thẩm định đủ ${competition.taskVerifyData.threshold}%`,
    );
  }

  // B1: update team.commitmentLink
  team.commitmentLink = commitmentFile.path;
  // B2: update requestTeam
  const existedRequestIndex = competition.dataToShare.requestTeams.findIndex(
    (req) => {
      if (req.teamId.toString() === teamId) {
        return true;
      }
      return false;
    },
  );

  if (existedRequestIndex !== -1) {
    if (competition.dataToShare.requestTeams[existedRequestIndex].accepted) {
      return { message: 'Bạn đã có quyền truy cập vào dữ rồi' };
    }
    const oldLink =
      competition.dataToShare.requestTeams[existedRequestIndex].commitmentLink;
    competition.dataToShare.requestTeams[existedRequestIndex].commitmentLink =
      commitmentFile.path;
    await team.save();
    await competition.save();
    fs.unlink(oldLink, (err) => {
      if (err) {
        console.log('error unlink at create request data:', err);
      }
    });

    return { message: 'Đã cập nhật yêu cầu, vui lòng chờ admin xác nhận' };
  } else {
    competition.dataToShare.requestTeams.push({
      teamId,
      commitmentLink: commitmentFile.path,
      accepted: false,
    });

    await team.save();
    await competition.save();
    return { message: 'Đã yêu cầu dữ liệu, vui lòng chờ admin xác nhận' };
  }
};

const getRequestTeams = async (competitionId) => {
  const competition = await competitionDAO.findOneCompetition(competitionId);
  const requestTeamsInCompetition = [...competition.dataToShare.requestTeams];

  const requestTeams = await Promise.all(
    requestTeamsInCompetition.map(async (element) => {
      const team = await teamDAO.findOneTeam(element.teamId);
      // const teamDoc = await team.lean();
      return {
        ...team.toObject(),
        accepted: element.accepted,
      };
    }),
  );
  // console.log('requested teams:', requestTeams);
  return { requestTeams };
};

const confirmShareData = async ({ competitionId, teamId }) => {
  const competition = await competitionDAO.findOneCompetition(competitionId);

  if (!competition.dataToShare.dataTrainingId) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy dữ liệu huấn luyện');
  }

  const teamIndex = competition.dataToShare.requestTeams.findIndex(
    (element) => {
      return element.teamId.toString() === teamId;
    },
  );
  if (teamIndex === -1) {
    throw new CustomError(
      codes.NOT_FOUND,
      'Không tìm thấy đội của bạn trong cuộc thi',
    );
  }

  competition.dataToShare.requestTeams[teamIndex].accepted = true;
  await competition.save();
  return { message: 'Chia sẻ dữ liệu thành công' };
};

const getDataTrainingForUser = async ({ competitionId, teamId }) => {
  const competition = await competitionDAO.findOneCompetition(competitionId);

  if (!competition.dataToShare.dataTrainingId) {
    throw new CustomError(
      codes.DATA_TRAINING_NOT_AVAILABLE,
      'Không tìm thấy dữ liệu huấn luyện',
    );
  }

  const teamIndex = competition.dataToShare.requestTeams.findIndex(
    (element) => {
      return element.teamId.toString() === teamId;
    },
  );
  if (teamIndex === -1) {
    throw new CustomError(
      codes.NOT_FOUND,
      'Đội của bạn không có quyền truy cập dữ liệu huấn luyện',
    );
  }

  if (!competition.dataToShare.requestTeams[teamIndex].accepted) {
    return { dataTraining: null };
  }
  const dataTraining = await dataTrainingDAO.findOneDataTraining(
    competition.dataToShare.dataTrainingId,
  );
  return { dataTraining };
};

const createTaskSubmission = async ({ competitionId, taskSubmissionInfo }) => {
  const competition = await competitionDAO.findOneCompetition(competitionId);

  competition.taskSubmitResult = {
    ...competition.taskSubmitResult,
    ...taskSubmissionInfo,
  };
  await competition.save();
  return { message: 'Tạo công việc thành công' };
};

const updateTaskSubmission = async ({ competitionId, taskSubmissionInfo }) => {
  const competition = await competitionDAO.findOneCompetition(competitionId);
  console.log(taskSubmissionInfo);
  competition.taskSubmitResult = {
    ...competition.taskSubmitResult,
    ...taskSubmissionInfo,
  };
  await competition.save();
  return { message: 'Cập nhật công việc thành công' };
};

const submitResult = async ({ competitionId, teamId, file }) => {
  const competition = await competitionDAO.findOneCompetition(competitionId);
  const team = await teamDAO.findOneTeam(teamId);

  if (!competition) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id cuộc thi');
  }

  if (!team) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id của đội');
  }

  if (
    competition.timeline.verifyData &&
    (100 * team.audiosVerifiedId.length) / team.numberOfAudiotoVerify <
      competition.taskVerifyData.threshold
  ) {
    throw new CustomError(
      codes.NOT_VALID_CONDITION,
      `Bạn chưa thẩm định đủ ${competition.taskVerifyData.threshold}% nên chưa có quyền nộp báo cáo`,
    );
  }

  if (team.competitionId.toString() !== competition.id.toString()) {
    throw new CustomError(
      codes.NOT_VALID_CONDITION,
      'Đội của bạn đang không ở trong cuộc thi này hoặc id của đội hoặc cuộc thi bị sai',
    );
  }

  // B1 update taskSubmitResult.teamSubmitted trong competition

  const submittedResultIndex =
    competition.taskSubmitResult.teamSubmitted.findIndex((el) => {
      return el.teamId.toString() === teamId;
    });

  if (submittedResultIndex === -1) {
    competition.taskSubmitResult.teamSubmitted.push({
      teamId: teamId,
      resultSubmittedLink: file.path,
    });
  } else {
    const oldLink =
      competition.taskSubmitResult.teamSubmitted[submittedResultIndex]
        .resultSubmittedLink;
    fs.unlink(oldLink, (err) => {
      if (err) {
        console.log('error unlink at create verify task:', err);
      }
    });
    competition.taskSubmitResult.teamSubmitted[
      submittedResultIndex
    ].resultSubmittedLink = file.path;
  }

  // B2 update resultSubmittedLink trong team
  team.resultSubmittedLink = file.path;

  await competition.save();
  await team.save();

  return { message: 'Nộp kết quả thành công' };
};

const getTeamsWhoSubmittedResult = async ({ competitionId }) => {
  const competition = await competitionDAO.findOneCompetition(competitionId);

  if (!competition) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy cuộc thi');
  }

  const teamSubmitted = await Promise.all(
    competition.taskSubmitResult.teamSubmitted.map(async (el) => {
      const team = await teamDAO.findOneTeam(el.teamId);
      const leader = await userDAO.findOneUser(team.leader);
      return {
        ...team.toObject(),
        realLeader: leader,
      };
    }),
  );

  return { teamSubmitted };
};

const getUserDoNotJoinCompetition = async (competitionId) => {
  const allUsers = await userDAO.findUsers({});
  const candidates = allUsers.filter((user) => {
    let isValid = true;
    if (user.role !== 'user') {
      isValid = false;
    }
    user.competitions.forEach((element) => {
      if (element.competitionId.toString() === competitionId) {
        isValid = false;
      }
    });
    return isValid;
  });

  return { candidates };
};

const createTaskSubmitReport = async ({
  competitionId,
  taskSubmitResultInfo,
}) => {
  const competition = await competitionDAO.findOneCompetition(competitionId);
  if (!competition) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id cuộc thi');
  }

  competition.taskSubmitReport = {
    ...competition.taskSubmitReport,
    ...taskSubmitResultInfo,
  };

  await competition.save();
  return { message: 'Tạo công việc nộp báo cáo thành công' };
};

const submitReport = async ({ competitionId, teamId, file }) => {
  const competition = await competitionDAO.findOneCompetition(competitionId);
  const team = await teamDAO.findOneTeam(teamId);

  if (!competition) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id cuộc thi');
  }

  if (!team) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id của đội');
  }

  if (team.competitionId.toString() !== competition.id.toString()) {
    throw new CustomError(
      codes.NOT_VALID_CONDITION,
      'Đội của bạn đang không ở trong cuộc thi này hoặc id của đội hoặc cuộc thi bị sai',
    );
  }

  // B1 update taskSubmitReport.teamSubmitted trong competition

  const submittedReportIndex =
    competition.taskSubmitReport.teamSubmitted.findIndex((el) => {
      return el.teamId.toString() === teamId;
    });

  if (submittedReportIndex === -1) {
    competition.taskSubmitReport.teamSubmitted.push({
      teamId: teamId,
      reportSubmittedLink: file.path,
    });
  } else {
    const oldLink =
      competition.taskSubmitReport.teamSubmitted[submittedReportIndex]
        .reportSubmittedLink;
    fs.unlink(oldLink, (err) => {
      if (err) {
        console.log('error unlink at create verify task:', err);
      }
    });
    competition.taskSubmitReport.teamSubmitted[
      submittedReportIndex
    ].reportSubmittedLink = file.path;
  }

  // B2 update reportSubmittedLink trong team
  team.reportSubmittedLink = file.path;

  await competition.save();
  await team.save();

  return { message: 'Nộp báo cáo thành công' };
};

const getTeamsWhoSubmittedReport = async ({ competitionId }) => {
  const competition = await competitionDAO.findOneCompetition(competitionId);

  if (!competition) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy cuộc thi');
  }

  const teamSubmitted = await Promise.all(
    competition.taskSubmitReport.teamSubmitted.map(async (el) => {
      const team = await teamDAO.findOneTeam(el.teamId);
      const leader = await userDAO.findOneUser(team.leader);
      return {
        ...team.toObject(),
        realLeader: leader,
      };
    }),
  );

  return { teamSubmitted };
};

module.exports = {
  createCompetition,
  getCompetitions,
  getOneCompetition,
  updateCompetitionById,
  createVerifyDataTask,
  notifyVerifyData,
  updateThreshold,
  shareData,
  getDataTrainingById,
  requestData,
  getRequestTeams,
  confirmShareData,
  getDataTrainingForUser,
  createTaskSubmission,
  updateTaskSubmission,
  submitResult,
  getTeamsWhoSubmittedResult,
  getUserDoNotJoinCompetition,
  createTaskSubmitReport,
  submitReport,
  getTeamsWhoSubmittedReport,
};
