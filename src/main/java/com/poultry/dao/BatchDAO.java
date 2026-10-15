package com.poultry.dao;

import com.poultry.model.Batch;
import com.poultry.util.DBConnection;
import java.sql.*;
import java.util.*;

public class BatchDAO {
    public List<Batch> getAllBatches() {
        List<Batch> batches = new ArrayList<>();
        String sql = "SELECT batch_id, batch_name, breed, bird_count, arrival_date, status FROM batches ORDER BY batch_id ASC";
        Connection conn = null; Statement stmt = null; ResultSet rs = null;
        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            while (rs.next()) {
                Batch b = new Batch();
                b.setBatchId(rs.getInt("batch_id"));
                b.setBatchName(rs.getString("batch_name"));
                b.setBreed(rs.getString("breed"));
                b.setBirdCount(rs.getInt("bird_count"));
                b.setArrivalDate(rs.getDate("arrival_date"));
                b.setStatus(rs.getString("status"));
                batches.add(b);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
        return batches;
    }

    public int getTotalBirds() {
        String sql = "SELECT COALESCE(SUM(bird_count), 0) AS total FROM batches WHERE status = 'Active'";
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

    public int getActiveBatchCount() {
        String sql = "SELECT COUNT(*) AS total FROM batches WHERE status = 'Active'";
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

    public boolean addBirdsToBatch(int batchId, int additionalBirds) {
        String sql = "UPDATE batches SET bird_count = bird_count + ? WHERE batch_id = ?";
        Connection conn = null; PreparedStatement ps = null;
        try {
            conn = DBConnection.getConnection();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, additionalBirds);
            ps.setInt(2, batchId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } finally {
            DBConnection.close(conn, ps);
        }
    }
}