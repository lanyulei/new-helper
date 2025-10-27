-- 账号表
CREATE TABLE IF NOT EXISTS tool_password (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    note TEXT
);
