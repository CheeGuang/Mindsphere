CREATE PROCEDURE usp_get_all_posts
AS
BEGIN
SELECT 
        bp.postID,
        bp.title,
        bp.content,
        bp.posterType,
		bp.createdAt,
		bp.updatedAt,
        m.firstName + ' ' + m.lastName AS author,
        bp.memberID,
        bc.name AS categoryName,
        (SELECT COUNT(*) FROM postUpvote WHERE postID = bp.postID) AS numberOfLikes,
        (SELECT COUNT(*) FROM blogComment WHERE postID = bp.postID) AS numberOfComments
    FROM blogPost bp
    INNER JOIN [member] m ON bp.memberID = m.memberID
    INNER JOIN blogCategory bc ON bp.categoryID = bc.categoryID
    ORDER BY bp.createdAt DESC;
END;
