CREATE PROCEDURE usp_get_event_by_available_dates
  @availableDates NVARCHAR(100)
AS
BEGIN
  SELECT * 
  FROM events
  WHERE availableDates LIKE '%' + @availableDates + '%';
END
