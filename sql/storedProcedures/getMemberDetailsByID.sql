CREATE PROCEDURE usp_get_member_details_by_id
    @memberID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        memberID,
        firstName,
        lastName,
        email,
        emailVC,
        emailVCTimestamp,
        contactNo,
        contactNoVC,
        contactNoVCTimestamp,
        profilePicture
    FROM 
        [member]
    WHERE 
        memberID = @memberID;
END;
