# Poultry Farm Management System (Academic Java Web Application)

## Technology Stack
- Frontend: Java JSP, HTML5, Bootstrap 5, Chart.js
- Backend: Java Servlets (Java 17/11)
- Database: Supabase PostgreSQL / MySQL
- Connectivity: JDBC (`org.postgresql:postgresql` / `mysql-connector-j`)
- Server: Apache Tomcat 9/10
- Architecture: Model-View-Controller (MVC)

## Database Setup (Supabase PostgreSQL)
1. In your **Supabase Dashboard**, open the **SQL Editor** -> **New Query**.
2. Copy and paste the contents of `database/poultry_farm_supabase.sql` and click **Run**.
3. Set your database password:
   - Option A: Enter it in `src/main/resources/db.properties` under `db.password=<your_password>`.
   - Option B: Set environment variable: `export DB_PASSWORD='<your_password>'`.
4. Test connection:
   ```bash
   mvn compile
   java -cp "target/classes:$HOME/.m2/repository/org/postgresql/postgresql/42.7.3/postgresql-42.7.3.jar" com.poultry.util.DBConnection
   ```
5. Deploy and run on Tomcat: `http://localhost:8080/PoultryFarmManagement/`