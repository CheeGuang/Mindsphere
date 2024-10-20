CREATE PROCEDURE usp_get_member_email_verification
    @email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT emailVC, emailVCTimestamp
    FROM [member]
    WHERE email = @email;
END;