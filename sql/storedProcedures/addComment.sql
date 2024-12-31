CREATE PROCEDURE usp_add_comment
    @postID INT,
    @memberID INT,
    @comment NVARCHAR(1000),
    @posterType NVARCHAR(10)
AS
BEGIN
    INSERT INTO blogComment (postID, memberID, comment, posterType, createdAt)
    VALUES (@postID, @memberID, @comment, @posterType, GETDATE());

    SELECT SCOPE_IDENTITY() AS commentID;
END;