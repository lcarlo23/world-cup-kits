export default {
  mongodbMemoryServerOptions: {
    binary: {
      version: '6.0.6',
      skipMD5: true,
    },
    instance: {
      dbName: 'test_db',
    },
    autoStart: false,
  },
};
