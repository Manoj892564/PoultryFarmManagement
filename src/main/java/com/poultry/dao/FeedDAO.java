package com.poultry.dao;

import com.poultry.model.FeedConsumption;
import com.poultry.util.DBConnection;
import java.math.BigDecimal;
import java.sql.*;
import java.util.*;

public class FeedDAO {
    public BigDecimal getMonthlyTotalFeed(int month, int year) {
        String sql = "SELECT COALESCE(SUM(quantity_kg), 0) AS total FROM feed_consumption WHERE EXTRACT(MONTH FROM feed_date) = ? AND EXTRACT(YEAR FROM feed_date) = ?";
        Connection conn = null; PreparedStatement ps = null; ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, month);
            ps.setInt(2, year);
            rs = ps.executeQuery();
            if (rs.next()) return rs.getBigDecimal("total");
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, ps, rs);
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal getMonthlyTotalFeedCost(int month, int year) {
        String sql = "SELECT COALESCE(SUM(total_cost), 0) AS total FROM feed_consumption WHERE EXTRACT(MONTH FROM feed_date) = ? AND EXTRACT(YEAR FROM feed_date) = ?";
        Connection conn = null; PreparedStatement ps = null; ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, month);
            ps.setInt(2, year);
            rs = ps.executeQuery();
            if (rs.next()) return rs.getBigDecimal("total");
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, ps, rs);
        }
        return BigDecimal.ZERO;
    }
}