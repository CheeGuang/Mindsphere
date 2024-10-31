CREATE PROCEDURE usp_create_appointment
    @MemberID INT,
    @AdminID INT,
    @startDateTime NVARCHAR(40),
    @endDateTime NVARCHAR(40),
    @ParticipantURL NVARCHAR(1000),
    @HostRoomURL NVARCHAR(1000)
AS
BEGIN
    INSERT INTO appointment (MemberID, AdminID, startDateTime, endDateTime, ParticipantURL, HostRoomURL)
    VALUES (@MemberID, @AdminID, @startDateTime, @endDateTime, @ParticipantURL, @HostRoomURL);
END;
