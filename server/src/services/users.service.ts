const bcrypt = require('bcrypt')

const { db } = require('../utils/db')

export const findUserByEmail = (email) => {
  return db.user.findUnique({
    where: {
      email
    }
  })
}

export const createUserByEmailAndPassword = (user) => {
  user.password = bcrypt.hashSync(user.password, 12)
  return db.user.create({
    data: user
  })
}

export const findUserById = (id) => {
  return db.user.findUnique({
    where: {
      id
    }
  })
}

export const listUsers = () => {
  return db.user.findMany()
}
