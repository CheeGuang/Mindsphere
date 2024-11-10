// ========== Models ==========
const Dashboard = require("../../models/dashboard"); // Importing the Dashboard model

// ========== Controller ==========
class DashboardController {
  /**
   * Controller to get general dashboard data
   */
  static async getDashboardData(req, res) {
    try {
      console.log("Fetching dashboard data...");

      // Fetch dashboard data from the model
      const dashboardData = await Dashboard.getDashboardData();

      // Structure the response
      const response = {
        totalRevenue: dashboardData.totalRevenue, // Monthly total revenue
        currentVsLastMonthSales: dashboardData.currentVsLastMonthSales, // KPI for current vs last month sales
        topWorkshops: dashboardData.topWorkshops, // Top 3 workshops
        totalMembers: dashboardData.totalMembers, // Total members with valid memberships
        topParticipants: dashboardData.topParticipants, // Top participants by attendance
        eventCounts: dashboardData.eventCounts, // Event breakdown (completed, upcoming, total)
        upcomingWorkshops: dashboardData.upcomingWorkshops, // Upcoming workshop breakdown
      };

      console.log("Dashboard data fetched successfully.");
      res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      console.error(
        `Error in DashboardController.getDashboardData: ${error.message}`
      );
      res.status(500).json({
        success: false,
        message: "Failed to retrieve dashboard data.",
        error: error.message,
      });
    }
  }

  /**
   * Controller to get event-specific dashboard data
   */
  static async getEventDashboardData(req, res) {
    try {
      const eventID = req.params.eventID; // Get EventID from request parameters
      console.log("Fetching event dashboard data for EventID:", eventID);

      // Validate eventID
      if (!eventID) {
        return res.status(400).json({
          success: false,
          message: "EventID is required.",
        });
      }

      // Fetch event-specific data from the model
      const eventData = await Dashboard.getEventDashboardData(eventID);

      console.log("Event dashboard data fetched successfully.");
      res.status(200).json({
        success: true,
        data: eventData,
      });
    } catch (error) {
      console.error(
        `Error in DashboardController.getEventDashboardData: ${error.message}`
      );
      res.status(500).json({
        success: false,
        message: "Failed to retrieve event dashboard data.",
        error: error.message,
      });
    }
  }
}

// ========== Export ==========
module.exports = DashboardController;
