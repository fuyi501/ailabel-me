
const tokens = {
  admin: {
    token: 'admin-token',
    pwd: '123456'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://alioss.fuwenwei.com/img/20210927130725.jpeg',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://alioss.fuwenwei.com/img/20210927130725.jpeg',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/ailabel-me/user/login',
    type: 'post',
    response: config => {
      const { username, password } = config.body
      const { token, pwd } = tokens[username]

      if (token && password === pwd) {
        return {
          code: 20000,
          data: {
            tokenHead: 'Bearer',
            token: token
          }
        }
      }

      return {
        code: 60204,
        message: '用户名或密码错误'
      }
    }
  },

  // get user info
  {
    url: '/ailabel-me/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]
      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/ailabel-me/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
