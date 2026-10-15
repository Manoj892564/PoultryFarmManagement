<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Poultry Farm Management System</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <style>
        :root {
            --primary: #10b981;
            --primary-dark: #059669;
            --primary-glow: rgba(16, 185, 129, 0.25);
            --bg-body: #0a0f1d;
            --card-bg: #111827;
            --card-border: rgba(255, 255, 255, 0.08);
            --text-main: #f9fafb;
            --text-muted: #9ca3af;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg-body);
            color: var(--text-main);
            min-height: 100vh;
            margin: 0;
            padding-bottom: 50px;
        }

        /* Navbar */
        .navbar-custom {
            background: rgba(17, 24, 39, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--card-border);
            padding: 14px 0;
        }
        .brand-logo {
            font-weight: 700;
            font-size: 1.35rem;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
        }
        .brand-icon-box {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: linear-gradient(135deg, #10b981 0%, #047857 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 4px 12px var(--primary-glow);
        }
        .nav-link-custom {
            color: var(--text-muted);
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 10px;
            transition: all 0.2s;
            text-decoration: none;
        }
        .nav-link-custom:hover, .nav-link-custom.active {
            color: #fff;
            background: rgba(255, 255, 255, 0.06);
        }
        .nav-link-custom.active {
            color: #34d399;
        }

        /* User badge */
        .user-pill {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 30px;
            padding: 6px 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.88rem;
        }
        .role-tag {
            background: rgba(16, 185, 129, 0.2);
            color: #34d399;
            font-size: 0.7rem;
            font-weight: 600;
            padding: 2px 7px;
            border-radius: 6px;
            letter-spacing: 0.05em;
        }

        /* KPI Card */
        .stat-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 20px;
            padding: 24px;
            position: relative;
            overflow: hidden;
            transition: all 0.25s ease;
        }
        .stat-card:hover {
            transform: translateY(-4px);
            border-color: rgba(16, 185, 129, 0.3);
            box-shadow: 0 12px 28px -10px rgba(0, 0, 0, 0.6);
        }
        .stat-icon {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 16px;
        }
        .icon-emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .icon-blue { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
        .icon-amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .icon-purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }

        .stat-label {
            font-size: 0.85rem;
            color: var(--text-muted);
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-bottom: 6px;
        }
        .stat-value {
            font-size: 2rem;
            font-weight: 700;
            line-height: 1.1;
            color: #ffffff;
        }
        .stat-desc {
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-top: 8px;
        }

        /* Glass Panels */
        .glass-panel {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 20px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .panel-title {
            font-size: 1.15rem;
            font-weight: 600;
            margin-bottom: 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        /* Table */
        .table-custom {
            color: #e5e7eb;
            margin-bottom: 0;
        }
        .table-custom thead th {
            background: rgba(255, 255, 255, 0.03);
            border-bottom: 1px solid var(--card-border);
            color: var(--text-muted);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 12px 16px;
        }
        .table-custom tbody td {
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            padding: 14px 16px;
            vertical-align: middle;
            font-size: 0.92rem;
        }
        .table-custom tbody tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }

        .badge-status {
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .badge-active { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .badge-sold { background: rgba(156, 163, 175, 0.15); color: #9ca3af; }
        .badge-quarantine { background: rgba(239, 68, 68, 0.15); color: #f87171; }

        .btn-action {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #fff;
            padding: 6px 14px;
            border-radius: 10px;
            font-size: 0.85rem;
            text-decoration: none;
            transition: all 0.2s;
        }
        .btn-action:hover {
            background: rgba(255, 255, 255, 0.16);
            color: #fff;
        }
        .btn-logout {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #f87171;
            padding: 6px 14px;
            border-radius: 10px;
            font-size: 0.85rem;
            text-decoration: none;
            transition: all 0.2s;
        }
        .btn-logout:hover {
            background: rgba(239, 68, 68, 0.25);
            color: #fff;
        }
    </style>
</head>
<body>
    <!-- Navbar -->
    <nav class="navbar-custom mb-4">
        <div class="container-fluid px-4 d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-4">
                <a href="${pageContext.request.contextPath}/dashboard" class="brand-logo">
                    <div class="brand-icon-box">
                        <i class="bi bi-egg-fried"></i>
                    </div>
                    <span>Poultry Farm Pro</span>
                </a>
                <div class="d-none d-md-flex align-items-center gap-2">
                    <a href="${pageContext.request.contextPath}/dashboard" class="nav-link-custom active">
                        <i class="bi bi-speedometer2 me-1"></i> Dashboard
                    </a>
                    <a href="${pageContext.request.contextPath}/batches" class="nav-link-custom">
                        <i class="bi bi-grid me-1"></i> Batches
                    </a>
                </div>
            </div>

            <div class="d-flex align-items-center gap-3">
                <div class="user-pill">
                    <i class="bi bi-person-circle text-emerald"></i>
                    <span>${sessionScope.loggedUser.fullName}</span>
                    <span class="role-tag">${sessionScope.loggedUser.role}</span>
                </div>
                <a href="${pageContext.request.contextPath}/logout" class="btn-logout">
                    <i class="bi bi-box-arrow-right me-1"></i> Logout
                </a>
            </div>
        </div>
    </nav>

    <!-- Main Container -->
    <div class="container-fluid px-4">
        <!-- Top Stats Row -->
        <div class="row g-3 mb-4">
            <!-- Total Birds -->
            <div class="col-sm-6 col-xl-3">
                <div class="stat-card">
                    <div class="stat-icon icon-emerald">
                        <i class="bi bi-feather"></i>
                    </div>
                    <div class="stat-label">Total Active Birds</div>
                    <div class="stat-value"><fmt:formatNumber value="${totalBirds}" type="number"/></div>
                    <div class="stat-desc">Across <strong>${activeBatches}</strong> active flock batches</div>
                </div>
            </div>

            <!-- Today's Eggs -->
            <div class="col-sm-6 col-xl-3">
                <div class="stat-card">
                    <div class="stat-icon icon-amber">
                        <i class="bi bi-egg"></i>
                    </div>
                    <div class="stat-label">Today's Egg Harvest</div>
                    <div class="stat-value"><fmt:formatNumber value="${todayEggs}" type="number"/></div>
                    <div class="stat-desc">Daily Laying Efficiency: <strong>${eggProductionRate}%</strong></div>
                </div>
            </div>

            <!-- Monthly Eggs -->
            <div class="col-sm-6 col-xl-3">
                <div class="stat-card">
                    <div class="stat-icon icon-blue">
                        <i class="bi bi-calendar3"></i>
                    </div>
                    <div class="stat-label">This Month's Eggs</div>
                    <div class="stat-value"><fmt:formatNumber value="${monthlyEggs}" type="number"/></div>
                    <div class="stat-desc">Total eggs recorded this month</div>
                </div>
            </div>

            <!-- Feed Consumption -->
            <div class="col-sm-6 col-xl-3">
                <div class="stat-card">
                    <div class="stat-icon icon-purple">
                        <i class="bi bi-basket3"></i>
                    </div>
                    <div class="stat-label">Feed Usage (Month)</div>
                    <div class="stat-value">${monthlyFeedKg} <span style="font-size: 1rem; color: var(--text-muted);">kg</span></div>
                    <div class="stat-desc">Expense: <strong>₹<fmt:formatNumber value="${monthlyFeedCost}" type="number"/></strong></div>
                </div>
            </div>
        </div>

        <!-- Charts Row -->
        <div class="row g-4 mb-4">
            <div class="col-lg-8">
                <div class="glass-panel h-100">
                    <div class="panel-title">
                        <span><i class="bi bi-bar-chart-fill text-success me-2"></i> Egg Production Yield by Batch</span>
                        <span class="badge bg-secondary">Current Month</span>
                    </div>
                    <div style="position: relative; height: 280px;">
                        <canvas id="eggYieldChart"></canvas>
                    </div>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="glass-panel h-100">
                    <div class="panel-title">
                        <span><i class="bi bi-pie-chart-fill text-info me-2"></i> Quality Breakdown</span>
                        <span class="badge bg-secondary">Egg Shell Quality</span>
                    </div>
                    <div style="position: relative; height: 280px;">
                        <canvas id="qualityChart"></canvas>
                    </div>
                </div>
            </div>
        </div>

        <!-- Batches Summary Table -->
        <div class="glass-panel">
            <div class="panel-title">
                <span><i class="bi bi-layers-fill text-warning me-2"></i> Flock Batches & Performance Summary</span>
                <a href="${pageContext.request.contextPath}/batches" class="btn-action">
                    <i class="bi bi-gear me-1"></i> Manage All Batches
                </a>
            </div>

            <div class="table-responsive">
                <table class="table table-custom">
                    <thead>
                        <tr>
                            <th>Batch ID</th>
                            <th>Batch Name</th>
                            <th>Breed Type</th>
                            <th>Bird Population</th>
                            <th>Status</th>
                            <th>Monthly Harvest</th>
                            <th>Broken Eggs</th>
                            <th>Good Eggs</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="item" items="${batchEggData}">
                            <tr>
                                <td><strong>#${item.batchId}</strong></td>
                                <td><i class="bi bi-tag me-1 text-muted"></i> ${item.batchName}</td>
                                <td><span class="badge bg-dark border border-secondary">${item.breed}</span></td>
                                <td><fmt:formatNumber value="${item.birdCount}" type="number"/> birds</td>
                                <td><span class="badge-status badge-active">Active</span></td>
                                <td><strong class="text-success">${item.totalEggs}</strong> eggs</td>
                                <td><span class="text-danger">${item.brokenEggs}</span></td>
                                <td><span class="text-success font-monospace">${item.goodEggs}</span></td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Chart Configuration Script -->
    <script>
        const batchLabels = [];
        const batchEggs = [];
        let totalGoodEggs = 0;
        let totalBrokenEggs = 0;

        <c:forEach var="item" items="${batchEggData}">
            batchLabels.push("${item.batchName}");
            batchEggs.push(${item.totalEggs});
            totalGoodEggs += ${item.goodEggs};
            totalBrokenEggs += ${item.brokenEggs};
        </c:forEach>

        // Bar Chart
        const ctxYield = document.getElementById('eggYieldChart').getContext('2d');
        new Chart(ctxYield, {
            type: 'bar',
            data: {
                labels: batchLabels.length > 0 ? batchLabels : ['Batch 1', 'Batch 2', 'Batch 3', 'Batch 4'],
                datasets: [{
                    label: 'Eggs Produced',
                    data: batchEggs.length > 0 ? batchEggs : [1120, 2350, 1810, 940],
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#9ca3af' } }
                },
                scales: {
                    x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
                }
            }
        });

        // Quality Doughnut Chart
        const ctxQuality = document.getElementById('qualityChart').getContext('2d');
        new Chart(ctxQuality, {
            type: 'doughnut',
            data: {
                labels: ['Good Eggs', 'Damaged / Broken'],
                datasets: [{
                    data: (totalGoodEggs + totalBrokenEggs > 0) ? [totalGoodEggs, totalBrokenEggs] : [6100, 52],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderColor: '#111827',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#9ca3af', padding: 16 } }
                }
            }
        });
    </script>
</body>
</html>
