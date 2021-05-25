const CustomError = require('../errors/CustomError');
const codes = require('../errors/code');

const decompress = require('decompress');
const fs = require('fs');
const uuid = require('uuid');

const testDAO = require('../daos/test');
const userDAO = require('../daos/user');
const teamDAO = require('../daos/team');
const userInTestDAO = require('../daos/userInTest');
const audioInTestDAO = require('../daos/audioInTest');
const competitionDAO = require('../daos/competition');

const { shuffleArray } = require('../utils/arrayTools');
const code = require('../errors/code');

const mailer = require('../utils/mailer');
const { MAILER_EMAIL } = require('../config');

const createTest = async ({ testInfo, file }) => {
  // testInfo bao gồm name, type(MOS), access, userListenPerAudio, numberOfTestSet(public test), emailUserList (private test)

  console.log('file zip: ', file);
  console.log('test info ', testInfo);

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const uid = uuid.v4();
  const folderName = `${year}-${month + 1}-${day}-${hour}:${min}-${uid}`;

  // giải nén
  const extractDataPath = `uploads/extractedTest/${folderName}`; // thư mục giải nén
  await decompress(file.path, extractDataPath);

  fs.unlink(file.path, (err) => {
    if (err) {
      console.log('error at unlink in create test task: ', err);
    }
  });

  let listTextFileName; // danh sách tên các file text (không bao gồm extension )
  let listAudioTeamIdFileName; // danh sách tên các thư mục là id của các đội
  let listAudioFilePath = []; // danh sách các path dẫn đến các audio đó
  let listVoice = []; // danh sách các voice trích xuất được từ file audio của các đội

  // ************** check xem text và các audio có hợp lệ?*****************************

  // B1 : check và add voice to team ???

  if (fs.readdirSync(extractDataPath).includes('text')) {
    let isValid1 = true;
    listTextFileName = fs.readdirSync(`${extractDataPath}/text`).map((el) => {
      if (el.split('.')[1] !== 'txt') {
        isValid1 = false;
      }
      return el.split('.')[0];
    });
    console.log('listTextFileName: ', listTextFileName);
    if (!isValid1) {
      throw new CustomError(codes.INVALID_FORMAT, 'Tồn tại file định dạng lỗi');
    }
  } else {
    fs.rmdir(extractDataPath, { recursive: true }, (err) => {
      if (err) {
        console.log('error remove directory at create test:', err);
      }
    });
    throw new CustomError(
      codes.INVALID_FORMAT,
      'Không tìm thấy thư mục text trong file zip',
    );
  }

  if (fs.readdirSync(extractDataPath).includes('audio')) {
    listAudioTeamIdFileName = fs.readdirSync(`${extractDataPath}/audio`);
    console.log('listAudioTeamIdFileName: ', listAudioTeamIdFileName);

    let isValid = true;
    let isNotExistedVoice = true;
    let correctVoice = true;
    await Promise.all(
      listAudioTeamIdFileName.map(async (teamId) => {
        //check xem có tồn tại teamId không ?
        const team = await teamDAO.findOneTeam(teamId);
        if (!team) {
          isValid = false;
        }

        const listAudioFileName = fs.readdirSync(
          `${extractDataPath}/audio/${teamId}`,
        ); // tên các audio bao gồm extension

        console.log(`in ${teamId}, audios: `, listAudioFileName);

        // check số file txt so với số audio
        if (listAudioFileName.length !== listTextFileName.length) {
          console.log('Số file txt khác số file audio');
          isValid = false;
        }
        const voice = listAudioFileName[0].split('.')[0].split('-')[1];

        // check xem đã có team khác có mã voice này chưa
        const teamHadVoice = await teamDAO.findOneTeam({ voice });
        if (teamHadVoice && teamHadVoice.id.toString() !== teamId) {
          isNotExistedVoice = false;
        }

        // nếu team đã có voice check xem mã voice có giống với mã voice cuả team không
        if (team && team.voice) {
          if (team.voice !== voice) {
            correctVoice = false;
          }
        }

        listVoice.push(voice);

        listAudioFileName.forEach((audioName) => {
          // check extension
          if (audioName.split('.')[1] !== 'wav') {
            console.log('here: ', audioName);
            isValid = false;
            return;
          }

          // check mã câu có ứng với mã câu bên thư mục text không
          if (
            !listTextFileName.includes(audioName.split('.')[0].split('-')[0])
          ) {
            console.log('here: ', audioName);
            isValid = false;
            return;
          }

          // check mã voice của cả thư mục có giống nhau không
          if (audioName.split('.')[0].split('-')[1] !== voice) {
            console.log('here: ', audioName);
            correctVoice = false;
            return;
          }

          listAudioFilePath.push(
            `${extractDataPath}/audio/${teamId}/${audioName}`,
          );
        });
      }),
    );

    // check xem mã voice của các thư mục có bị trùng không
    if (listVoice.length > 1) {
      for (let i = 0; i < listVoice.length - 1; i++) {
        for (let j = i + 1; j < listVoice.length; j++) {
          if (listVoice[i] === listVoice[j]) {
            console.log(i, j, 'Bị trùng mã voice');
            correctVoice = false;
          }
        }
      }
    }

    if (!isValid || !isNotExistedVoice || !correctVoice) {
      fs.rmdir(extractDataPath, { recursive: true }, (err) => {
        if (err) {
          console.log('error remove directory at create test:', err);
        }
      });
      if (!isValid) {
        throw new CustomError(
          codes.INVALID_FORMAT,
          'Hãy kiểm tra lại dữ liệu, format hoặc data không đúng',
        );
      } else if (!isNotExistedVoice) {
        throw new CustomError(
          codes.INVALID_FORMAT,
          'Mã voice trùng với đội khác',
        );
      } else {
        throw new CustomError(
          codes.INVALID_FORMAT,
          'Mã voice bị sai, vui lòng kiểm tra lại',
        );
      }
    }
  } else {
    fs.rmdir(extractDataPath, { recursive: true }, (err) => {
      if (err) {
        console.log('error remove directory at create test:', err);
      }
    });
    throw new CustomError(
      codes.INVALID_FORMAT,
      'Không tìm thấy thư mục audio trong file zip',
    );
  }

  // B2 : lấy ra những dữ liệu cần thiết để chia audio
  // khai báo biến
  const {
    name,
    type,
    access,
    usersListenPerAudio,
    competitionId,
    dateOpened,
    dateClosed,
  } = testInfo;
  let numberOfTestSet;

  if (access === 'public') {
    numberOfTestSet = parseInt(testInfo.numberOfTestSet);
  } else if (access === 'private') {
    numberOfTestSet = testInfo.userIdList.split(',').length;
  }

  console.log('numberOfTestSet: ', numberOfTestSet);
  console.log('listVoice', listVoice);
  // console.log('listAudioFilePath: ', listAudioFilePath);

  // B3 : tạo ra test và các audioInTest

  const existedTestName = await testDAO.findOneTest({ name });
  if (existedTestName) {
    fs.rmdir(extractDataPath, { recursive: true }, (err) => {
      if (err) {
        console.log('error remove directory at create test:', err);
      }
    });
    throw new CustomError(codes.TEST_EXISTED, 'Tên bài thí nghiệm đã tồn tại');
  }

  const test = await testDAO.createTest({
    name,
    type,
    competitionId,
    usersListenPerAudio,
    numberOfTestSet,
    access,
    dataDirPath: extractDataPath,
    voices: listVoice,
    dateOpened,
    dateClosed,
  });

  const listAllAudioInTest = await Promise.all(
    listAudioFilePath.map(async (audioPath) => {
      const dirs = audioPath.split('/');
      const audioName = dirs[dirs.length - 1].split('.')[0];
      const textFileName = audioName.split('-')[0];
      const voice = audioName.split('-')[1];
      const sentencePath = `${extractDataPath}/text/${textFileName}.txt`;
      const sentence = fs.readFileSync(sentencePath, {
        encoding: 'utf8',
        flag: 'r',
      });
      const audioInTest = await audioInTestDAO.createAudioInTest({
        audioLink: audioPath,
        name: audioName,
        sentenceLink: sentencePath,
        testId: test.id,
        sentence: sentence,
        voice: voice,
        numberOfRate: 0,
      });
      return audioInTest;
    }),
  );

  // console.log('listAllAudioInTest: ', listAllAudioInTest);

  // B4 : chia audio ra các mảng và đưa vào test.audioTestSet
  let shuffledAllAudio = [];
  let audiosSet = [];
  let finalAudiosDivided;

  for (let i = 0; i < numberOfTestSet; i++) {
    audiosSet.push([]);
  }

  for (textName of listTextFileName) {
    const listAudiosCoorText = [...listAllAudioInTest].filter((audioInTest) => {
      const sentencePathDirs = audioInTest.sentenceLink.split('/');
      const sentenceFileName = sentencePathDirs[sentencePathDirs.length - 1];
      return textName === sentenceFileName.split('.')[0];
    });
    shuffledAllAudio = shuffledAllAudio.concat(
      shuffleArray(listAudiosCoorText, 1),
    );
  }

  // console.log('shuffledAllAudio', shuffledAllAudio);

  for (let i = 0; i < shuffledAllAudio.length; i++) {
    for (let j = 0; j < usersListenPerAudio; j++) {
      audiosSet[(i * usersListenPerAudio + j) % numberOfTestSet].push(
        shuffledAllAudio[i],
      );
    }
  }

  // console.log('audiosSet: ', audiosSet);

  finalAudiosDivided = audiosSet.map((arrAudios) => {
    return shuffleArray(arrAudios, 5);
  });

  for (let i = 0; i < finalAudiosDivided.length; i++) {
    test.audioTestSet.push({
      audioSet: finalAudiosDivided[i].map((audioInTest) => {
        return audioInTest.id;
      }),
      assignedTimes: 0,
      index: i,
    });
  }

  await test.save();

  // B5 : nếu là private test tạo ra các userInTest và đưa dữ liệu đã chia vào đó

  if (access === 'private') {
    // console.log(testInfo.userIdList);
    await Promise.all(
      shuffleArray(testInfo.userIdList.split(','), 1).map(
        async (userId, index) => {
          const userInTest = await userInTestDAO.createUserInTest({
            userId: userId,
            testId: test.id,
            audioToEvaluate: test.audioTestSet[index].audioSet.map(
              (audioId, ind) => {
                return {
                  audioInTest: audioId,
                  evaluated: false,
                  index: ind,
                };
              },
            ),
          });
          test.audioTestSet[index].assignedTimes = 1;
          test.joinedUser.push(userId);
          return userInTest;
        },
      ),
    );
  }

  await test.save();

  // B6 : update voice cho team

  await Promise.all(
    listAudioTeamIdFileName.map(async (teamId) => {
      const team = await teamDAO.findOneTeam(teamId);
      const randomAudioFileName = fs.readdirSync(
        `${extractDataPath}/audio/${teamId}`,
      )[0];
      const voice = randomAudioFileName.split('.')[0].split('-')[1];
      if (!team.voice) {
        team.voice = voice;
      }
      await team.save();
      return team;
    }),
  );

  return { test };
};

const getTestsInCompetition = async (competitionId) => {
  const tests = await testDAO.findTests({ competitionId });
  return { tests };
};

const getTestById = async (testId) => {
  const test = await testDAO.findOneTest(testId);
  if (!test) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy bài thí nghiệm');
  }
  return { test };
};

const getAllPublicTest = async () => {
  const tests = await testDAO.findTests({ access: 'public' });
  return { tests };
};

const getPrivateTestsForUser = async ({ userId }) => {
  const allPrivateTests = await testDAO.findTests({ access: 'private' });
  // console.log('at getPrivateTestsForUser: userId: ', userId);
  // console.log('all private test: ', allPrivateTests);
  const tests = allPrivateTests.filter((test) => {
    let isJoined = false;
    test.joinedUser.forEach((uid) => {
      if (uid.toString() === userId) {
        isJoined = true;
      }
    });
    return isJoined;
  });

  return { tests };
};

// lưu ý : hàm này sẽ trả về null nếu không tìm thấy userInTest, không throw ra lỗi như thường lệ.
const getOneUserInTest = async ({ userId, testId }) => {
  const userInTest = await userInTestDAO.findOneUserInTest({ userId, testId });
  return { userInTest };
};

const joinPublicTest = async ({ userId, testId }) => {
  const existedUserInTest = await userInTestDAO.findOneUserInTest({
    userId,
    testId,
  });
  if (existedUserInTest) {
    throw new CustomError(
      codes.MEMBER_EXISTED,
      'Bạn đã đăng kí bài thí nghiệm này rồi',
    );
  }

  const user = await userDAO.findOneUser(userId);
  if (!user) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id người dùng');
  }
  const test = await testDAO.findOneTest(testId);
  if (!test) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id bài thí nghiệm');
  }

  let testSet;

  const testSetSorted = test.audioTestSet.sort((a, b) => {
    return a.assignedTimes - b.assignedTimes;
  });

  if (testSetSorted.length <= 3) {
    testSet = testSetSorted[0];
  } else {
    testSet = testSetSorted.slice(0, 3)[Math.floor(Math.random() * 3)];
  }

  const userInTest = await userInTestDAO.createUserInTest({
    userId,
    testId,
    audioToEvaluate: testSet.audioSet.map((audioId, ind) => {
      return {
        audioInTest: audioId,
        evaluated: false,
        index: ind,
      };
    }),
  });

  const testSetIndex = test.audioTestSet.findIndex((el) => {
    return el.index === testSet.index;
  });

  test.joinedUser.push(userId);
  test.audioTestSet[testSetIndex].assignedTimes += 1;

  await test.save();

  // console.log(testSet);

  return { userInTest };
};

const getUserInTestById = async (userInTestId) => {
  const userInTest = await userInTestDAO.findOneUserInTest(userInTestId);
  if (!userInTest) {
    throw new CustomError(
      codes.NOT_FOUND,
      'Không tìm thấy id người dùng trong bài test',
    );
  }
  return { userInTest };
};

const getAudioInTestById = async (audioInTestId) => {
  const audioInTest = await audioInTestDAO.findOneAudioInTest(audioInTestId);
  if (!audioInTest) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id của audio');
  }
  return { audioInTest };
};

const updateEvaluatingAudioInMOSTest = async ({
  userId,
  audioInTestId,
  userInTestId,
  point,
}) => {
  // console.log('audioInTestId', audioInTestId);
  // console.log('userInTestId', userInTestId);

  // check hợp lệ
  const userInTest = await userInTestDAO.findOneUserInTest(userInTestId);
  if (!userInTest) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy userInTestId');
  }

  if (userInTest.userId.toString() !== userId) {
    throw new CustomError(
      code.NOT_AVAILABLE,
      'Bạn không có quyền đánh giá audio này',
    );
  }

  const audioInTest = await audioInTestDAO.findOneAudioInTest(audioInTestId);
  if (!audioInTest) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id của audio');
  }

  const test = await testDAO.findOneTest(audioInTest.testId);

  if (!test.joinedUser.includes(userId)) {
    throw new CustomError(
      code.NOT_AVAILABLE,
      'Người dùng chưa tham gia cuộc thi này',
    );
  }

  // update audioInTest

  const userIndex = audioInTest.users.findIndex((el) => {
    return el.userId.toString() === userId;
  });

  if (userIndex === -1) {
    audioInTest.users.push({
      userId: userId,
      point: point,
    });
    audioInTest.numberOfRate += 1;
  } else {
    audioInTest.users[userIndex].point = point;
  }

  audioInTest.averagePoint =
    audioInTest.users.reduce((acc, curVal) => {
      return acc + curVal.point;
    }, 0) / audioInTest.users.length;

  // update userInTest

  const audioIndex = userInTest.audioToEvaluate.findIndex((el) => {
    return el.audioInTest.toString() === audioInTestId;
  });

  if (audioIndex === -1) {
    throw new CustomError(
      codes.NOT_VALID_CONDITION,
      'Không tìm thấy audio trong danh sách của người thẩm định',
    );
  }

  userInTest.audioToEvaluate[audioIndex].evaluated = true;

  await audioInTest.save();
  await userInTest.save();

  return { message: 'Đánh giá audio thành công' };
};

const getAudiosInTest = async (testId) => {
  const test = await testDAO.findOneTest(testId);
  if (!test) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id bài test');
  }

  const audiosInTest = await audioInTestDAO.findAudiosInTest({ testId });

  console.log(audiosInTest);

  return { audiosInTest };
};

const getAllUsersInTestDetail = async (testId) => {
  const test = await testDAO.findOneTest(testId);
  const allUsersInTestDetail = await Promise.all(
    test.joinedUser.map(async (userId) => {
      const orgUser = await userDAO.findOneUser(userId);
      const userInTest = await userInTestDAO.findOneUserInTest({
        userId,
        testId,
      });
      return {
        ...orgUser.toObject(),
        audioToEvaluate: userInTest.audioToEvaluate,
      };
    }),
  );
  return { allUsersInTestDetail };
};

const createTestLatinSquare = async ({ testInfo, file }) => {
  // testInfo bao gồm name, type(MOS), access, userListenPerAudio, numberOfTestSet(public test), emailUserList (private test)

  console.log('file zip: ', file);
  console.log('test info ', testInfo);

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const uid = uuid.v4();
  const folderName = `${year}-${month + 1}-${day}-${hour}:${min}-${uid}`;

  // giải nén
  const extractDataPath = `uploads/extractedTest/${folderName}`; // thư mục giải nén
  await decompress(file.path, extractDataPath);

  fs.unlink(file.path, (err) => {
    if (err) {
      console.log('error at unlink in create test task: ', err);
    }
  });

  let listTextFileName; // danh sách tên các file text (không bao gồm extension )
  let listAudioTeamIdFileName; // danh sách tên các thư mục là id của các đội
  let listAudioFilePath = []; // danh sách các path dẫn đến các audio đó
  let listVoice = []; // danh sách các voice trích xuất được từ file audio của các đội

  // ************** check xem text và các audio có hợp lệ?*****************************

  // B1 : check và add voice to team ???

  if (fs.readdirSync(extractDataPath).includes('text')) {
    let isValid1 = true;
    listTextFileName = fs.readdirSync(`${extractDataPath}/text`).map((el) => {
      if (el.split('.')[1] !== 'txt') {
        isValid1 = false;
      }
      return el.split('.')[0];
    });
    console.log('listTextFileName: ', listTextFileName);
    if (!isValid1) {
      throw new CustomError(codes.INVALID_FORMAT, 'Tồn tại file định dạng lỗi');
    }
  } else {
    fs.rmdir(extractDataPath, { recursive: true }, (err) => {
      if (err) {
        console.log('error remove directory at create test:', err);
      }
    });
    throw new CustomError(
      codes.INVALID_FORMAT,
      'Không tìm thấy thư mục text trong file zip',
    );
  }

  if (fs.readdirSync(extractDataPath).includes('audio')) {
    listAudioTeamIdFileName = fs.readdirSync(`${extractDataPath}/audio`);
    // console.log('listAudioTeamIdFileName: ', listAudioTeamIdFileName);

    let isValid = true;
    let isNotExistedVoice = true;
    let correctVoice = true;
    await Promise.all(
      listAudioTeamIdFileName.map(async (teamId) => {
        //check xem có tồn tại teamId không ?
        const team = await teamDAO.findOneTeam(teamId);
        if (!team) {
          isValid = false;
        }

        const listAudioFileName = fs.readdirSync(
          `${extractDataPath}/audio/${teamId}`,
        ); // tên các audio bao gồm extension

        console.log(`in ${teamId}, audios: `, listAudioFileName);

        // check số file txt so với số audio
        if (listAudioFileName.length !== listTextFileName.length) {
          console.log('Số file txt khác số file audio');
          isValid = false;
        }
        const voice = listAudioFileName[0].split('.')[0].split('-')[1];

        // check xem đã có team khác có mã voice này chưa
        const teamHadVoice = await teamDAO.findOneTeam({ voice });
        if (teamHadVoice && teamHadVoice.id.toString() !== teamId) {
          isNotExistedVoice = false;
        }

        // nếu team đã có voice check xem mã voice có giống với mã voice cuả team không
        if (team && team.voice) {
          if (team.voice !== voice) {
            correctVoice = false;
          }
        }

        listVoice.push(voice);

        listAudioFileName.forEach((audioName) => {
          // check extension
          if (audioName.split('.')[1] !== 'wav') {
            console.log('here: ', audioName);
            isValid = false;
            return;
          }

          // check mã câu có ứng với mã câu bên thư mục text không
          if (
            !listTextFileName.includes(audioName.split('.')[0].split('-')[0])
          ) {
            console.log('here: ', audioName);
            isValid = false;
            return;
          }

          // check mã voice của cả thư mục có giống nhau không
          if (audioName.split('.')[0].split('-')[1] !== voice) {
            console.log('here: ', audioName);
            correctVoice = false;
            return;
          }

          listAudioFilePath.push(
            `${extractDataPath}/audio/${teamId}/${audioName}`,
          );
        });
      }),
    );

    // check xem mã voice của các thư mục có bị trùng không
    if (listVoice.length > 1) {
      for (let i = 0; i < listVoice.length - 1; i++) {
        for (let j = i + 1; j < listVoice.length; j++) {
          if (listVoice[i] === listVoice[j]) {
            console.log(i, j, 'Bị trùng mã voice');
            correctVoice = false;
          }
        }
      }
    }

    if (!isValid || !isNotExistedVoice || !correctVoice) {
      fs.rmdir(extractDataPath, { recursive: true }, (err) => {
        if (err) {
          console.log('error remove directory at create test:', err);
        }
      });
      if (!isValid) {
        throw new CustomError(
          codes.INVALID_FORMAT,
          'Hãy kiểm tra lại dữ liệu, format hoặc data không đúng',
        );
      } else if (!isNotExistedVoice) {
        throw new CustomError(
          codes.INVALID_FORMAT,
          'Mã voice trùng với đội khác',
        );
      } else {
        throw new CustomError(
          codes.INVALID_FORMAT,
          'Mã voice bị sai, vui lòng kiểm tra lại',
        );
      }
    }
  } else {
    fs.rmdir(extractDataPath, { recursive: true }, (err) => {
      if (err) {
        console.log('error remove directory at create test:', err);
      }
    });
    throw new CustomError(
      codes.INVALID_FORMAT,
      'Không tìm thấy thư mục audio trong file zip',
    );
  }

  // B2 : lấy ra những dữ liệu cần thiết
  // khai báo biến
  const { name, type, access, competitionId, dateOpened, dateClosed } =
    testInfo;
  let numberOfTestSet;

  if (access === 'public') {
    numberOfTestSet = parseInt(testInfo.numberOfTestSet);
  } else if (access === 'private') {
    numberOfTestSet = testInfo.userIdList.split(',').length;
  }

  console.log('numberOfTestSet: ', numberOfTestSet);
  console.log('listVoice', listVoice);
  console.log('listTextFileName', listTextFileName);
  console.log('listAudioFilePath: ', listAudioFilePath);
  console.log('listAudioTeamIdFileName', listAudioTeamIdFileName);

  if (numberOfTestSet % listVoice.length !== 0) {
    throw new CustomError(
      codes.INVALID_FORMAT,
      'Số bộ test/người tham gia phải chia hết cho số giọng',
    );
  }

  if (listTextFileName.length % listVoice.length !== 0) {
    throw new CustomError(
      codes.INVALID_FORMAT,
      'Số câu text phải chia hết cho số giọng',
    );
  }

  // B3 : tạo ra test và các audioInTest***************************************************

  const existedTestName = await testDAO.findOneTest({ name });
  if (existedTestName) {
    fs.rmdir(extractDataPath, { recursive: true }, (err) => {
      if (err) {
        console.log('error remove directory at create test:', err);
      }
    });
    throw new CustomError(codes.TEST_EXISTED, 'Tên bài thí nghiệm đã tồn tại');
  }

  const test = await testDAO.createTest({
    name,
    type,
    competitionId,
    numberOfTestSet,
    access,
    dataDirPath: extractDataPath,
    voices: listVoice,
    dateOpened,
    dateClosed,
  });

  const listAllAudioInTest = await Promise.all(
    listAudioFilePath.map(async (audioPath) => {
      const dirs = audioPath.split('/');
      const audioName = dirs[dirs.length - 1].split('.')[0];
      const textFileName = audioName.split('-')[0];
      const voice = audioName.split('-')[1];
      const sentencePath = `${extractDataPath}/text/${textFileName}.txt`;
      const sentence = fs.readFileSync(sentencePath, {
        encoding: 'utf8',
        flag: 'r',
      });
      const audioInTest = await audioInTestDAO.createAudioInTest({
        audioLink: audioPath,
        name: audioName,
        sentenceLink: sentencePath,
        testId: test.id,
        sentence: sentence,
        voice: voice,
        numberOfRate: 0,
      });
      return audioInTest;
    }),
  );

  // console.log('listAllAudioInTest: ', listAllAudioInTest);

  // B4 : chia audio ra các mảng và đưa vào test.audioTestSet********************************************

  let audiosSet = [];
  let finalAudiosDivided;
  const squareSize = listVoice.length;
  const numberOfSquare = listTextFileName.length / squareSize;

  console.log('numberOfSquare', numberOfSquare);

  for (let i = 0; i < numberOfTestSet; i++) {
    audiosSet.push([]);
  }

  let listAudioDividedByVoice = listVoice.map((voice) => {
    return listAllAudioInTest.filter((audio) => {
      return audio.name.split('-')[1] === voice;
    });
  });

  for (let sq = 0; sq < numberOfSquare; sq++) {
    let sliceText = listTextFileName.slice(
      sq * squareSize,
      (sq + 1) * squareSize,
    );
    let square = [];
    for (const arr of listAudioDividedByVoice) {
      const listSmallAudios = arr
        .filter((el) => {
          const text = el.name.split('-')[0];
          return sliceText.includes(text);
        })
        .sort((a, b) => {
          const text1 = a.name.split('-')[0];
          const text2 = b.name.split('-')[0];
          return text1 - text2;
        });
      square.push(listSmallAudios);
    }
    // console.log(`square ${sq}`, square);
    for (let i = 0; i < numberOfTestSet / squareSize; i++) {
      const shuffledArr = shuffleArray(square, 1);
      for (let j = 0; j < squareSize; j++) {
        for (let k = 0; k < squareSize; k++) {
          audiosSet[i * squareSize + j].push(
            shuffledArr[k][(j + k) % squareSize],
          );
        }
      }
    }
  }

  // console.log('audiosSet: ', audiosSet);

  finalAudiosDivided = audiosSet.map((arrAudios) => {
    return shuffleArray(arrAudios, 2);
  });

  // console.log('finalAudiosDivided', finalAudiosDivided);

  for (let i = 0; i < finalAudiosDivided.length; i++) {
    test.audioTestSet.push({
      audioSet: finalAudiosDivided[i].map((audioInTest) => {
        return audioInTest.id;
      }),
      assignedTimes: 0,
      index: i,
    });
  }

  await test.save();

  // B5 : nếu là private test tạo ra các userInTest và đưa dữ liệu đã chia vào đó****************************

  if (access === 'private') {
    await Promise.all(
      shuffleArray(testInfo.userIdList.split(','), 1).map(
        async (userId, index) => {
          const userInTest = await userInTestDAO.createUserInTest({
            userId: userId,
            testId: test.id,
            audioToEvaluate: test.audioTestSet[index].audioSet.map(
              (audioId, ind) => {
                return {
                  audioInTest: audioId,
                  evaluated: false,
                  index: ind,
                };
              },
            ),
          });
          test.audioTestSet[index].assignedTimes = 1;
          test.joinedUser.push(userId);
          return userInTest;
        },
      ),
    );
  }

  await test.save();

  // B6 : update voice cho team ****************************************************************

  await Promise.all(
    listAudioTeamIdFileName.map(async (teamId) => {
      const team = await teamDAO.findOneTeam(teamId);
      const randomAudioFileName = fs.readdirSync(
        `${extractDataPath}/audio/${teamId}`,
      )[0];
      const voice = randomAudioFileName.split('.')[0].split('-')[1];
      if (!team.voice) {
        team.voice = voice;
      }
      await team.save();
      return team;
    }),
  );

  return { test };
};

const sendResultToTeams = async (testId) => {
  const test = await testDAO.findOneTest(testId);
  if (!test) {
    throw new CustomError(
      codes.NOT_FOUND,
      'Không tìm thấy id của bài thí nghiệm',
    );
  }
  // const listAudiosInTest = await audioInTestDAO.findAudiosInTest({testId});

  const competition = await competitionDAO.findOneCompetition(
    test.competitionId,
  );

  await Promise.all(
    test.voices.map(async (voice) => {
      const team = await teamDAO.findOneTeam({ voice });
      if (competition.team.includes(team.id)) {
        if (!team.sentResultTestId.includes(testId)) {
          team.sentResultTestId.push(testId);
        }
        for (const userId of team.member) {
          const user = await userDAO.findOneUser(userId);
          await mailer.sendMail(
            user.email,
            `[VLSP TTS 2021] Kết quả đánh giá hệ thống tổng hợp tiếng nói`,
            `Xin chào <strong>${user.name}</strong>, <br />
          <br />
          Hiện tại hệ thống đã gửi kết quả các bài thí nghiệm dựa trên hệ thống tổng hợp tiếng nói của nhóm. <br/>
          Xin hãy đăng nhập và vào đúng cuộc thi, sau đó vào mục <strong>Kết quả thí nghiệm</strong> để xem chi tiết. <br />
          <br />
          
          Trân trọng, <br />
          BTC VLSP TTS 2021.`,
          );
        }

        await team.save();
      }
    }),
  );

  return { message: 'Gửi kết quả thành công' };
};

const getTestForTeam = async (teamId) => {
  const team = await teamDAO.findOneTeam(teamId);
  if (!team) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id của đội');
  }
  const tests = await Promise.all(
    team.sentResultTestId.map(async (testId) => {
      return await testDAO.findOneTest(testId);
    }),
  );

  return { tests };
};

const getAllAudiosInTestOfTeam = async ({ teamId, testId }) => {
  const team = await teamDAO.findOneTeam(teamId);
  if (!team) {
    throw new CustomError(codes.NOT_FOUND, 'Không tìm thấy id của đội');
  }
  const test = await testDAO.findOneTest(testId);
  if (!test) {
    throw new CustomError(
      codes.NOT_FOUND,
      'Không tìm thấy id của bài thí nghiệm',
    );
  }

  const audiosInTest = await audioInTestDAO.findAudiosInTest({
    testId,
    voice: team.voice,
  });

  return { audiosInTest };
};

module.exports = {
  createTest,
  getTestsInCompetition,
  getTestById,
  getAllPublicTest,
  getPrivateTestsForUser,
  getOneUserInTest,
  joinPublicTest,
  getUserInTestById,
  getAudioInTestById,
  updateEvaluatingAudioInMOSTest,
  getAudiosInTest,
  getAllUsersInTestDetail,
  createTestLatinSquare,
  sendResultToTeams,
  getTestForTeam,
  getAllAudiosInTestOfTeam,
};
