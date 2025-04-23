module.exports = {
  NODE_ENV: '"production"',
  AUTH_API_ADDRESS: JSON.stringify(process.env.AUTH_API_ADDRESS || ''),
  USERS_API_ADDRESS: JSON.stringify(process.env.USERS_API_ADDRESS || ''),
  TODOS_API_ADDRESS: JSON.stringify(process.env.TODOS_API_ADDRESS || '')
}
