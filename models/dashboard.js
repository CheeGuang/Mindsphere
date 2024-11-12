const sql = require("mssql"); // Import the mssql library for SQL Server database operations
const dbConfig = require("../dbConfig"); // Import the database configuration

class Dashboard {
  // Fetch data for the overall dashboard
  static async getDashboardData() {
    let pool;
    try {
      console.log("Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("Database connected.");

      console.log("Executing stored procedure: usp_get_dashboard_data");
      const result = await pool.request().execute("usp_get_dashboard_data"); // Execute the stored procedure

      console.log("Stored procedure executed successfully.");

      // Parse and structure the result sets
      const dashboardData = {
        totalRevenue: result.recordsets[0], // Monthly total revenue (chart)
        currentVsLastMonthSales: result.recordsets[1][0], // Current and last month sales
        topWorkshops: result.recordsets[2], // Top 3 most popular workshops
        totalMembers: result.recordsets[3][0].TotalMembers, // Total valid members
        topParticipants: result.recordsets[4], // Top 10 participants by attendance
        eventCounts: result.recordsets[5][0], // Completed vs upcoming events
        upcomingWorkshops: result.recordsets[6], // Breakdown of upcoming workshops
      };

      return dashboardData;
    } catch (error) {
      console.error(`Error in Dashboard.getDashboardData: ${error.message}`);
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("Database connection closed.");
      }
    }
  }

  static async getEventDashboardData(eventID) {
    let pool;
    try {
      console.log("Connecting to the database...");
      pool = await sql.connect(dbConfig); // Connect to the database
      console.log("Database connected.");

      console.log(
        `Executing stored procedure: usp_get_event_dashboard_data for EventID: ${eventID}`
      );
      const result = await pool
        .request()
        .input("EventID", sql.Int, eventID) // Input parameter for EventID
        .execute("usp_get_event_dashboard_data"); // Execute the stored procedure

      console.log("Stored procedure executed successfully.");

      // Parse and structure the result sets
      const eventData = {
        totalRevenue: result.recordsets[0][0]?.TotalRevenue || 0, // Total revenue for the event
        totalParticipants: result.recordsets[1][0]?.TotalParticipants || 0, // Total participants
        upcomingDates: result.recordsets[2][0]?.UpcomingDates || "N/A", // Upcoming dates
        eventTimingVenue: result.recordsets[3][0] || {}, // Timing and venue
        participantInterests: result.recordsets[4], // Interests and age group
        averageAge: result.recordsets[5][0]?.AverageAge || 0, // Average age
        dietaryPreferences: result.recordsets[6], // Dietary preferences
        eventStatus: result.recordsets[7][0]?.EventStatus || "Unknown", // Event status
        participantFeedback: result.recordsets[8].map((feedback) => ({
          experience: feedback.experience,
          pace: feedback.pace,
          liked: feedback.liked,
          disliked: feedback.disliked,
          additionalComments: feedback.additionalComments,
        })), // Participant feedback (experience, pace, liked, disliked, comments)
      };

      return eventData;
    } catch (error) {
      console.error(
        `Error in Dashboard.getEventDashboardData: ${error.message}`
      );
      throw error;
    } finally {
      if (pool) {
        await pool.close(); // Close the database connection if pool was defined
        console.log("Database connection closed.");
      }
    }
  }
}

module.exports = Dashboard;
