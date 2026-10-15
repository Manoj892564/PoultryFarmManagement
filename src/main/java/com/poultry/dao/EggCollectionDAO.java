package com.poultry.dao;

import com.poultry.model.EggCollection;
import com.poultry.util.DBConnection;
import java.sql.*;
import java.util.*;

public class EggCollectionDAO {
    public int getTodayTotalEggs() {
        String sql = "SELECT COALESCE(SUM(egg_quantity), 0) AS total FROM egg_collection WHERE collection_date = CURRENT_DATE";
        Connection conn = null; Statement stmt = null; ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            if (rs.next()) return rs.getInt("total");
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
        return 0;
    }

    public int getMonthlyTotalEggs(int month, int year) {
        String sql = "SELECT COALESCE(SUM(egg_quantity), 0) AS total FROM egg_collection WHERE EXTRACT(MONTH FROM collection_date) = ? AND EXTRACT(YEAR FROM collection_date) = ?";
        Connection conn = null; PreparedStatement ps = null; ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, month);
            ps.setInt(2, year);
            rs = ps.executeQuery();
            if (rs.next()) return rs.getInt("total");
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, ps, rs);
        }
        return 0;
    }

    public List<Map<String, Object>> getMonthlyEggCollectionByBatch(int month, int year) {
        List<Map<String, Object>> list = new ArrayList<>();
        String sql = "SELECT b.batch_id, b.batch_name, b.bird_count, b.breed, " +
                     "COALESCE(SUM(e.egg_quantity), 0) AS total_eggs, " +
                     "COALESCE(SUM(e.broken_eggs), 0) AS broken_eggs, " +
                     "COALESCE(SUM(e.good_eggs), 0) AS good_eggs " +
                     "FROM batches b LEFT JOIN egg_collection e ON b.batch_id = e.batch_id " +
                     "AND EXTRACT(MONTH FROM e.collection_date) = ? AND EXTRACT(YEAR FROM e.collection_date) = ? " +
                     "GROUP BY b.batch_id, b.batch_name, b.bird_count, b.breed ORDER BY b.batch_id ASC";
        Connection conn = null; PreparedStatement ps = null; ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, month);
            ps.setInt(2, year);
            rs = ps.executeQuery();
            while (rs.next()) {
                Map<String, Object> map = new HashMap<>();
                map.put("batchId", rs.getInt("batch_id"));
                map.put("batchName", rs.getString("batch_name"));
                map.put("breed", rs.getString("breed"));
                map.put("birdCount", rs.getInt("bird_count"));
                map.put("totalEggs", rs.getInt("total_eggs"));
                map.put("brokenEggs", rs.getInt("broken_eggs"));
                map.put("goodEggs", rs.getInt("good_eggs"));
                list.add(map);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, ps, rs);
        }
        return list;
    }
}