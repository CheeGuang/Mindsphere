CREATE PROCEDURE usp_update_admin
    @adminID INT,
    @firstName NVARCHAR(100) = NULL,
    @lastName NVARCHAR(100) = NULL,
    @email NVARCHAR(100) = NULL,
    @contactNo NVARCHAR(20) = NULL,
    @bio NVARCHAR(1000) = NULL
AS
BEGIN
  

    -- Check if the admin with the specified adminID exists
    IF EXISTS (SELECT 1 FROM admin WHERE adminID = @adminID)
    BEGIN
        -- Update only the fields provided
        UPDATE [admin]
        SET
            firstName = COALESCE(@firstName, firstName),
            lastName = COALESCE(@lastName, lastName),
            email = COALESCE(@email, email),
            contactNo = COALESCE(@contactNo, contactNo),
            bio = COALESCE(@bio, bio)
        WHERE adminID = @adminID;

        -- Return success message
        SELECT 'Admin updated successfully' AS Message, @adminID AS updatedAdminID;
    END
    ELSE
    BEGIN
        -- Return error message if adminID not found
        SELECT 'Admin not found' AS ErrorMessage;
    END
END;
