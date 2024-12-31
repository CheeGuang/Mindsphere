CREATE PROCEDURE usp_update_comment
    @commentID INT,
    @comment NVARCHAR(1000)
AS
BEGIN
    UPDATE blogComment
    SET comment = @comment, createdAt = GETDATE()
    WHERE commentID = @commentID;
END;