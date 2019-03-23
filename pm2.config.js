module.exports = {
  apps : [{
    name: 'API',
    script: 'app.js',
    error_file: '/data/logs/cos-web-toolkit/error.log',
    out_file : '/data/logs/cos-web-toolkit/std.out',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      CHAIN: 'http://localhost:8080',
    },
    env_test: {
      NODE_ENV: 'testing',
      CHAIN: 'https://testnode.contentos.io',
    },
    env_production: {
      NODE_ENV: 'production',
      CHAIN: 'https://testnode.contentos.io',
    },
  }],
};
