package com.poultry.controller;

import com.poultry.dao.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;

@WebServlet("/dashboard")
public class DashboardServlet extends HttpServlet {
    private BatchDAO batchDAO = new BatchDAO();
    private EggCollectionDAO eggDAO = new EggCollectionDAO();
    private FeedDAO feedDAO = new FeedDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loggedUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        int totalBirds = batchDAO.getTotalBirds();
        int activeBatches = batchDAO.getActiveBatchCount();
        int todayEggs = eggDAO.getTodayTotalEggs();
        int monthlyEggs = eggDAO.getMonthlyTotalEggs(month, year);
        BigDecimal monthlyFeedKg = feedDAO.getMonthlyTotalFeed(month, year);
        BigDecimal monthlyFeedCost = feedDAO.getMonthlyTotalFeedCost(month, year);

        double eggProductionRate = 0.0;
        if (totalBirds > 0) {
            eggProductionRate = Math.round(((double) todayEggs / totalBirds) * 1000.0) / 10.0;
        }

        request.setAttribute("totalBirds", totalBirds);
        request.setAttribute("activeBatches", activeBatches);
        request.setAttribute("todayEggs", todayEggs);
        request.setAttribute("monthlyEggs", monthlyEggs);
        request.setAttribute("monthlyFeedKg", monthlyFeedKg);
        request.setAttribute("monthlyFeedCost", monthlyFeedCost);
        request.setAttribute("eggProductionRate", eggProductionRate);
        request.setAttribute("batchEggData", eggDAO.getMonthlyEggCollectionByBatch(month, year));
        request.setAttribute("allBatches", batchDAO.getAllBatches());

        request.getRequestDispatcher("/dashboard.jsp").forward(request, response);
    }
}