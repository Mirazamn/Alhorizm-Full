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

// New comment
router.post('/:id/comments', (req, res) => {
    fs.readFile(Path, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file!');
        }

        const posts = JSON.parse(data);
        const postIndex = posts.findIndex(p => Number(p.id) === Number(req.params.id));

        if (postIndex === -1) {
            return res.status(404).send("Error post not found!");
        }

        // 👇 comments mavjudligini tekshiramiz
        if (!Array.isArray(posts[postIndex].comments)) {
            posts[postIndex].comments = [];
        }

        // 👇 req.body ni tekshiramiz
        const { value, username, id } = req.body;
        if (!value || !username || typeof id !== 'number') {
            return res.status(400).send("Invalid comment data!");
        }

        posts[postIndex].comments.push({ value, username, id });

        fs.writeFile(Path, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing file!');
            }
            console.log('Comment added');
            res.json({ message: "Comment added successfully!" });
        });
    });
});

// Get comment by id
router.get('/:id/comments/:cid', (req,res) => {
    fs.readFile(Path, 'utf8', (err,data) => {
        if (err) {
            return res.status(500).send('Error in reading file!')
        }
        const posts = JSON.parse(data)
        const post = posts.find(p => Number(p.id) == Number(req.params.id))
        const comments = post.comments
        const comment = comments.find(c => Number(c.id) === Number(req.params.cid))
        res.json(comment)
    })
})

// Delete Comment
router.delete('/:id/comments/:cid', (req, res) => {
    fs.readFile(Path, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send("Error reading file!");
        }

        const posts = JSON.parse(data);
        const postIndex = posts.findIndex(p => Number(p.id) === Number(req.params.id));

        if (postIndex === -1) {
            return res.status(404).send("Post not found!");
        }

        const oldComments = posts[postIndex].comments || [];
        const newComments = oldComments.filter(c => Number(c.id) !== Number(req.params.cid));
        posts[postIndex].comments = newComments;

        fs.writeFile(Path, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                return res.status(500).send("Error writing file!");
            }
            console.log("Comment deleted");
            res.json({ message: "Comment deleted successfully!" });
        });
    });
});

// PUT Comment
router.put('/:id/comments/:cid', (req,res) => {
    fs.readFile(Path,'utf8',(err,data) => {
        if (err) {
            return res.status(500).send("Error reading file")
        }
        const posts = JSON.parse(data)
        const post = posts.find(p => Number(p.id) == Number(req.params.id))
        const postIndex = posts.findIndex(p => Number(p.id) == Number(req.params.id))
        if (postIndex === -1) {
            return res.status(404).send("Post not found!")
        }
        const comments = post.comments
        const commentIndex = comments.findIndex(c => Number(c.id) == Number(req.params.cid))
        comments[commentIndex] = {...comments[commentIndex], ...req.body}
        fs.writeFile(Path,JSON.stringify())
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