import * as bcrypt from "bcrypt";
const SALT_ROUNDS = 10

exports.hash = async function hash(password: string) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS)
    const hashed = await bcrypt.hash(password, salt)
    return hashed
}

exports.compare = async function compare(password: string, hashed: string) {
    const match = await bcrypt.compare(password, hashed)
    return match
}