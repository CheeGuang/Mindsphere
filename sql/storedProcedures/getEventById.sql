CREATE PROCEDURE usp_get_event_by_id
    @eventID INT
AS
BEGIN

    SELECT 
        eventID,
        type,
        title,
        price,
        oldPrice,
        classSize,
        duration,
        lunchProvided,
        lessonMaterialsProvided,
        accessToMembership,
        availableDates,
        time,
        totalParticipants,
        venue,
        picture
    FROM 
        Event
    WHERE 
        eventID = @eventID;
END;
