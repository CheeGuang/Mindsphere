CREATE PROCEDURE usp_edit_blog_post
    @postID INT,
    @title NVARCHAR(200),
    @content NVARCHAR(MAX),
    @categoryID INT,
    @posterType NVARCHAR(50)
AS
BEGIN
    UPDATE blogPost
    SET 
        title = @title,
        content = @content,
        categoryID = @categoryID,
        posterType = @posterType,
        updatedAt = GETDATE()
    WHERE postID = @postID;
END;
