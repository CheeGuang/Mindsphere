CREATE PROCEDURE usp_get_event_by_eventID
    @eventID INT
AS
BEGIN
    -- Select event details by eventID
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
        [event]
    WHERE 
        eventID = @eventID;
END;
