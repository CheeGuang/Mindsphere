CREATE PROCEDURE usp_edit_blog_post
    @postID INT,
    @title NVARCHAR(200),
    @content NVARCHAR(MAX)
AS
BEGIN
    UPDATE blogPost
    SET title = @title, content = @content, updatedAt = GETDATE()
    WHERE postID = @postID;
END;