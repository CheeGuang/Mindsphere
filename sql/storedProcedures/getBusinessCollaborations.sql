CREATE PROCEDURE usp_get_business_collaborations
    @collaborationID INT = NULL -- Optional parameter to filter by collaborationID
AS
BEGIN
    SET NOCOUNT ON;

    IF @collaborationID IS NULL
    BEGIN
        -- Retrieve all records if no ID is specified
        SELECT * 
        FROM businessCollaboration;
    END
    ELSE
    BEGIN
        -- Retrieve a specific record by collaborationID
        SELECT * 
        FROM businessCollaboration
        WHERE collaborationID = @collaborationID;
    END
END;
