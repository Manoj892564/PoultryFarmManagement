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
}