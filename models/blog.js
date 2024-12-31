const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration

class Blog {
  // Create a new post
  static async createPost({
    memberID,
    categoryID,
    title,
    content,
    posterType,
  }) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input("memberID", sql.Int, memberID)
        .input("categoryID", sql.Int, categoryID)
        .input("title", sql.NVarChar(200), title)
        .input("content", sql.NVarChar(sql.MAX), content)
        .input("posterType", sql.NVarChar(10), posterType)
        .execute("usp_create_blog_post");

      return result.recordset[0];
    } finally {
      if (pool) await pool.close();
    }
  }

  // Edit a post
  static async editPost({ postID, title, content }) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      await pool
        .request()
        .input("postID", sql.Int, postID)
        .input("title", sql.NVarChar(200), title)
        .input("content", sql.NVarChar(sql.MAX), content)
        .execute("usp_edit_blog_post");
    } finally {
      if (pool) await pool.close();
    }
  }

  // Delete a post
  static async deletePost(postID) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      await pool
        .request()
        .input("postID", sql.Int, postID)
        .execute("usp_delete_blog_post");
    } finally {
      if (pool) await pool.close();
    }
  }

  // Get posts by category with additional details
  static async getPostsByCategory(categoryID) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input("categoryID", sql.Int, categoryID)
        .execute("usp_get_posts_by_category");

      return result.recordset;
    } finally {
      if (pool) await pool.close();
    }
  }

  // Get all categories
  static async getAllCategories() {
    let pool;
    try {
      pool = await sql.connect(dbConfig);

      const result = await pool.request().execute("usp_get_all_categories");
      console.log("Hi");
      console.log(result.recordset);

      return result.recordset;
    } finally {
      if (pool) await pool.close();
    }
  }

  // Get all posts with additional details
  static async getAllPosts() {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool.request().execute("usp_get_all_posts");

      return result.recordset;
    } finally {
      if (pool) await pool.close();
    }
  }

  // Get all posts liked by a specific user
  static async getPostsLikedByUser(memberID) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input("memberID", sql.Int, memberID)
        .execute("usp_GetPostsLikedByUser"); // Calls the stored procedure to get liked posts

      return result.recordset; // Returns the list of liked posts
    } catch (error) {
      console.error("Error fetching liked posts:", error.message);
      throw new Error("Could not fetch liked posts");
    } finally {
      if (pool) await pool.close(); // Ensure connection is closed
    }
  }

  // Search posts by matching title
  static async searchPostsByTitle(title) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input("title", sql.NVarChar(200), `%${title}%`)
        .execute("usp_search_posts_by_title");

      return result.recordset;
    } finally {
      if (pool) await pool.close();
    }
  }

  // Upvote a post
  static async upvotePost(postID, memberID) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      await pool
        .request()
        .input("postID", sql.Int, postID)
        .input("memberID", sql.Int, memberID)
        .execute("usp_upvote_post");
    } finally {
      if (pool) await pool.close();
    }
  }

  // Remove upvote
  static async removeUpvote(postID, memberID) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      await pool
        .request()
        .input("postID", sql.Int, postID)
        .input("memberID", sql.Int, memberID)
        .execute("usp_remove_upvote");
    } finally {
      if (pool) await pool.close();
    }
  }

  // Add a comment
  static async addComment({ postID, memberID, comment, posterType }) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input("postID", sql.Int, postID)
        .input("memberID", sql.Int, memberID)
        .input("comment", sql.NVarChar(1000), comment)
        .input("posterType", sql.NVarChar(10), posterType)
        .execute("usp_add_comment");

      return result.recordset[0];
    } finally {
      if (pool) await pool.close();
    }
  }

  // Update a comment
  static async updateComment(commentID, comment) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      await pool
        .request()
        .input("commentID", sql.Int, commentID)
        .input("comment", sql.NVarChar(1000), comment)
        .execute("usp_update_comment");
    } finally {
      if (pool) await pool.close();
    }
  }

  // Delete a comment
  static async deleteComment(commentID) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      await pool
        .request()
        .input("commentID", sql.Int, commentID)
        .execute("usp_delete_comment");
    } finally {
      if (pool) await pool.close();
    }
  }

  // Get post with all comments
  static async getPostWithComments(postID) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input("postID", sql.Int, postID)
        .execute("usp_get_post_with_comments");

      return result.recordset;
    } finally {
      if (pool) await pool.close();
    }
  }

  // Get all active blog meet-ups by category
  static async getActiveBlogMeetUpsByCategory(categoryID) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input("categoryID", sql.Int, categoryID)
        .execute("usp_get_active_blog_meetups_by_category");

      return result.recordset;
    } finally {
      if (pool) await pool.close();
    }
  }
}

module.exports = Blog;
