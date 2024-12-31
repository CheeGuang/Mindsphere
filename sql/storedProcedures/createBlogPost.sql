CREATE PROCEDURE usp_create_blog_post
    @memberID INT,
    @categoryID INT,
    @title NVARCHAR(200),
    @content NVARCHAR(MAX),
    @posterType NVARCHAR(10)
AS
BEGIN
    INSERT INTO blogPost (memberID, categoryID, title, content, posterType, createdAt, updatedAt)
    VALUES (@memberID, @categoryID, @title, @content, @posterType, GETDATE(), GETDATE());

    SELECT SCOPE_IDENTITY() AS postID;
END;