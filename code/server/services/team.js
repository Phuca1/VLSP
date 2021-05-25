const CustomError = require('../errors/CustomError');
const userDAO = require('../daos/user');
const teamDAO = require('../daos/team');
const competitionDAO = require('../daos/competition');
const codes = require('../errors/code');
const mailer = require('../utils/mailer');
const jwt = require('jsonwebtoken');

const { SECRETE_KEY, FRONTENT_DOMAIN } = require('../config');

const verifyEmailsToCreateTeam = async (emailsString, competitionId) => {
  if (!emailsString) {
    return;
  }
  const listEmails = emailsString.split(';').map((email) => {
    return email.trim();
  });

  await Promise.all(
    listEmails.map(async (email) => {
      const user = await userDAO.findOneUser({ email });
      if (!user) {
        throw new CustomError(
          codes.EMAIL_NOT_EXIST,
          `E-mail ${email} không tồn tại`,
        );
      }
      user.competitions.forEach((el) => {
        if (el.competitionId.toString() === competitionId.toString()) {
          throw new CustomError(
            codes.NOT_AVAILABLE,
            `Người dùng ${email} đã tham gia đội khác`,
          );
        }
      });
    }),
  );
};

const createTeam = async (competitionId, teamInfo) => {
  //teamInfo chứa id của leader, 1 string chứa toàn bộ email của các thành viên trừ leader và tên của team

  const competition = await competitionDAO.findOneCompetition(competitionId);

  if (
    competition.timeline.verifyData &&
    competition.taskVerifyData &&
    competition.taskVerifyData.audiosPerTeamToVerify
  ) {
    console.log(competition.taskVerifyData);
    throw new CustomError(codes.WRONG_TIME, 'Đã quá hạn đăng kí cuộc thi');
  }

  const existedTeam = await teamDAO.findOneTeam({
    name: teamInfo.name,
    competitionId: competitionId,
  });
  if (existedTeam) {
    throw new CustomError(codes.TEAM_EXISTED, 'Tên đội đã tồn tại');
  }

  // cập nhật thông tin leader
  const leader = await userDAO.findOneUser(teamInfo.leaderId);

  const team = await teamDAO.createTeam({
    name: teamInfo.name,
    leader: leader.id,
    competitionId,
  });

  if (team && competition) {
    leader.competitions.push({
      competitionId,
      teamId: team.id,
    });
    team.member.push(leader.id);
    competition.team.push(team.id);

    await Promise.all([leader.save(), competition.save(), team.save()]).catch(
      async (error) => {
        console.log(error);
        await teamDAO.deleteTeamById(team.id);
        throw new CustomError(codes.INTERNAL_SERVER_ERROR, 'Không thể tạo đội');
      },
    );
  }

  if (!teamInfo.emailsString || teamInfo.emailsString === '') {
    return { team: team, message: 'Đăng kí thành công' };
  }

  const listEmails = teamInfo.emailsString.split(';').map((email) => {
    return email.trim();
  });

  await Promise.all(
    listEmails.map(async (email) => {
      // console.log(email);
      const member = await userDAO.findOneUser({ email });
      const tokenJoinTeam = jwt.sign(
        { userId: member.id, teamId: team.id },
        SECRETE_KEY,
      );
      await mailer.sendMail(
        email,
        'Thư mời gia nhập đội.',
        `<h5>Xin chào</h5>
        <p><strong>${leader.email}</strong> đã mời bạn vào đội của anh ấy</p>
        <p>Hãy đăng nhập sau đó nhấn vào link sau để tham gia vào đội <a href="${FRONTENT_DOMAIN}/confirm-join-team/${tokenJoinTeam}">link xác nhận</a></p>`,
      );
    }),
  ).catch(async (error) => {
    console.log('At create team service: ', error);
    await teamDAO.deleteTeamById(team.id);
    competition.team.pop();
    await competition.save();
    throw new CustomError(
      codes.INTERNAL_SERVER_ERROR,
      'Không thể gửi email cho thành viên! Vui lòng thử lại',
    );
  });

  console.log(team);

  return { team: team, message: 'Đăng kí thành công' };
};

const confirmUserJoinTeam = async (token) => {
  const { userId, teamId } = jwt.verify(token, SECRETE_KEY);
  if (!(userId && teamId)) {
    throw new CustomError(codes.TOKEN, 'Token không hợp lệ');
  }
  const user = await userDAO.findOneUser(userId);
  const team = await teamDAO.findOneTeam(teamId);
  const competition = await competitionDAO.findOneCompetition(
    team.competitionId,
  );

  if (!(user && team && competition)) {
    throw new CustomError(codes.INTERNAL_SERVER_ERROR, 'Truy vấn lỗi');
  }

  if (team.member.includes(user.id)) {
    throw new CustomError(codes.MEMBER_EXISTED, 'Bạn đã ở trong đội rồi');
  }

  user.competitions.forEach((el) => {
    if (el.competitionId === competition.id) {
      throw new CustomError(
        codes.NOT_AVAILABLE,
        `Người dùng ${email} đã tham gia đội khác`,
      );
    }
  });

  team.member.push(user.id);

  user.competitions.push({
    competitionId: competition.id,
    teamId: team.id,
  });
  await Promise.all([(user.save(), team.save())]);
};

const getListTeamInfo = async () => {
  const allTeams = await teamDAO.findTeams({});
  return { teams: allTeams };
};

const getListTeamInCompetition = async (competitionId) => {
  const listTeams = await teamDAO.findTeams({ competitionId });
  return { teams: listTeams };
};

const getTeamInforOfUser = async ({ uid, cid }) => {
  const user = await userDAO.findOneUser(uid);
  if (!user) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy người dùng');
  }
  const currentCompetitionObj = user.competitions.filter((competition) => {
    return competition.competitionId.toString() === cid;
  });
  if (!currentCompetitionObj) {
    throw new CustomError(codes.TEAM_EXISTED, 'Bạn chưa đăng kí cuộc thi');
  }
  // console.log('currentCompetitionObj', currentCompetitionObj);
  const teamId = currentCompetitionObj[0].teamId;
  // console.log('teamId:', teamId);
  const team = await teamDAO.findOneTeam(teamId);
  // console.log('team:', team);
  const members = await Promise.all(
    team.member.map(async (memberId) => {
      const mem = await userDAO.findOneUser(memberId);
      return mem;
    }),
  );
  return { team, members };
};

const getTeamById = async (teamId) => {
  const team = await teamDAO.findOneTeam(teamId);
  return team;
};

module.exports = {
  verifyEmailsToCreateTeam,
  createTeam,
  confirmUserJoinTeam,
  getListTeamInfo,
  getListTeamInCompetition,
  getTeamInforOfUser,
  getTeamById,
};
