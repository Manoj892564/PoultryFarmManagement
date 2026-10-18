<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Poultry Farm Management System</title>
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
            --primary-glow: rgba(16, 185, 129, 0.35);
            --bg-dark: #090d16;
            --card-bg: rgba(17, 24, 39, 0.85);
            --border-glow: rgba(255, 255, 255, 0.08);
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background: radial-gradient(circle at 20% 20%, #064e3b 0%, #090d16 55%, #030712 100%);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow-x: hidden;
            margin: 0;
            padding: 20px;
        }

        /* Ambient floating lights */
        .ambient-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(90px);
            pointer-events: none;
            z-index: 0;
        }
        .orb-1 {
            width: 380px;
            height: 380px;
            background: rgba(16, 185, 129, 0.15);
            top: 10%;
            left: 15%;
        }
        .orb-2 {
            width: 320px;
            height: 320px;
            background: rgba(59, 130, 246, 0.12);
            bottom: 10%;
            right: 15%;
        }

        .login-card {
            position: relative;
            z-index: 1;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--border-glow);
            border-radius: 24px;
            padding: 42px 38px;
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 30px -10px var(--primary-glow);
            width: 100%;
            max-width: 440px;
            transition: transform 0.3s ease;
        }

        .brand-badge {
            width: 58px;
            height: 58px;
            background: linear-gradient(135deg, #10b981 0%, #047857 100%);
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            box-shadow: 0 10px 20px -5px var(--primary-glow);
            margin-bottom: 18px;
        }

        .brand-title {
            font-weight: 700;
            font-size: 1.65rem;
            letter-spacing: -0.02em;
            margin-bottom: 4px;
            background: linear-gradient(135deg, #ffffff 40%, #a7f3d0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .brand-subtitle {
            font-size: 0.9rem;
            color: var(--text-muted);
            margin-bottom: 28px;
        }

        .form-label {
            font-size: 0.85rem;
            font-weight: 500;
            color: #d1d5db;
            margin-bottom: 6px;
        }

        .input-group-custom {
            position: relative;
            margin-bottom: 20px;
        }

        .input-group-custom i {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-muted);
            font-size: 1.1rem;
            z-index: 2;
        }

        .form-control-custom {
            background: rgba(31, 41, 55, 0.65);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #ffffff;
            border-radius: 14px;
            padding: 12px 16px 12px 46px;
            font-size: 0.95rem;
            transition: all 0.25s ease;
            width: 100%;
        }

        .form-control-custom:focus {
            background: rgba(31, 41, 55, 0.95);
            border-color: var(--primary);
            box-shadow: 0 0 0 4px var(--primary-glow);
            color: #ffffff;
            outline: none;
        }

        .form-control-custom::placeholder {
            color: #6b7280;
        }

        .btn-login {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            color: white;
            font-weight: 600;
            border-radius: 14px;
            padding: 13px;
            width: 100%;
            font-size: 1rem;
            box-shadow: 0 10px 25px -6px var(--primary-glow);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            margin-top: 10px;
        }

        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px -6px var(--primary-glow);
            background: linear-gradient(135deg, #34d399 0%, #059669 100%);
            color: #ffffff;
        }

        .demo-box {
            background: rgba(15, 23, 42, 0.7);
            border: 1px dashed rgba(255, 255, 255, 0.12);
            border-radius: 14px;
            padding: 14px;
            margin-top: 24px;
            font-size: 0.82rem;
        }

        .demo-chip {
            background: rgba(16, 185, 129, 0.15);
            color: #6ee7b7;
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 8px;
            padding: 3px 8px;
            font-size: 0.75rem;
            cursor: pointer;
            transition: background 0.2s;
            margin-right: 4px;
            margin-bottom: 4px;
            display: inline-block;
        }

        .demo-chip:hover {
            background: rgba(16, 185, 129, 0.3);
            color: #ffffff;
        }

        .alert-custom {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #fca5a5;
            border-radius: 12px;
            padding: 10px 14px;
            font-size: 0.88rem;
            margin-bottom: 18px;
        }
    </style>
</head>
<body>
    <div class="ambient-orb orb-1"></div>
    <div class="ambient-orb orb-2"></div>

    <div class="login-card">
        <div class="text-center">
            <div class="brand-badge">
                <i class="bi bi-egg-fried text-white"></i>
            </div>
            <h1 class="brand-title">Poultry Farm Pro</h1>
            <p class="brand-subtitle">Smart Flock, Egg & Feed Management System</p>
        </div>

        <c:if test="${not empty error}">
            <div class="alert alert-custom d-flex align-items-center">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <div>${error}</div>
            </div>
        </c:if>

        <form action="${pageContext.request.contextPath}/login" method="post">
            <div class="mb-3">
                <label class="form-label" for="username">Username</label>
                <div class="input-group-custom">
                    <i class="bi bi-person"></i>
                    <input type="text" id="username" name="username" class="form-control-custom" 
                           placeholder="Enter username" value="${enteredUsername != null ? enteredUsername : ''}" required autofocus>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label" for="password">Password</label>
                <div class="input-group-custom">
                    <i class="bi bi-lock"></i>
                    <input type="password" id="password" name="password" class="form-control-custom" 
                           placeholder="Enter password" value="" required>
                </div>
            </div>

            <button type="submit" class="btn btn-login">
                Sign In to Dashboard <i class="bi bi-arrow-right ms-2"></i>
            </button>
        </form>
    </div>

    <script>
        function fillCreds(u, p) {
            document.getElementById('username').value = u;
            document.getElementById('password').value = p;
        }
    </script>
</body>
</html>
