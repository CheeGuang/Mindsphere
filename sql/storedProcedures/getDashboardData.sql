CREATE PROCEDURE usp_get_dashboard_data
AS
BEGIN
    -- Step 1: Extract the first available date and store it in a temporary table
    IF OBJECT_ID('tempdb..#EventDates') IS NOT NULL
        DROP TABLE #EventDates;

    SELECT 
        e.eventID,
        e.type,
        e.title,
        e.price,
        ISNULL(e.totalParticipants, 0) AS totalParticipants, -- Ensure no NULL values
        CAST(LEFT(e.availableDates, CHARINDEX(',', e.availableDates + ',') - 1) AS DATE) AS FirstAvailableDate
    INTO #EventDates
    FROM 
        [event] e;

    -- 1. Total Sales Revenue (for Chart)
    WITH EventRevenue AS (
        SELECT 
            FORMAT(FirstAvailableDate, 'yyyy-MM') AS MonthYear,
            price AS EventPrice,
            SUM(totalParticipants) AS TotalParticipants,
            SUM(price * totalParticipants) AS Revenue
        FROM 
            #EventDates
        GROUP BY 
            FORMAT(FirstAvailableDate, 'yyyy-MM'), price
    )
    SELECT 
        MonthYear,
        SUM(Revenue) AS TotalRevenue
    FROM 
        EventRevenue
    GROUP BY 
        MonthYear
    ORDER BY 
        MonthYear;

    -- 2. Monthly Sales Revenue (for KPI)
    SELECT 
        FORMAT(GETDATE(), 'yyyy-MM') AS CurrentMonth,
        SUM(CASE WHEN FORMAT(FirstAvailableDate, 'yyyy-MM') = FORMAT(GETDATE(), 'yyyy-MM') THEN price * totalParticipants ELSE 0 END) AS CurrentMonthSalesRevenue,
        FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM') AS LastMonth,
        SUM(CASE WHEN FORMAT(FirstAvailableDate, 'yyyy-MM') = FORMAT(DATEADD(MONTH, -1, GETDATE()), 'yyyy-MM') THEN price * totalParticipants ELSE 0 END) AS LastMonthSalesRevenue
    FROM 
        #EventDates;

    -- 3. Top 3 Most Popular Workshops
    SELECT 
        TOP 3 title AS WorkshopTitle,
        SUM(totalParticipants) AS TotalParticipants
    FROM 
        #EventDates
    GROUP BY 
        title
    ORDER BY 
        TotalParticipants DESC;

    -- 4. Total Members with Valid Membership and Membership Breakdown
    SELECT 
        COUNT(*) AS TotalMembers,
        COUNT(CASE WHEN membershipEndDate IS NULL THEN 1 ELSE NULL END) AS MembersWithNullEndDate,
        COUNT(CASE WHEN membershipEndDate IS NOT NULL THEN 1 ELSE NULL END) AS MembersWithEndDate
    FROM 
        [member];

    -- 5. Top 10 Participants (Event Attendance)
    SELECT 
        m.firstName + ' ' + m.lastName AS ParticipantName,
        COUNT(me.memberEventID) AS AttendanceCount
    FROM 
        [member] m
    LEFT JOIN 
        memberEvent me ON m.memberID = me.memberID
    GROUP BY 
        m.firstName, m.lastName
    ORDER BY 
        AttendanceCount DESC
    OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY;

    -- 6. Total Events (Completed vs. Upcoming)
    SELECT 
        COUNT(CASE WHEN FirstAvailableDate < GETDATE() THEN 1 ELSE NULL END) AS CompletedEvents,
        COUNT(CASE WHEN FirstAvailableDate >= GETDATE() THEN 1 ELSE NULL END) AS UpcomingEvents,
        COUNT(eventID) AS TotalEvents
    FROM 
        #EventDates;

    -- 7. Upcoming Workshops Breakdown
    SELECT 
        type AS WorkshopType,
        COUNT(eventID) AS UpcomingWorkshops
    FROM 
        #EventDates
    WHERE 
        FirstAvailableDate >= GETDATE()
    GROUP BY 
        type;

    -- 8. Members with Membership Expiring within the Next 1 Month
    SELECT 
        memberID,
        firstName,
        lastName,
        email,
        membershipEndDate
    FROM 
        [member]
    WHERE 
        membershipEndDate IS NOT NULL
        AND membershipEndDate BETWEEN GETDATE() AND DATEADD(MONTH, 1, GETDATE());

    -- 9. Members with Null Membership End Date
    SELECT 
        memberID,
        firstName,
        lastName,
        email
    FROM 
        [member]
    WHERE 
        membershipEndDate IS NULL;

    -- Drop the temporary table to clean up
    DROP TABLE #EventDates;
END;
