CREATE PROCEDURE usp_update_google_admin
    @firstName NVARCHAR(100),
    @lastName NVARCHAR(100),
    @Email NVARCHAR(100),
    @profilePicture NVARCHAR(500) = NULL -- Optional parameter
AS
BEGIN
    -- Check if the email already exists
    IF EXISTS (SELECT 1 FROM [admin] WHERE email = @Email)
    BEGIN
        -- If email exists, return an error message
        PRINT 'Error: Email already exists.';
        RETURN;
    END

    -- Insert the new admin into the admin table
    INSERT INTO [admin] (firstName, lastName, email, profilePicture)
    VALUES (@firstName, @lastName, @Email, @profilePicture);

    -- Return the new adminID of the inserted row
    SELECT SCOPE_IDENTITY() AS newAdminID;
END;
