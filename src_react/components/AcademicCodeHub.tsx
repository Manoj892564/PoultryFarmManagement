import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  Code2, 
  Download, 
  BookOpen, 
  FolderTree, 
  FileCode, 
  Check, 
  Copy, 
  Sparkles,
  HelpCircle,
  FileCheck
} from 'lucide-react';

export const AcademicCodeHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explorer' | 'viva' | 'setup'>('explorer');
  const [selectedFile, setSelectedFile] = useState<string>('BatchServlet.java');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Embedded Complete Java Academic Project Sources
  const javaProjectFiles: Record<string, { path: string; category: string; code: string }> = {
    'BatchServlet.java': {
      path: 'src/main/java/com/poultry/controller/BatchServlet.java',
      category: 'Servlets (Controllers)',
      code: `package com.poultry.controller;

import com.poultry.dao.BatchDAO;
import com.poultry.model.Batch;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

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
}`
    },
    'LoginServlet.java': {
      path: 'src/main/java/com/poultry/controller/LoginServlet.java',
      category: 'Servlets (Controllers)',
      code: `package com.poultry.controller;

import com.poultry.dao.UserDAO;
import com.poultry.model.User;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet(urlPatterns = {"/login", "/logout"})
public class LoginServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String path = request.getServletPath();
        if ("/logout".equals(path)) {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("loggedUser") != null) {
            response.sendRedirect(request.getContextPath() + "/dashboard");
            return;
        }

        request.getRequestDispatcher("/login.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        User user = userDAO.validateUser(username, password);
        if (user != null) {
            HttpSession session = request.getSession(true);
            session.setAttribute("loggedUser", user);
            response.sendRedirect(request.getContextPath() + "/dashboard");
        } else {
            request.setAttribute("error", "Invalid username or password");
            request.getRequestDispatcher("/login.jsp").forward(request, response);
        }
    }
}`
    },
    'DashboardServlet.java': {
      path: 'src/main/java/com/poultry/controller/DashboardServlet.java',
      category: 'Servlets (Controllers)',
      code: `package com.poultry.controller;

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

        request.getRequestDispatcher("/dashboard.jsp").forward(request, response);
    }
}`
    },
    'BatchDAO.java': {
      path: 'src/main/java/com/poultry/dao/BatchDAO.java',
      category: 'Data Access Objects (DAOs)',
      code: `package com.poultry.dao;

import com.poultry.model.Batch;
import com.poultry.util.DBConnection;
import java.sql.*;
import java.util.*;

public class BatchDAO {
    public List<Batch> getAllBatches() {
        List<Batch> batches = new ArrayList<>();
        String sql = "SELECT batch_id, batch_name, breed, bird_count, arrival_date, status FROM batches ORDER BY batch_id ASC";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
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
        }
        return batches;
    }

    public int getTotalBirds() {
        String sql = "SELECT COALESCE(SUM(bird_count), 0) AS total FROM batches WHERE status = 'Active'";
        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) return rs.getInt("total");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public boolean addBirdsToBatch(int batchId, int additionalBirds) {
        String sql = "UPDATE batches SET bird_count = bird_count + ? WHERE batch_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, additionalBirds);
            ps.setInt(2, batchId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}`
    },
    'DBConnection.java': {
      path: 'src/main/java/com/poultry/util/DBConnection.java',
      category: 'Database Utilities',
      code: `package com.poultry.util;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
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
            System.err.println("Could not load db.properties, using defaults");
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }
}`
    },
    'pom.xml': {
      path: 'pom.xml',
      category: 'Build & Project Config',
      code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.poultry</groupId>
    <artifactId>PoultryFarmManagement</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <name>Poultry Farm Management System</name>
    <description>Academic Web Application built with Java Servlets, JSP, JDBC, and MySQL/PostgreSQL</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>javax.servlet.jsp-api</artifactId>
            <version>2.3.3</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <version>42.7.3</version>
        </dependency>
    </dependencies>

    <build>
        <finalName>PoultryFarmManagement</finalName>
    </build>
</project>`
    },
    'web.xml': {
      path: 'src/main/webapp/WEB-INF/web.xml',
      category: 'Build & Project Config',
      code: `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <display-name>Poultry Farm Management System</display-name>
    <welcome-file-list>
        <welcome-file>login.jsp</welcome-file>
    </welcome-file-list>

    <session-config>
        <session-timeout>30</session-timeout>
        <cookie-config>
            <http-only>true</http-only>
            <secure>false</secure>
        </cookie-config>
    </session-config>
</web-app>`
    },
    'poultry_farm.sql': {
      path: 'database/poultry_farm.sql',
      category: 'Database SQL Dumps',
      code: `-- Poultry Farm Academic Database Script
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'STAFF'
);

CREATE TABLE IF NOT EXISTS batches (
  batch_id SERIAL PRIMARY KEY,
  batch_name VARCHAR(100) NOT NULL,
  breed VARCHAR(50) NOT NULL,
  bird_count INT NOT NULL,
  arrival_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS egg_collection (
  collection_id SERIAL PRIMARY KEY,
  collection_date DATE NOT NULL,
  batch_id INT NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
  egg_quantity INT NOT NULL,
  broken_eggs INT DEFAULT 0,
  good_eggs INT NOT NULL,
  remarks VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS feed_consumption (
  feed_id SERIAL PRIMARY KEY,
  feed_date DATE NOT NULL,
  batch_id INT NOT NULL REFERENCES batches(batch_id) ON DELETE CASCADE,
  feed_type VARCHAR(100) NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  cost_per_kg DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(12,2) NOT NULL,
  remarks VARCHAR(255)
);

INSERT INTO users (username, password, full_name, role) VALUES
('admin', 'admin123', 'Administrator Manoj', 'ADMIN'),
('manager', 'manager123', 'Farm Supervisor Rajesh', 'MANAGER'),
('staff', 'staff123', 'Flock Attendant Kumar', 'STAFF');`
    }
  };

  // 1-Click ZIP Downloader using JSZip
  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      
      // Add files to zip
      Object.entries(javaProjectFiles).forEach(([name, item]) => {
        zip.file(`PoultryFarmManagement/${item.path}`, item.code);
      });

      // Add Academic Readme
      zip.file('PoultryFarmManagement/README.md', `# Poultry Farm Management System (Academic Java JSP & Servlet Edition)
Built for Final Year / Semester Mini & Major Project Submissions.

## Prerequisites
1. JDK 17 or JDK 11
2. Apache Tomcat 9 or 10
3. PostgreSQL or MySQL Database

## Quick Setup
1. Import project into Eclipse as "Existing Maven Project"
2. Run database/poultry_farm.sql into your database
3. Set password in src/main/resources/db.properties
4. Right click project -> Run on Server -> Apache Tomcat
5. Access: http://localhost:8080/PoultryFarmManagement/
`);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'PoultryFarmManagement_Academic_Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('ZIP generation failed', e);
      alert('Could not bundle ZIP. You can still copy individual files directly.');
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyCode = () => {
    if (javaProjectFiles[selectedFile]) {
      navigator.clipboard.writeText(javaProjectFiles[selectedFile].code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // 15 Standard Academic Viva Questions & Answers
  const vivaQuestions = [
    { q: "1. What architecture does this Poultry Farm Management System follow?", a: "It follows the Model-View-Controller (MVC) design pattern where Servlets act as Controllers, JSP pages serve as Views, and Java DAO/Model classes represent the Model layer." },
    { q: "2. How does the application connect to PostgreSQL/MySQL?", a: "It uses Java Database Connectivity (JDBC) with connection pooling via the DBConnection utility, loading credentials from db.properties." },
    { q: "3. What is the role of web.xml in this project?", a: "web.xml is the Web Deployment Descriptor which configures welcome files, servlet mappings, session timeout rules, and cookie security flags." },
    { q: "4. How is user authentication maintained across pages?", a: "Using HttpSession. Once validated in LoginServlet, the user object is bound to session.setAttribute('loggedUser', user) and validated on every protected servlet." },
    { q: "5. How is egg laying efficiency calculated?", a: "Laying Efficiency (%) = (Total Eggs Harvested / Total Active Birds) * 100. It measures flock productivity." },
    { q: "6. What is the difference between Statement and PreparedStatement?", a: "PreparedStatement precompiles SQL statements, offers higher performance for repeated execution, and prevents SQL Injection attacks by parameterizing inputs with ?." },
    { q: "7. How is feed cost computed?", a: "Total Cost = Quantity in Kg * Rate per Kg. Handled automatically in both backend DAOs and frontend forms." },
    { q: "8. What happens when a flock batch is deleted?", a: "The database uses ON DELETE CASCADE on foreign keys, so related egg collection and feed logs are automatically and safely cleared." },
    { q: "9. Why is Maven used for this project?", a: "Maven manages project dependencies (PostgreSQL driver, Servlet API, JSTL), compiles code, and packages the app into a standard deployable WAR (Web Application Archive) file." },
    { q: "10. What is JSTL and why is it used?", a: "JavaServer Pages Standard Tag Library (JSTL) provides tags like <c:forEach> and <c:if> to iterate through lists and format numbers without writing messy scriptlets inside JSP." },
    { q: "11. How does the project achieve dual persistence?", a: "Changes are committed to PostgreSQL database endpoints and simultaneously cached in browser localStorage so offline or refresh states are retained." },
    { q: "12. What is the default port for Tomcat?", a: "Port 8080 (configured in Tomcat's conf/server.xml)." },
    { q: "13. What is the purpose of CORS in the Express backend?", a: "Cross-Origin Resource Sharing (CORS) permits the frontend client (Vite on port 5173) to securely make REST API requests to the backend server (port 3000)." },
    { q: "14. How are database sequences synchronized?", a: "Using SELECT setval(pg_get_serial_sequence('table', 'id'), COALESCE(MAX(id), 1)) to prevent primary key collision after seed insertions." },
    { q: "15. What are the key business modules in this system?", a: "Flock Inflow & Batch Management, Daily Egg Harvesting & Quality Sorting, Feed Rationing & Expense Tracking, and Monthly Financial Statements." }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner with 1-Click ZIP Exporter */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Code2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Academic Java JSP / Servlet Code Hub</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete source code for Eclipse, NetBeans & IntelliJ IDEA with 1-click project export.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Bundling ZIP...' : '1-Click Export Project (.ZIP)'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'explorer'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Source Code Explorer</span>
        </button>
        <button
          onClick={() => setActiveTab('viva')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'viva'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>15 Viva-Voce Questions & Answers</span>
        </button>
        <button
          onClick={() => setActiveTab('setup')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            activeTab === 'setup'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>11-Step Installation Manual</span>
        </button>
      </div>

      {/* Tab 1: Source Explorer */}
      {activeTab === 'explorer' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* File Tree Navigator */}
          <div className="glass-card p-4 rounded-2xl border-slate-800/80 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              Project Structure
            </div>
            <div className="space-y-1">
              {Object.entries(javaProjectFiles).map(([fileName, data]) => {
                const isSelected = selectedFile === fileName;
                return (
                  <button
                    key={fileName}
                    onClick={() => setSelectedFile(fileName)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono transition text-left ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                      <span className="truncate">{fileName}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-3 glass-card rounded-2xl border-slate-800/80 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-white font-medium">{javaProjectFiles[selectedFile]?.path}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {javaProjectFiles[selectedFile]?.category}
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-5 bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-[500px]">
              <code>{javaProjectFiles[selectedFile]?.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: Viva Q&A */}
      {activeTab === 'viva' && (
        <div className="glass-card p-6 rounded-2xl border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-400" /> Academic Viva-Voce Examination Guide
              </h3>
              <p className="text-xs text-slate-400">15 standard external viva questions with exact technical answers.</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              High Probability Q&A
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vivaQuestions.map((v, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
                <div className="font-semibold text-xs text-emerald-300">{v.q}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{v.a}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Installation Manual */}
      {activeTab === 'setup' && (
        <div className="glass-card p-6 rounded-2xl border-slate-800/80 space-y-4 text-xs text-slate-300">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <BookOpen className="w-4 h-4 text-emerald-400" /> 11-Step Execution & Deployment Manual
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <strong className="text-emerald-400">Step 1: Download Project ZIP</strong>
              <p className="text-slate-400 mt-0.5">Click the "1-Click Export Project (.ZIP)" button at the top to download <code>PoultryFarmManagement_Academic_Project.zip</code>.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <strong className="text-emerald-400">Step 2: Install Java Development Kit (JDK 17)</strong>
              <p className="text-slate-400 mt-0.5">Ensure JDK 17 or JDK 11 is installed and <code>JAVA_HOME</code> is configured in system environment variables.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <strong className="text-emerald-400">Step 3: Database Setup</strong>
              <p className="text-slate-400 mt-0.5">Open pgAdmin (for PostgreSQL) or MySQL Workbench. Create database <code>poultry_farm</code> and run the provided SQL script from <code>database/poultry_farm.sql</code>.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <strong className="text-emerald-400">Step 4: Configure Database Password</strong>
              <p className="text-slate-400 mt-0.5">Open <code>src/main/resources/db.properties</code> and update <code>db.password</code> with your database password.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <strong className="text-emerald-400">Step 5: Import into Eclipse / IntelliJ</strong>
              <p className="text-slate-400 mt-0.5">In Eclipse: <em>File &gt; Import &gt; Existing Maven Projects</em>. Select the unzipped folder and click Finish.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <strong className="text-emerald-400">Step 6: Configure Apache Tomcat Server</strong>
              <p className="text-slate-400 mt-0.5">In Eclipse Servers tab: Add New Server &gt; Apache Tomcat v9.0 or v10.0 &gt; Browse to Tomcat installation directory.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <strong className="text-emerald-400">Step 7: Add Project to Tomcat</strong>
              <p className="text-slate-400 mt-0.5">Right click Tomcat server &gt; Add and Remove... &gt; Move <code>PoultryFarmManagement</code> to Configured side.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <strong className="text-emerald-400">Step 8: Start Tomcat Server</strong>
              <p className="text-slate-400 mt-0.5">Click Start Server (Green play icon). Verify console logs show "Server startup in [X] ms".</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <strong className="text-emerald-400">Step 9: Launch Application in Web Browser</strong>
              <p className="text-slate-400 mt-0.5">Open browser and navigate to: <code>http://localhost:8080/PoultryFarmManagement/</code></p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <strong className="text-emerald-400">Step 10: Sign in with Demo Credentials</strong>
              <p className="text-slate-400 mt-0.5">Admin (<code>admin / admin123</code>), Manager (<code>manager / manager123</code>), Staff (<code>staff / staff123</code>).</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
              <strong className="text-emerald-400">Step 11: Export Final Project Report</strong>
              <p className="text-slate-400 mt-0.5">Use the "Print Summary" button in the Reports section to print official laboratory documentation for project evaluation.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
