package com.poultry.controller;

import com.poultry.dao.BatchDAO;
import com.poultry.model.Batch;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.sql.Date;

@WebServlet("/batches")
public class BatchServlet extends HttpServlet {
    private BatchDAO batchDAO = new BatchDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loggedUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }
        request.setAttribute("batchList", batchDAO.getAllBatches());
        request.getRequestDispatcher("/batches.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loggedUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        String batchIdStr = request.getParameter("batchId");
        String addCountStr = request.getParameter("additionalBirds");

        if (batchIdStr != null && addCountStr != null) {
            try {
                int batchId = Integer.parseInt(batchIdStr);
                int addCount = Integer.parseInt(addCountStr);
                if (addCount > 0) {
                    batchDAO.addBirdsToBatch(batchId, addCount);
                }
            } catch (NumberFormatException ignored) {}
        }
        response.sendRedirect(request.getContextPath() + "/batches");
    }
}