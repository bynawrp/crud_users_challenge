import fs from 'node:fs'
import path from "node:path"

const cwd = process.cwd()
const dataPath = path.join(cwd, "data", "menu.json")
let menuFile;

try {
    menuFile = JSON.parse(fs.readFileSync(dataPath, "utf8"))
} catch (e) {
    console.error(e)
    process.exit(0)
}

export const getMenu = () => {
    return menuFile;
}