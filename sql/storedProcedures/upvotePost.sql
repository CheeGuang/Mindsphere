CREATE PROCEDURE usp_upvote_post
    @postID INT,
    @memberID INT
AS
BEGIN
    INSERT INTO postUpvote (postID, memberID, createdAt)
    VALUES (@postID, @memberID, GETDATE());
END;