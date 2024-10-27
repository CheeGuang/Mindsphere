CREATE PROCEDURE usp_get_admin_email_verification
    @email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT emailVC, emailVCTimestamp
    FROM [admin]
    WHERE email = @email;
END;
