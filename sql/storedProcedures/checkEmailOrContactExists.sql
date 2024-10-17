CREATE PROCEDURE usp_check_email_and_contact_exists
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [member] WHERE email = @Email AND contactNo IS NOT NULL)
    BEGIN
        SELECT memberID, 1 AS EmailExists, 1 AS ContactExists
        FROM [member]
        WHERE email = @Email AND contactNo IS NOT NULL; -- Both email and contact exist
    END
    ELSE IF EXISTS (SELECT 1 FROM [member] WHERE email = @Email)
    BEGIN
        SELECT memberID, 1 AS EmailExists, 0 AS ContactExists
        FROM [member]
        WHERE email = @Email; -- Email exists, but contact is missing
    END
    ELSE
    BEGIN
        SELECT NULL AS memberID, 0 AS EmailExists, 0 AS ContactExists; -- Neither email nor contact exist
    END
END;
