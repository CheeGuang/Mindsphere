CREATE PROCEDURE usp_get_all_active_blog_meetups
AS
BEGIN
    SELECT bm.meetUpID, bm.title, bm.description, bm.isOnline, bm.startDateTime, bm.endDateTime, bm.venue, bm.link, bc.name AS categoryName
    FROM blogMeetUp bm
    INNER JOIN blogCategory bc ON bm.categoryID = bc.categoryID
    WHERE bm.startDateTime > GETDATE()
    ORDER BY bm.startDateTime;
END;
