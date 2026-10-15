package com.poultry.util;

import java.io.InputStream;
import java.net.URI;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class DBConnection {

    private static String driver = "org.postgresql.Driver";
    private static String url = "jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0";
    private static String user = "postgres.dwplfixdzaubssqgdbbw";
    private static String password = "Manojselvaraj@123412";

    static {
        loadConfiguration();
        try {
            Class.forName(driver);
        } catch (ClassNotFoundException e) {
            System.err.println("Database JDBC Driver class not found: " + driver);
            e.printStackTrace();
        }
    }

    private static void loadConfiguration() {
        Properties props = new Properties();
        try (InputStream in = DBConnection.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (in != null) {
                props.load(in);
                if (props.getProperty("db.driver") != null) driver = props.getProperty("db.driver").trim();
                if (props.getProperty("db.url") != null) url = props.getProperty("db.url").trim();
                if (props.getProperty("db.user") != null) user = props.getProperty("db.user").trim();
                if (props.getProperty("db.password") != null) password = props.getProperty("db.password").trim();
            }
        } catch (Exception e) {
            System.err.println("Could not load db.properties, using defaults: " + e.getMessage());
        }

        // Support environment variables / system properties
        String envUrl = System.getenv("DATABASE_URL") != null ? System.getenv("DATABASE_URL") : System.getenv("DB_URL");
        if (envUrl == null) {
            envUrl = System.getProperty("db.url");
        }

        if (envUrl != null && !envUrl.isEmpty()) {
            parseAndApplyUrl(envUrl);
        }

        String envUser = System.getenv("DB_USER") != null ? System.getenv("DB_USER") : System.getProperty("db.user");
        if (envUser != null && !envUser.isEmpty()) {
            user = envUser;
        }

        String envPass = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : System.getProperty("db.password");
        if (envPass != null) {
            password = envPass;
        }

        if (password != null && password.startsWith("[") && password.endsWith("]")) {
            password = password.substring(1, password.length() - 1);
        }

        // Infer driver if URL points to postgres or mysql
        if (url != null && url.startsWith("jdbc:postgresql:")) {
            driver = "org.postgresql.Driver";
        } else if (url != null && url.startsWith("jdbc:mysql:")) {
            driver = "com.mysql.cj.jdbc.Driver";
        }
    }

    private static void parseAndApplyUrl(String inputUrl) {
        if (inputUrl.startsWith("postgres://") || inputUrl.startsWith("postgresql://")) {
            try {
                URI uri = new URI(inputUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null) {
                    String[] parts = userInfo.split(":", 2);
                    if (parts.length > 0 && !parts[0].isEmpty()) user = parts[0];
                    if (parts.length > 1) password = parts[1];
                }
                String host = uri.getHost();
                int port = uri.getPort() != -1 ? uri.getPort() : 5432;
                String path = uri.getPath(); // includes leading '/'
                if (path == null || path.isEmpty()) path = "/postgres";

                url = "jdbc:postgresql://" + host + ":" + port + path + "?sslmode=require&prepareThreshold=0";
                driver = "org.postgresql.Driver";
            } catch (Exception e) {
                System.err.println("Failed to parse PostgreSQL URI, falling back to raw string: " + e.getMessage());
                url = inputUrl;
            }
        } else {
            url = inputUrl;
        }
    }

    public static Connection getConnection() throws SQLException {
        if (password == null || password.isEmpty() || "[YOUR-PASSWORD]".equals(password)) {
            System.err.println("WARNING: Database password is not set or still contains placeholder '[YOUR-PASSWORD]'.");
        }
        return DriverManager.getConnection(url, user, password);
    }

    public static void setPassword(String pass) {
        password = pass;
    }

    public static String getUrl() {
        return url;
    }

    public static String getUser() {
        return user;
    }

    public static void close(Connection conn, Statement stmt, ResultSet rs) {
        if (rs != null) { try { rs.close(); } catch (SQLException ignored) {} }
        if (stmt != null) { try { stmt.close(); } catch (SQLException ignored) {} }
        if (conn != null) { try { conn.close(); } catch (SQLException ignored) {} }
    }

    public static void close(Connection conn, Statement stmt) {
        close(conn, stmt, null);
    }

    public static void main(String[] args) {
        System.out.println("Testing DB Connection...");
        System.out.println("Target URL: " + url);
        System.out.println("Target User: " + user);
        try (Connection conn = getConnection()) {
            System.out.println("Connection successful: " + (conn != null && !conn.isClosed()));
        } catch (SQLException e) {
            System.err.println("Connection test failed: " + e.getMessage());
        }
    }
}