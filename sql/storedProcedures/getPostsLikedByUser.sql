-- Stored Procedure: Get all posts liked by a user
CREATE PROCEDURE usp_GetPostsLikedByUser
    @memberID INT
AS
BEGIN
    -- Select liked post IDs for the given memberID
    SELECT 
        bp.postID
    FROM 
        postUpvote pu
    INNER JOIN 
        blogPost bp ON pu.postID = bp.postID
    WHERE 
        pu.memberID = @memberID;
END;
