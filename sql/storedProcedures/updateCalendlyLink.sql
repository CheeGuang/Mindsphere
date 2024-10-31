CREATE PROCEDURE usp_update_calendly_link
    @adminID INT,
    @calendlyLink NVARCHAR(500)
AS
BEGIN
    -- Check if the adminID exists in the admin table
    IF EXISTS (SELECT 1 FROM admin WHERE adminID = @adminID)
    BEGIN
        -- Update the Calendly link for the specified adminID
        UPDATE admin
        SET calendlyLink = @calendlyLink
        WHERE adminID = @adminID;

        PRINT 'Calendly link updated successfully.';
    END
    ELSE
    BEGIN
        PRINT 'Admin ID not found.';
    END
END;
