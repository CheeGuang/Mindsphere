CREATE PROCEDURE usp_update_google_member
    @firstName NVARCHAR(100),
    @lastName NVARCHAR(100),
    @Email NVARCHAR(100),
    @profilePicture NVARCHAR(500) = NULL -- Optional parameter
AS
BEGIN
    -- Check if the email already exists
    IF EXISTS (SELECT 1 FROM [member] WHERE email = @Email)
    BEGIN
        -- If email exists, return an error message
        PRINT 'Error: Email already exists.';
        RETURN;
    END

    -- Insert the new member into the member table
    INSERT INTO [member] (firstName, lastName, email, profilePicture)
    VALUES (@firstName, @lastName, @Email, @profilePicture);

    -- Return the new memberID of the inserted row
    SELECT SCOPE_IDENTITY() AS newMemberID;
END;
