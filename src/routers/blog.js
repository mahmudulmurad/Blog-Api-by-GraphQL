const express = require('express')
const Blog = require('../models/blog')
const Comment = require('../models/comments');
const auth = require('../middleware/auth')
const router = new express.Router()


//Create Blog
router.post('/blog', auth, async (req, res) => {
    const blog = new Blog({
            ...req.body,
            owner: req.user._id,
        });

    try {
        await blog.save()
        res.status(201).send({ blog })
    }
    catch (error) {
        res.status(403).send(error)
        }  
    })

//My Blogs
router.get('/myBlog', auth, async (req, res) => {
    try {
        const blog = await Blog.find({owner: req.user._id })
        if (!blog) {
            return res.status(404).send('not found')
        }
        res.status(200).send(blog)
    } catch (e) {
        res.status(500).send()
    }
})

// Other authenticated user can comment on blog
router.post('/blog/:blogId/comments',auth,async(req,res) =>{
    try {

        let comment = new Comment ({
            ...req.body,
            authorId: req.user._id,
        })

        let _id = req.params.blogId
        let blog = await Blog.findOne({ _id })

        if(!blog){
            return res.status(404).send('not found')
        }

        blog.comments.unshift(comment)
        await blog.save()
        await comment.save()
        res.status(201).send(blog)

    }   catch (e) {
        res.status(500).send(e)
    }
})

//Blog owner can delete the blog
router.delete('/blog/:id', auth, async (req, res) => {
    try {
        let user = await req.user
        const blog = await Blog.findOneAndDelete({ _id: req.params.id, owner: user._id })
        if (!blog) {
            res.status(404).send('not found')
        }
        res.send(blog)
    } catch (e) {
        res.status(500).send()
    }
})

//Owner can update the blogs title,body and tags
router.patch('/blog/update/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title','body','tags']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const blog = await Blog.findOne({ _id: req.params.id, owner: req.user._id})
        if (!blog) {
            return res.status(404).send('not found')
        }
        updates.forEach((update) => blog[update] = req.body[update])
            await blog.save()
            return res.status(201).send(blog)
        } catch (e) {
            res.status(400).send('Something went wrong')
        }
        res.send(blog)
})

module.exports = router