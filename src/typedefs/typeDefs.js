const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Token {
         id:ID
        token:String
    }
    type User {
        id:ID!
        name:String!
        email:String!
        password:String!
        followTags:[String]
        tokens:[Token]
    }

    type Comment {
        id:ID
        body:String
       authorId:String
   }
   type Blogs {
       id:ID!
       title:String!
       body:String!
       tags:[String]!
       comments:[Comment]
       owner:String
   }
    type Query {
        getAllUser:[User]
        getAllBlogsOfUser:[Blogs]
    }

    type Mutation {

        createUser( name:String!, email:String!, password:String! ) : User!

        loginUser( email:String!, password:String! ) :User!

        createBlog( title:String!, body:String!, tags:[String]! ) : Blogs!

        updateBlog( title:String, body:String, tags:[String],idOfBlog:String! ) : Blogs

        deleteBlog( idOfBlog:String! ):Blogs

        commentOnBlog( idOfBlog:String!, body:String ):Blogs
    }
`;
module.exports= typeDefs