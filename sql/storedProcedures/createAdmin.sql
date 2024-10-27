CREATE PROCEDURE usp_create_admin
    @firstName NVARCHAR(100),
    @lastName NVARCHAR(100),
    @email NVARCHAR(100),
    @contactNo NVARCHAR(20),
    @password NVARCHAR(100)
AS
BEGIN
    -- Check if an admin with the given email already exists
    IF EXISTS (SELECT 1 FROM [admin] WHERE email = @email)
    BEGIN
        -- Update the existing admin's details
        UPDATE [admin]
        SET firstName = @firstName,
            lastName = @lastName,
            contactNo = @contactNo,
            password = @password
        WHERE email = @email;

        -- Return the ID of the updated admin
        SELECT adminID AS updatedAdminID
        FROM [admin]
        WHERE email = @email;
    END
    ELSE
    BEGIN
        -- Insert a new admin if email does not exist
        INSERT INTO [admin] (firstName, lastName, email, contactNo, password)
        VALUES (@firstName, @lastName, @email, @contactNo, @password);

        -- Return the ID of the newly created admin
        SELECT SCOPE_IDENTITY() AS newAdminID;
    END
END;
