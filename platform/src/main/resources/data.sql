INSERT INTO companies (id, name)
VALUES (1, 'TechCorp')
    ON CONFLICT (id) DO NOTHING;


INSERT INTO departments (id, name, company_id)
VALUES (1, 'Engineering', 1)
    ON CONFLICT (id) DO NOTHING;


INSERT INTO employees (
    id,
    first_name,
    last_name,
    email,
    position,
    hire_date,
    company_id,
    department_id
)
VALUES (
           1,
           'Dhruv',
           'Developer',
           'dhruv@techcorp.com',
           'Lead Engineer',
           CURRENT_DATE,
           1,
           1
       )
    ON CONFLICT (id) DO NOTHING;


INSERT INTO app_users (
    email,
    password,
    role,
    company_id
)
VALUES
    (
        'dhruv@techcorp.com',
        'temporary',
        'ROLE_COMPANY_ADMIN',
        1
    ),
    (
        'auditor@techcorp.com',
        'temporary',
        'ROLE_AUDITOR',
        1
    ),
    (
        'employee@techcorp.com',
        'temporary',
        'ROLE_EMPLOYEE',
        1
    ),
    (
        'superadmin@quillcrest.com',
        'temporary',
        'ROLE_SUPER_ADMIN',
        NULL
    )
    ON CONFLICT (email) DO NOTHING;