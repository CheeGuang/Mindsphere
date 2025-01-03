// ========== Packages ==========
// Initialising express
const express = require("express");

// ========== Controllers ==========
// Initialising BlogController
const BlogController = require("./blogController");

// ========== Set-up ==========
// Initialising blogRoutes
const blogRoutes = express.Router();

// ========== Routes ==========
// Route to create a new post
blogRoutes.post("/create-post", BlogController.createPost);

// Route to edit a post
blogRoutes.put("/edit-post", BlogController.editPost);

// Route to delete a post
blogRoutes.delete("/delete-post/:postID", BlogController.deletePost);

// Route to get posts by category
blogRoutes.get(
  "/posts-by-category/:categoryID",
  BlogController.getPostsByCategory
);

// Route to search posts by title
blogRoutes.get("/search-posts", BlogController.searchPostsByTitle);

// Route to upvote a post
blogRoutes.post("/upvote-post", BlogController.upvotePost);

// Route to remove an upvote
blogRoutes.post("/remove-upvote", BlogController.removeUpvote);

// Route to add a comment
blogRoutes.post("/add-comment", BlogController.addComment);

// Route to update a comment
blogRoutes.put("/update-comment", BlogController.updateComment);

// Route to get all categories
blogRoutes.get("/categories", BlogController.getAllCategories);

// Route to get all posts
blogRoutes.get("/posts", BlogController.getAllPosts);

// Route to get all active blog meet-ups
blogRoutes.get("/active-blog-meetups", BlogController.getAllActiveBlogMeetUps);

// Route to delete a comment
blogRoutes.delete("/delete-comment/:commentID", BlogController.deleteComment);

// Route to get a post with all comments
blogRoutes.get(
  "/post-with-comments/:postID",
  BlogController.getPostWithComments
);

// Route to get active blog meet-ups by category
blogRoutes.get(
  "/active-blog-meetups/:categoryID",
  BlogController.getActiveBlogMeetUpsByCategory
);

// Route to get all posts liked by a user
blogRoutes.get("/liked-posts/:memberID", BlogController.getPostsLikedByUser);

// ========== Export ==========
module.exports = blogRoutes;
