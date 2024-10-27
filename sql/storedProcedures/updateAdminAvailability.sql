CREATE PROCEDURE usp_update_admin_availability
    @adminID INT,
    @newAvailability NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the provided adminID exists
    IF EXISTS (SELECT 1 FROM admin WHERE adminID = @adminID)
    BEGIN
        -- Update the availability field
        UPDATE admin
        SET availability = @newAvailability
        WHERE adminID = @adminID;

        PRINT 'Availability updated successfully.';
    END
    ELSE
    BEGIN
        PRINT 'Admin with the provided ID does not exist.';
    END
END;
