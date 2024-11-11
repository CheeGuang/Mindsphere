CREATE PROCEDURE usp_get_event_by_member_id
    @memberID INT
AS
BEGIN
    SELECT 
        e.eventID,
        e.type,
        e.title,
        e.price,
        e.oldPrice, 
        e.classSize, 
        e.duration,
        e.lunchProvided, 
        e.lessonMaterialsProvided, 
        e.accessToMembership, 
        e.availableDates,
        e.time,
        e.totalParticipants,
        e.venue,
        e.picture,
        me.memberEventID,
        me.fullName,
        me.experience
    FROM 
        Event e
    INNER JOIN 
        memberEvent me ON e.eventID = me.eventID
    WHERE 
        me.memberID = @memberID;
END;
