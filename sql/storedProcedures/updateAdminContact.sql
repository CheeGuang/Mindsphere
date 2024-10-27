CREATE PROCEDURE usp_update_admin_contact
    @adminID INT,
    @contactNo NVARCHAR(20)
AS
BEGIN
    -- Check if the admin exists
    IF NOT EXISTS (SELECT 1 FROM [admin] WHERE adminID = @adminID)
    BEGIN
        -- If admin doesn't exist, return an error
        RAISERROR('Admin not found.', 16, 1);
        RETURN;
    END

    -- Update the contact number for the specified adminID
    UPDATE [admin]
    SET contactNo = @contactNo
    WHERE adminID = @adminID;

    -- Return success message
    SELECT 'Contact number updated successfully' AS Message;
END;
