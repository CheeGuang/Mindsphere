CREATE PROCEDURE usp_check_email_and_contact_exists_admin
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM [admin] WHERE email = @Email AND contactNo IS NOT NULL)
    BEGIN
        SELECT adminID, 1 AS EmailExists, 1 AS ContactExists
        FROM [admin]
        WHERE email = @Email AND contactNo IS NOT NULL; -- Both email and contact exist
    END
    ELSE IF EXISTS (SELECT 1 FROM [admin] WHERE email = @Email)
    BEGIN
        SELECT adminID, 1 AS EmailExists, 0 AS ContactExists
        FROM [admin]
        WHERE email = @Email; -- Email exists, but contact is missing
    END
    ELSE
    BEGIN
        SELECT NULL AS adminID, 0 AS EmailExists, 0 AS ContactExists; -- Neither email nor contact exist
    END
END;
