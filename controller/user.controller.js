import fs from 'node:fs'
import path from "node:path"
import { convertDate } from '../utils/utils.js'

const cwd = process.cwd()
const dataPath = path.join(cwd, "data", "users.json")
let usersFile;

try {
    usersFile = JSON.parse(fs.readFileSync(dataPath, "utf8"))

    for (const user of usersFile) {
        // console.log(user)
        user.birth = convertDate(user.birth)
        // console.log("-----APRES-----")
        // console.log(user)
        // console.log("\n")
    }

} catch (e) {
    console.error(e)
    process.exit(0)
}

export const getUsers = () => {
    return usersFile;
}

export const addUser = (_name, _date) => {
    const newUser = { name: _name, birth: convertDate(_date, undefined, 'YYYY-MM-DD') }
    usersFile.push(newUser)
    saveUsers(usersFile)
    return newUser
}

export const deleteUser = (index) => {
    const deletedUser = usersFile.splice(index, 1)[0]
    saveUsers(usersFile)
    return deletedUser
}

export const getUserByIndex = (index) => {
    let user = usersFile[index]

    if (user) {
        user.birth = convertDate(user.birth, 'YYYY-MM-DD', 'DD-MM-YYYY')
    }
    return user
}

export const updateUser = (_name, _date, index) => {
    usersFile[index] = {
        name: _name,
        birth: convertDate(_date, undefined, 'YYYY-MM-DD'),
    }
    saveUsers(usersFile)
    return usersFile[index]
}

export const getUserByName = (name) => {
    return usersFile.find((user) => user.nom.toLowerCase() === name)
}

export const saveUsers = (users) => {
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2))
}