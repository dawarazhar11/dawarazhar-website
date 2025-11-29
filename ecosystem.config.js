module.exports = {
  apps: [
    {
      name: 'dawarazhar-blog',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/dawarazhar.com',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/log/pm2/dawarazhar-error.log',
      out_file: '/var/log/pm2/dawarazhar-out.log',
      log_file: '/var/log/pm2/dawarazhar-combined.log',
      time: true
    }
  ]
}
