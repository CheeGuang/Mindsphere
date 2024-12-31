CREATE PROCEDURE usp_delete_blog_post
    @postID INT
AS
BEGIN
    DELETE FROM blogPost WHERE postID = @postID;
END;