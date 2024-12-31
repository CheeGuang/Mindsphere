CREATE PROCEDURE usp_remove_upvote
    @postID INT,
    @memberID INT
AS
BEGIN
    DELETE FROM postUpvote
    WHERE postID = @postID AND memberID = @memberID;
END;