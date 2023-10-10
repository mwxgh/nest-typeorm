export const IS_PUBLIC = 'isPublic';

export const AppConstant = {
  dev: 'dev',
  serverDev: 'development',
  test: 'test',
  prod: 'production',
  stg: 'staging',
  startQueryInsert: 'INSERT INTO',
  uniqueQueryCode: 'ER_DUP_ENTRY',
  locationMomentTimezone: 'Asia/Ho_Chi_Minh',
  blackListField: ['username', 'email', 'password'],
  numDigitsHidden: 6,
  characterHidden: '*',
  maxCharacterLog: 200,
  maxDelayDays: 999,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: true,
  },
  saltOrRounds: 10,
  retryAttempts: 3,
  awsS3PresignedExpiresIn: 1800,
  maxParamLength: 1000,
  maxRecordHandleOnce: 1000,
};
