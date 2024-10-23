CREATE PROCEDURE getMemberProfilePicture
    @MemberID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT profilePicture
    FROM [member]
    WHERE memberID = @MemberID;
END;
