CREATE PROCEDURE usp_update_or_create_admin_by_email
    @email NVARCHAR(100),
    @newEmailVC NVARCHAR(100)
AS
BEGIN
    -- Check if the email exists
    IF EXISTS (SELECT 1 FROM [admin] WHERE email = @email)
    BEGIN
        -- If the email exists, update the emailVC and emailVCTimestamp
        UPDATE [admin]
        SET 
            emailVC = @newEmailVC,
            emailVCTimestamp = GETDATE()
        WHERE 
            email = @email;
        
        -- Return success message for the update
        SELECT 'Email verification code updated successfully' AS Message;
    END
    ELSE
    BEGIN
        -- If the email does not exist, insert a new admin record with email, emailVC, and timestamp
        INSERT INTO [admin] (email, emailVC, emailVCTimestamp)
        VALUES (@email, @newEmailVC, GETDATE());
        
        -- Return success message for the new record
        SELECT 'New admin created successfully' AS Message;
    END
END;
