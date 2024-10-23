CREATE PROCEDURE usp_get_unique_event_types
AS
BEGIN
    SELECT 
        type, 
        MIN(picture) AS picture -- Use MIN to get one image for each event type
    FROM [event]
    GROUP BY type; -- Group by type to ensure each type is unique
END;
