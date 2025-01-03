CREATE PROCEDURE usp_get_active_blog_meetups_by_category
    @categoryID INT
AS
BEGIN
    SELECT bm.*, bc.name AS categoryName
    FROM blogMeetUp bm
    INNER JOIN blogCategory bc ON bm.categoryID = bc.categoryID
    WHERE bm.categoryID = @categoryID AND bm.startDateTime > GETDATE()
    ORDER BY bm.startDateTime;
END;