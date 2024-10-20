CREATE PROCEDURE usp_get_all_event
BEGIN
    SELECT 
        eventID,
        type,
        title,
        price,
        duration,
        availableDates,
        time,
        totalParticipants,
        venue
    FROM 
        Event;
END;