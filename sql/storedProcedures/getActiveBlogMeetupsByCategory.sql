CREATE PROCEDURE usp_get_active_blog_meetups_by_category
    @categoryID INT
AS
BEGIN
    SELECT *
    FROM blogMeetUp
    WHERE categoryID = @categoryID AND startDateTime > GETDATE()
    ORDER BY startDateTime;
END;
