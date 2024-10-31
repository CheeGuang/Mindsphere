CREATE PROCEDURE usp_get_all_appointments_by_adminID
    @AdminID INT
AS
BEGIN
    SELECT 
        a.AppointmentID,
        a.MemberID,
        a.AdminID,
        a.startDateTime,
        a.endDateTime,
        a.ParticipantURL,
        a.HostRoomURL,
        m.firstName AS MemberFirstName,
        m.lastName AS MemberLastName,
        m.profilePicture AS MemberProfilePicture,
        m.email AS MemberEmail
    FROM 
        appointment a
    INNER JOIN 
        [member] m ON a.MemberID = m.memberID
    WHERE 
        a.AdminID = @AdminID;
END;
