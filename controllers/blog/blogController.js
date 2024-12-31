const Blog = require("../../models/blog"); // Import the Blog model

class BlogController {
  // Controller to create a new post
  static async createPost(req, res) {
    try {
      console.log("[DEBUG] Creating a new post with data:", req.body);
      const post = await Blog.createPost(req.body);
      console.log("[DEBUG] New post created:", post);
      res.status(201).json(post);
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.createPost:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to edit a post
  static async editPost(req, res) {
    try {
      console.log("[DEBUG] Editing post with data:", req.body);
      await Blog.editPost(req.body);
      console.log("[DEBUG] Post edited successfully.");
      res.status(200).json({ message: "Post updated successfully." });
    } catch (error) {
      console.error("[DEBUG] Error in BlogController.editPost:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to delete a post
  static async deletePost(req, res) {
    try {
      console.log("[DEBUG] Deleting post with ID:", req.params.postID);
      await Blog.deletePost(req.params.postID);
      console.log("[DEBUG] Post deleted successfully.");
      res.status(200).json({ message: "Post deleted successfully." });
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.deletePost:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to get posts by category with additional details
  static async getPostsByCategory(req, res) {
    try {
      console.log(
        "[DEBUG] Fetching posts for category ID:",
        req.params.categoryID
      );
      const posts = await Blog.getPostsByCategory(req.params.categoryID);
      console.log("[DEBUG] Posts retrieved:", posts);
      res.status(200).json(posts);
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.getPostsByCategory:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to get all categories
  static async getAllCategories(req, res) {
    try {
      console.log("[DEBUG] Fetching all categories...");
      const categories = await Blog.getAllCategories();
      console.log("[DEBUG] Categories retrieved:", categories);
      res.status(200).json(categories);
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.getAllCategories:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to get all posts with additional details
  static async getAllPosts(req, res) {
    try {
      console.log("[DEBUG] Fetching all posts...");
      const posts = await Blog.getAllPosts();
      console.log("[DEBUG] Posts retrieved:", posts);
      res.status(200).json(posts);
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.getAllPosts:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to get all posts liked by a user
  static async getPostsLikedByUser(req, res) {
    try {
      console.log(
        "[DEBUG] Fetching posts liked by user with ID:",
        req.params.memberID
      );

      // Call the model function to get posts liked by the user
      const likedPosts = await Blog.getPostsLikedByUser(req.params.memberID);

      console.log("[DEBUG] Posts liked by user retrieved:", likedPosts);

      // Respond with the liked posts
      res.status(200).json({ success: true, data: likedPosts });
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.getPostsLikedByUser:",
        error.message
      );

      // Respond with an error message
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Controller to search posts by title
  static async searchPostsByTitle(req, res) {
    try {
      console.log("[DEBUG] Searching posts with title:", req.query.title);
      const posts = await Blog.searchPostsByTitle(req.query.title);
      console.log("[DEBUG] Posts retrieved:", posts);
      res.status(200).json(posts);
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.searchPostsByTitle:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to upvote a post
  static async upvotePost(req, res) {
    try {
      console.log("[DEBUG] Upvoting post with data:", req.body);
      await Blog.upvotePost(req.body.postID, req.body.memberID);
      console.log("[DEBUG] Post upvoted successfully.");
      res.status(200).json({ message: "Post upvoted successfully." });
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.upvotePost:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to remove upvote
  static async removeUpvote(req, res) {
    try {
      console.log("[DEBUG] Removing upvote with data:", req.body);
      await Blog.removeUpvote(req.body.postID, req.body.memberID);
      console.log("[DEBUG] Upvote removed successfully.");
      res.status(200).json({ message: "Upvote removed successfully." });
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.removeUpvote:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to add a comment
  static async addComment(req, res) {
    try {
      console.log("[DEBUG] Adding comment with data:", req.body);
      const comment = await Blog.addComment(req.body);
      console.log("[DEBUG] Comment added:", comment);
      res.status(201).json(comment);
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.addComment:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to update a comment
  static async updateComment(req, res) {
    try {
      console.log("[DEBUG] Updating comment with data:", req.body);
      await Blog.updateComment(req.body.commentID, req.body.comment);
      console.log("[DEBUG] Comment updated successfully.");
      res.status(200).json({ message: "Comment updated successfully." });
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.updateComment:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to delete a comment
  static async deleteComment(req, res) {
    try {
      console.log("[DEBUG] Deleting comment with ID:", req.params.commentID);
      await Blog.deleteComment(req.params.commentID);
      console.log("[DEBUG] Comment deleted successfully.");
      res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.deleteComment:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to get post with all comments
  static async getPostWithComments(req, res) {
    try {
      console.log(
        "[DEBUG] Fetching post with comments for ID:",
        req.params.postID
      );
      const post = await Blog.getPostWithComments(req.params.postID);
      console.log("[DEBUG] Post with comments retrieved:", post);
      res.status(200).json(post);
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.getPostWithComments:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }

  // Controller to get active blog meet-ups by category
  static async getActiveBlogMeetUpsByCategory(req, res) {
    try {
      console.log(
        "[DEBUG] Fetching active blog meet-ups for category ID:",
        req.params.categoryID
      );
      const meetups = await Blog.getActiveBlogMeetUpsByCategory(
        req.params.categoryID
      );
      console.log("[DEBUG] Active blog meet-ups retrieved:", meetups);
      res.status(200).json(meetups);
    } catch (error) {
      console.error(
        "[DEBUG] Error in BlogController.getActiveBlogMeetUpsByCategory:",
        error.message
      );
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = BlogController;
