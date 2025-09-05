import * as querystring from "querystring"
import http from "http"
import dotenv from "dotenv"
import pug from "pug"
import fs from "node:fs"
import path from "path"
import { deleteUser, getUsers, addUser, updateUser, getUserByIndex } from "./controller/user.controller.js"
import { displayError, validateDate } from "./utils/utils.js"
import { getMenu } from "./controller/menu.controller.js"

const cwd = process.cwd()
const viewPath = path.join(cwd, "view")
const stylePath = path.join(cwd, "assets", "css")

dotenv.config()

const hostname = process.env.APP_LOCALHOST
const port = process.env.APP_PORT

const menuItems = getMenu()

const server = http.createServer((req, res) => {
    const url = req.url.replace("/", "")

    //GET : skipFavicon
    if (url === "favicon.ico") {
        res.writeHead(200, {
            "content-type": "image/x-icon"
        })
        res.end()
        return
    }

    //GET : getStyleSheet
    if (url.startsWith("style")) {
        const filename = url.split("/")[1]
        fs.readFile(path.join(stylePath, filename), "utf8", (err, data) => {
            if (err) {
                res.writeHead(404, {
                    "content-type": "text/plain"
                })
                res.end(JSON.stringify(err))
            }
            res.writeHead(200, {
                "content-type": "text/css"
            })
            res.end(data)
        })
        return
    }

    //GET : Home
    if (url === "") {
        let html

        try {
            html = pug.renderFile(path.join(viewPath, "home.pug"), { menuItems, pretty: true })
            // console.log(html)
        } catch (e) {
            console.error(e)
            process.exit(0)
        }

        res.writeHead(200, {
            "content-type": "text/html"
        })
        res.end(html)
        return
    }

    //GET : Users
    if (url === "users") {
        const users = getUsers()
        // console.log(users)
        let html
        try {
            html = pug.renderFile(path.join(viewPath, "users.pug"), { menuItems, users, pretty: true })
            // console.log(html)
        } catch (e) {
            console.error(e)
            process.exit(0)
        }

        res.writeHead(200, {
            "content-type": "text/html"
        })
        res.end(html)
        return
    }

    //GET : deleteUser
    if (url.includes("delete") && req.method == "GET") {
        const index = url.split("/")[1]

        const userDeleted = deleteUser(index)

        console.log(`Utilisateur ${userDeleted.name} supprimé.`)
        res.writeHead(302, { "Location": `/users` })
        res.end()
        return

    }

    //POST : addUser
    if (url === "add" && req.method == "POST") {
        let body = ''

        req.on('data', data => {
            body += data
        })

        req.on('end', () => {
            const params = querystring.parse(body)

            if (params.name.trim() === "" || params.date.trim() === "" || !validateDate(params.date)) {

                let error = displayError(params.name, params.date)
                // console.log(error)

                let html
                try {
                    html = pug.renderFile(path.join(viewPath, "home.pug"), { menuItems, error, pretty: true })
                    // console.log(html)
                } catch (e) {
                    console.error(e)
                    process.exit(0)
                }

                res.writeHead(200, {
                    "content-type": "text/html"
                })
                res.end(html)
                return
            }

            // console.log((params.date))

            const newUser = addUser(params.name.trim(), params.date)

            console.log(`Utilisateur ${newUser.name} ajouté.`)
            res.writeHead(302, { 'Location': '/' })
            res.end()
        })
        return
    }


    //GET&POST : updateUser
    if (url.includes("update")) {
        const index = url.split("/")[1]
        const user = getUserByIndex(index)

        if (req.method === "GET") {
            // console.log(user)
            let html

            try {
                html = pug.renderFile(path.join(viewPath, "home.pug"), { menuItems, isUpdate: true, user, index, pretty: true })
                // console.log(html)
            } catch (e) {
                console.error(e)
                process.exit(0)
            }

            res.writeHead(200, {
                "content-type": "text/html"
            })
            res.end(html)
            return
        }

        if (req.method === "POST") {
            let body = ''

            req.on('data', data => {
                body += data
            })

            req.on('end', () => {

                const params = querystring.parse(body)

                if (params.name.trim() === "" || params.date.trim() === "" || !validateDate(params.date)) {

                    let error = displayError(params.name, params.date)
                    // console.log(error)

                    const index = parseInt(params.id)
                    const user = getUserByIndex(parseInt(index))

                    let html
                    try {
                        html = pug.renderFile(path.join(viewPath, "home.pug"), { menuItems, isUpdate: true, user, index, error, pretty: true })
                        // console.log(html)
                    } catch (e) {
                        console.error(e)
                        process.exit(0)
                    }

                    res.writeHead(200, {
                        "content-type": "text/html"
                    })
                    res.end(html)
                    return
                }
                // console.log((params.date))
                const userUpdate = updateUser(params.name.trim(), params.date, params.id)

                console.log(`Utilisateur ${userUpdate.name} modifié.`)
                res.writeHead(302, { 'Location': '/users' })
                res.end()
            })
            return
        }
    }

    //GET (default) : Error404
    let html
    try {
        html = pug.renderFile(path.join(viewPath, "error404.pug"), { menuItems, pretty: true })
        // console.log(html)
    } catch (e) {
        console.error(e)
        process.exit(0)
    }
    res.writeHead(200, {
        "content-type": "text/html"
    })
    res.end(html)
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});