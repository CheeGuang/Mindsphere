CREATE PROCEDURE usp_get_event_by_member_id
    @memberID INT
AS
BEGIN

    SELECT 
        e.eventID,
        e.type,
        e.title,
        e.price,
        e.duration,
        e.availableDates,
        e.time,
        e.totalParticipants,
        e.venue
    FROM 
        Event e
    JOIN 
        memberEvent me ON e.eventID = me.eventID
    WHERE 
        me.memberID = @memberID;
END;
