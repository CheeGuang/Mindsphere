CREATE PROCEDURE usp_update_password_by_email
    @Email NVARCHAR(100),
    @NewPassword NVARCHAR(100)
AS
BEGIN
    -- Check if the email exists
    IF EXISTS (SELECT 1 FROM [member] WHERE email = @Email)
    BEGIN
        -- Update the password for the given email
        UPDATE [member]
        SET password = @NewPassword
        WHERE email = @Email;

        -- Return success message
        SELECT 'Password updated successfully' AS Message;
    END
    ELSE
    BEGIN
        -- Return error message if the email doesn't exist
        SELECT 'Email not found' AS Message;
    END
END;
