<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flock Batches - Poultry Farm Management System</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

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

        .glass-panel {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 20px;
            padding: 28px;
            margin-bottom: 24px;
        }

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
            padding: 14px 18px;
        }
        .table-custom tbody td {
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            padding: 16px 18px;
            vertical-align: middle;
            font-size: 0.95rem;
        }
        .table-custom tbody tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }

        .badge-status {
            padding: 5px 12px;
            border-radius: 8px;
            font-size: 0.78rem;
            font-weight: 600;
        }
        .badge-active { background: rgba(16, 185, 129, 0.15); color: #34d399; }
        .badge-sold { background: rgba(156, 163, 175, 0.15); color: #9ca3af; }
        .badge-quarantine { background: rgba(239, 68, 68, 0.15); color: #f87171; }

        .btn-add-birds {
            background: rgba(16, 185, 129, 0.2);
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: #34d399;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 0.85rem;
            transition: all 0.2s;
        }
        .btn-add-birds:hover {
            background: var(--primary);
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

        /* Modal styling */
        .modal-content {
            background: #111827;
            border: 1px solid var(--card-border);
            border-radius: 20px;
            color: #fff;
        }
        .modal-header {
            border-bottom: 1px solid var(--card-border);
        }
        .modal-footer {
            border-top: 1px solid var(--card-border);
        }
        .form-control-dark {
            background: #1f2937;
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            border-radius: 10px;
            padding: 10px 14px;
        }
        .form-control-dark:focus {
            background: #1f2937;
            border-color: var(--primary);
            color: #fff;
            box-shadow: 0 0 0 4px var(--primary-glow);
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
                    <a href="${pageContext.request.contextPath}/dashboard" class="nav-link-custom">
                        <i class="bi bi-speedometer2 me-1"></i> Dashboard
                    </a>
                    <a href="${pageContext.request.contextPath}/batches" class="nav-link-custom active">
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

    <!-- Content -->
    <div class="container-fluid px-4">
        <div class="glass-panel">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="h4 mb-1"><i class="bi bi-feather text-success me-2"></i> Flock Batches Directory</h2>
                    <p class="text-muted small mb-0">Manage flock populations, breed types, and health status.</p>
                </div>
                <a href="${pageContext.request.contextPath}/dashboard" class="btn btn-outline-light rounded-pill btn-sm px-3">
                    <i class="bi bi-arrow-left me-1"></i> Back to Dashboard
                </a>
            </div>

            <div class="table-responsive">
                <table class="table table-custom">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Batch Name</th>
                            <th>Breed</th>
                            <th>Bird Population</th>
                            <th>Arrival Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <c:forEach var="b" items="${batchList}">
                            <tr>
                                <td><strong>#${b.batchId}</strong></td>
                                <td>
                                    <div class="fw-semibold">${b.batchName}</div>
                                </td>
                                <td>
                                    <span class="badge bg-dark border border-secondary">${b.breed}</span>
                                </td>
                                <td>
                                    <span class="fs-6 fw-bold text-white"><fmt:formatNumber value="${b.birdCount}" type="number"/></span>
                                    <span class="text-muted small ms-1">birds</span>
                                </td>
                                <td>
                                    <i class="bi bi-calendar-event me-1 text-muted"></i> ${b.arrivalDate}
                                </td>
                                <td>
                                    <c:choose>
                                        <c:when test="${b.status == 'Active'}">
                                            <span class="badge-status badge-active"><i class="bi bi-check-circle-fill me-1"></i> Active</span>
                                        </c:when>
                                        <c:when test="${b.status == 'Quarantine'}">
                                            <span class="badge-status badge-quarantine"><i class="bi bi-shield-exclamation me-1"></i> Quarantine</span>
                                        </c:when>
                                        <c:otherwise>
                                            <span class="badge-status badge-sold">${b.status}</span>
                                        </c:otherwise>
                                    </c:choose>
                                </td>
                                <td>
                                    <button class="btn btn-add-birds" onclick="openAddModal(${b.batchId}, '${b.batchName}', ${b.birdCount})">
                                        <i class="bi bi-plus-lg me-1"></i> Add Birds
                                    </button>
                                </td>
                            </tr>
                        </c:forEach>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Add Birds Modal -->
    <div class="modal fade" id="addBirdsModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <form action="${pageContext.request.contextPath}/batches" method="post">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-plus-circle text-success me-2"></i> Add Birds to Batch</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" id="modalBatchId" name="batchId">
                        <div class="mb-3">
                            <label class="form-label text-muted small">Batch</label>
                            <input type="text" id="modalBatchName" class="form-control-dark w-100" readonly>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted small">Current Count</label>
                            <input type="text" id="modalCurrentCount" class="form-control-dark w-100" readonly>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted small">Additional Birds to Add</label>
                            <input type="number" name="additionalBirds" class="form-control-dark w-100" min="1" placeholder="e.g. 50" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary rounded-pill btn-sm" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-success rounded-pill btn-sm px-3">Confirm & Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        const modal = new bootstrap.Modal(document.getElementById('addBirdsModal'));
        function openAddModal(id, name, count) {
            document.getElementById('modalBatchId').value = id;
            document.getElementById('modalBatchName').value = '#' + id + ' - ' + name;
            document.getElementById('modalCurrentCount').value = count + ' birds';
            modal.show();
        }
    </script>
</body>
</html>
