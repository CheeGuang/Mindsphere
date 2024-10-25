CREATE PROCEDURE usp_get_member_details_by_memberEventID
    @memberEventID INT
AS
BEGIN
    SELECT 
        me.memberEventID,
        m.memberID,
        m.firstName,
        m.lastName,
        m.email,
        m.contactNo,
        me.fullName,
        me.age,
        me.schoolName,
        me.interests,
        me.medicalConditions,
        me.lunchOption,
        me.specifyOther,
        e.eventID,
        e.title,
        e.type,
        e.price,
        e.venue,
        e.availableDates,
        e.time
    FROM 
        memberEvent me
    INNER JOIN 
        [member] m ON me.memberID = m.memberID
    INNER JOIN 
        [event] e ON me.eventID = e.eventID
    WHERE 
        me.memberEventID = @memberEventID;
END;
