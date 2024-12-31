CREATE PROCEDURE usp_delete_comment
    @commentID INT
AS
BEGIN
    DELETE FROM blogComment
    WHERE commentID = @commentID;
END;
