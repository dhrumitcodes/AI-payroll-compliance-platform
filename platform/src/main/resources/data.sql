INSERT INTO companies (id, name)
VALUES (1, 'TechCorp')
    ON CONFLICT DO NOTHING;

INSERT INTO departments (id, name, company_id)
VALUES (1, 'Engineering', 1)
    ON CONFLICT DO NOTHING;

INSERT INTO employees (id, first_name, last_name, email, position, hire_date, company_id, department_id)
VALUES (1, 'Dhruv', 'Developer', 'dhruv@techcorp.com', 'Lead Engineer', CURRENT_DATE, 1, 1)
    ON CONFLICT DO NOTHING;

INSERT INTO app_users (email, password, role)
VALUES ('dhruv@techcorp.com', 'admin123', 'ROLE_ADMIN')
    ON CONFLICT (email) DO NOTHING;