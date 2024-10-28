CREATE PROCEDURE usp_get_all_appointments_by_memberID
    @MemberID INT
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
        a.requestDescription,
        ad.firstName AS AdminFirstName,
        ad.lastName AS AdminLastName,
        ad.profilePicture AS AdminProfilePicture,
        ad.bio AS AdminBio,
        ad.email AS AdminEmail
    FROM 
        appointment a
    INNER JOIN 
        admin ad ON a.AdminID = ad.adminID
    WHERE 
        a.MemberID = @MemberID;
END;
