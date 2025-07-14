const express = require('express')
const fs = require('fs')
const router = express.Router()
const Path = 'Database/users.json'

// Get all Users
router.get('/', (req,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            console.log('Error reading file ' + err);
        }
        res.json(JSON.parse(data))
    })
})

// Get user by :id
router.get('/:id', (req,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            console.log("Error reading file :id" + err);
        }
        const users = JSON.parse(data)
        const user = users.find(u => u.id == req.params.id)
        if (!user) {
            res.status(404).send('User not found')
        }
        res.json(user)
    })
})

// Delete user 
router.delete('/:id', (req,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            console.log('Error reading file ' + err);
        }
        const users = JSON.parse(data)
        const user = users.find(u => Number(u.id) == Number(req.params.id))
        if (!user) {
            res.status(404).send('404 User is not found!')
        }
        const updatedUsers = users.filter(u => Number(u.id) != Number(req.params.id))
        fs.writeFile(Path, JSON.stringify(updatedUsers,null,2), (err,data) => {
            if (err) {
                console.log("Error deleting user " + err);
            }
            console.log("User deleted");
            return res.send('User deleted successfully!')
        })
    })
})

// Update user
router.put('/:id', (req,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            return res.status(500).send("Error reading file!")
        }
        const users = JSON.parse(data)
        const userIndex = users.findIndex(p => Number(p.id) == Number(req.params.id))
        if (userIndex <= -1) {
            return res.status(404).send('404 User not found!')
        }

        users[userIndex] = {...users[userIndex], ...req.body}
        fs.writeFile(Path, JSON.stringify(users,null,2), (err,data) => {
            if (err) {
                return res.status(500).send("Error writing file!")
            }
            console.log("User updated!");
            res.json(users[userIndex])
        })
    })
})

// New User
router.post('/', (req,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            console.log("Error in reading file " + err)
            return res.status(404).send("User is not found?")
        }
        const users = JSON.parse(data)
        const user = users.find(u => Number(u.id) == Number(req.body.id))
        if (user) {
            return res.status(404).send("User is not found!")
        }
        const updatedUsers = [...users, req.body]
        fs.writeFile(Path, JSON.stringify(updatedUsers,null,2), (err,data) => {
            if (err) {
                res.send("Error writing file " + err)
            }
            console.log("User Added");
            return res.send('User posted successfully!')
        })
    })
})


module.exports = router