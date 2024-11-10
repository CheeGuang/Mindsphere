CREATE PROCEDURE usp_get_event_dashboard_data
    @EventID INT = 1 -- Default value is set to 1
AS
BEGIN
    -- Step 1: Extract event-specific data into a temporary table
    IF OBJECT_ID('tempdb..#SelectedEventData') IS NOT NULL
        DROP TABLE #SelectedEventData;

    SELECT 
        e.eventID,
        e.type AS EventType,
        e.title AS EventTitle,
        e.price,
        ISNULL(e.totalParticipants, 0) AS TotalParticipants,
        CAST(LEFT(e.availableDates, CHARINDEX(',', e.availableDates + ',') - 1) AS DATE) AS FirstAvailableDate,
        e.availableDates,
        e.time,
        e.venue
    INTO #SelectedEventData
    FROM [event] e
    WHERE e.eventID = @EventID;

    -- Step 2: Event-specific dashboard metrics

    -- 1. Total Revenue for the Event
    SELECT 
        EventTitle,
        SUM(TotalParticipants * price) AS TotalRevenue
    FROM #SelectedEventData
    GROUP BY EventTitle;

    -- 2. Total Participants Enrolled
    SELECT 
        EventTitle,
        SUM(TotalParticipants) AS TotalParticipants
    FROM #SelectedEventData
    GROUP BY EventTitle;

    -- 3. Upcoming Dates for the Event
    SELECT 
        EventTitle,
        availableDates AS UpcomingDates
    FROM #SelectedEventData
    GROUP BY EventTitle, availableDates;

    -- 4. Timing and Venue of the Event
    SELECT 
        EventTitle,
        time AS EventTiming,
        venue AS EventVenue
    FROM #SelectedEventData
    GROUP BY EventTitle, time, venue;

    -- 5. Participation Demographics (Age Groups, Interests, etc.)
    SELECT 
        me.age,
        me.interests,
        COUNT(me.memberEventID) AS ParticipantCount
    FROM memberEvent me
    INNER JOIN #SelectedEventData ed ON me.eventID = ed.eventID
    GROUP BY me.age, me.interests;

    -- 6. Average Age of Participants
    SELECT 
        EventTitle,
        AVG(CAST(me.age AS FLOAT)) AS AverageAge
    FROM memberEvent me
    INNER JOIN #SelectedEventData ed ON me.eventID = ed.eventID
    GROUP BY EventTitle;

    -- 7. Dietary Preferences of Participants
    SELECT 
        me.lunchOption AS DietaryPreference,
        COUNT(me.memberEventID) AS PreferenceCount
    FROM memberEvent me
    INNER JOIN #SelectedEventData ed ON me.eventID = ed.eventID
    GROUP BY me.lunchOption;

    -- 8. Event Completion Status
    SELECT 
        EventTitle,
        CASE 
            WHEN MAX(FirstAvailableDate) < GETDATE() THEN 'Completed'
            ELSE 'Upcoming'
        END AS EventStatus
    FROM #SelectedEventData
    GROUP BY EventTitle;

    -- Clean up temporary table
    DROP TABLE #SelectedEventData;
END;
