CREATE PROCEDURE getAdminProfilePicture
    @AdminID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT profilePicture
    FROM [admin]
    WHERE adminID = @AdminID;
END;
