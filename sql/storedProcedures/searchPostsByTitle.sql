CREATE PROCEDURE usp_search_posts_by_title
    @title NVARCHAR(200)
AS
BEGIN
    SELECT *
    FROM blogPost
    WHERE title LIKE @title
    ORDER BY createdAt DESC;
END;