import bcrypt from 'bcrypt'

export const create = async (pw) => {
  return bcrypt.hashSync(pw, 10)
}

export const check = async (pw, hash) => {
  return await bcrypt.compare(pw, hash)
}


