CREATE PROCEDURE usp_get_posts_by_category
    @CategoryID INT
AS
BEGIN
    SELECT 
        bp.postID,
        bp.title,
        bp.content,
        bp.posterType,
        bp.updatedAt,
        m.firstName + ' ' + m.lastName AS author,
        bc.name AS categoryName,
        (SELECT COUNT(*) FROM postUpvote WHERE postID = bp.postID) AS numberOfLikes,
        (SELECT COUNT(*) FROM blogComment WHERE postID = bp.postID) AS numberOfComments
    FROM blogPost bp
    INNER JOIN [member] m ON bp.memberID = m.memberID
    INNER JOIN blogCategory bc ON bp.categoryID = bc.categoryID
    WHERE bp.categoryID = @CategoryID
    ORDER BY bp.createdAt DESC;
END;
