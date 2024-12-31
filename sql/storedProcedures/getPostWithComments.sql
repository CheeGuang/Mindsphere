CREATE PROCEDURE usp_get_post_with_comments
    @postID INT
AS
BEGIN
    -- Get the author's name and all comments for the post
    SELECT m.firstName + ' ' + m.lastName AS authorName, bc.*
    FROM blogComment bc
    INNER JOIN blogPost bp ON bc.postID = bp.postID
    INNER JOIN [member] m ON bc.memberID = m.memberID
    WHERE bc.postID = @postID
    ORDER BY bc.createdAt;
END;