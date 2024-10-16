CREATE PROCEDURE usp_check_email_exists
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [member] WHERE email = @Email)
    BEGIN
        SELECT 1 AS EmailExists; -- 1 means true
    END
    ELSE
    BEGIN
        SELECT 0 AS EmailExists; -- 0 means false
    END
END;
