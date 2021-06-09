const User = require('../models/user');
const Blog = require('../models/blog')
const Comment = require('../models/comments')

const resolvers = {
    Query: {
      getAllUser :async(parants,args,context) =>{
          if(context.user){
            return users = await User.find()
          }
          else return 'please authenticate'
        
        },
      getAllBlogsOfUser : async() =>{
        return blogs = await Blog.find({owner:context.user._id})
        }
    },

    Mutation :{
        //sign up user

        createUser :async(parants,args,context) => {
            const {name,email,password} = args
            const user = new User({name,email,password})
            try {
                await user.save()
                const token = await user.generateAuthToken()
                return user
            } catch (e) {
               return e
            }
        },

        //login user

        loginUser:async(parants,args,context)  =>{
            const {email,password} = args
            try {
                const user = await User.findByCredentials(email,password)
                const token = await user.generateAuthToken()
                return user
            } catch (e) {
                return e
            }
        },

        //create Blog by authorized user

        createBlog :async(parants,args,context) => {
            const {title,body,tags} = args
            if(!context){
               return 'Unauthenticated'
            }
            const userId = context._id
            const blog = new Blog({title,body,tags,owner:userId})
            try {
                await blog.save()
                return blog
            } catch (e) {
               return e
            }
        },

        //update blog by owner

        updateBlog: async(parants,args,context) => {

            if(!context) return 'Unauthenticated'

            const updates = Object.keys(args)
            const allowedUpdates = ['title','body','tags','idOfBlog']
            const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
            if (!isValidOperation) {
                return 'Invalid updates'
            }
            try {
                const blog = await Blog.findOne({ _id: args.idOfBlog, owner: context._id})
                if (!blog) {
                    return 'not found'
                }
                updates.forEach((update) => blog[update] = args[update])
                    await blog.save()
                    return blog
                } catch (e) {
                    return 'Something went wrong'
                }
        },

        //delete blog by owner

        deleteBlog : async (parants,args,context) => {
            
            try {
                if(!context) return 'Unauthenticated'
                const blog = await Blog.findOneAndDelete({ _id: args.idOfBlog, owner: context._id})
                if (!blog) {
                    return 'not found'
                }
                return blog
            } catch (error) {
                return error
            }
        },

        //comment in blog
        
        commentOnBlog: async (parants,args,context) =>{
            try {
                if(!context) return 'unauthenticated'
                const {body , idOfBlog} = args
                let comment = new Comment ({
                    body:body,
                    authorId: context._id,
                })
        
                let _id = idOfBlog
                let blog = await Blog.findOne({ _id })
        
                if(!blog){
                    return 'not found'
                }
        
                blog.comments.unshift(comment)
                await blog.save()
                await comment.save()
                return blog
        
            }   catch (e) {
                return e
            }
        }
        
    }
  };
  module.exports =  resolvers