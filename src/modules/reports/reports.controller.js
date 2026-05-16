import * as reportsService from './reports.service.js';

/**
 * TCP handler: returns financial summary for the authenticated user.
 */
export const handleGetFinancialSummary = async (data) => {
  const summary = await reportsService.getFinancialSummary(data.user.id);

  return {
    statusCode: 200,
    body: {
      success: true,
      summary,
    },
  };
};

/**
 * TCP handler: returns daily revenue/expense breakdown for charting.
 */
export const handleGetSalesChart = async (data) => {
  const days = data.query?.days || 30;
  const chartData = await reportsService.getSalesOverTime(data.user.id, days);

  return {
    statusCode: 200,
    body: {
      success: true,
      chartData,
    },
  };
};

/**
 * TCP handler: returns the user's top 5 most-sold products.
 */
export const handleGetTopProducts = async (data) => {
  const topProducts = await reportsService.getTopProducts(data.user.id);

  return {
    statusCode: 200,
    body: {
      success: true,
      topProducts,
    },
  };
};
