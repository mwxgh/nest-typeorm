export const LoggerConstant = {
  fileName: `${process.env.NODE_ENV}-%DATE%.log`,
  storageDirname: 'logs',
  maxFiles: 365,
  fatalLevel: 'fail',
  errorLevel: 'error',
  warnLevel: 'warn',
  infoLevel: 'info',
  debugLevel: 'debug',
  queryPrefix: 'Query: ',
  parameterPrefix: ' -- PARAMETERS: ',
  queryLogLevelsDev: ['log', 'warn', 'query', 'schema', 'migration'],
  queryLogLevels: ['error', 'migration'],
  queryLogLevelsTest: ['log', 'warn'],
  success: 'Complete 200 OK',
  badRequest: 'Completed 400 Bad Request',
  notFound: 'Completed 404 Not Found',
  pageNotFound: 'Completed 404 Page Not Found',
  forbidden: 'Completed 403 Forbidden',
  unauthorized: 'Completed 401 Unauthorized',
  unprocessable: 'Completed 422 Unprocessable',
  internalServer: 'INTERNAL SERVER ERROR',
  introspectionQuery: 'IntrospectionQuery',
  typeOrmFirstQuery: 'TypeOrmFirstQuery',
  backgroundJobContext: 'BackgroundJob',
  queryFailed: 'Query failed',
  notFoundErrorResponse: 'Not found ne`',
  uncaughtException: 'UncaughtException',
  unhandledRejection: 'UnhandledRejection',
}
