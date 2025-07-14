const express = require('express')
const fs = require('fs')
const router = express.Router()
const Path = 'Database/posts.json'

// Get all posts
router.get('/', (err,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            return res.status(500).send("Error reading file!")
        }
        res.json(JSON.parse(data))
    })
})

// Get post by ID
router.get('/:id', (req,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            return res.status(500).send('Error reading file!')
        }
        const posts = JSON.parse(data)
        const post = posts.find(p => Number(p.id) == Number(req.params.id))
        if (!post) {
            return res.status(404).send("Error post not found")
        }
        res.json(post)
    })
})

// Get comments
router.get('/:id/comments', (req,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            return res.status(500).send('Error reading file!')
        }
        const posts = JSON.parse(data)
        const post = posts.find(p => Number(p.id) == req.params.id)
        if (!post) {
            return res.status(404).send("Error post not found!")
        }
        res.json(post.comments)
    })
})

// Delete post
router.delete('/:id', (req,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            return res.status(500).send("Error reading file!")
        }
        const posts = JSON.parse(data)
        const updatedPosts = posts.filter(p => Number(p.id) != Number(req.params.id))

        fs.writeFile(Path, JSON.stringify(updatedPosts,null,2), (err,data) => {
            if (err) {
                return res.status(500).send("Error writing file")
            }
            console.log("Post deleted");
            return res.json(updatedPosts)
        })
    })
})

// Add post
router.post('/', (req,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            return res.status(500).send("Error reading file!")
        }
        const posts = JSON.parse(data)
        const post = req.body
        const updatedPosts = [...posts, req.body]
        fs.writeFile(Path, JSON.stringify(updatedPosts,null,2), (err,data) => {
            if (err) {
                return res.status(500).send('Error writing file!')
            }
            console.log('User added');
            res.json({ message: "Post added successfully!"})
        })
    })
})

// Update Post
router.put('/:id', (req,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            return res.status(500).send("Error reading file!")
        }
        const posts = JSON.parse(data)
        const postIndex = posts.findIndex(p => Number(p.id) == Number(req.params.id))
        if (postIndex <= -1) {
            return res.status(404).send('404 User not found!')
        }

        posts[postIndex] = {...posts[postIndex], ...req.body}
        fs.writeFile(Path, JSON.stringify(posts,null,2), (err,data) => {
            if (err) {
                return res.status(500).send("Error writing file!")
            }
            console.log("Post updated!");
            res.json(posts[postIndex])
        })
    })
})


module.exports = router