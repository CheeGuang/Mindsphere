CREATE PROCEDURE usp_get_post_with_comments
    @postID INT
AS
BEGIN
    SELECT * FROM blogPost WHERE postID = @postID;

    SELECT * FROM blogComment
    WHERE postID = @postID
    ORDER BY createdAt;
END;