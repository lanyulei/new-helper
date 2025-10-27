use crate::sqlite::SqliteDB;

#[tokio::main]
async fn main() {
    // 初始化数据库，自动迁移
    SqliteDB::init("sqlite://test.db").await.expect("DB init failed");
    let pool = SqliteDB::pool();
    // 示例：插入和查询
    sqlx::query("INSERT INTO users (name) VALUES ('张三')")
        .execute(&*pool)
        .await
        .unwrap();
    let row = sqlx::query("SELECT id, name FROM users LIMIT 1")
        .fetch_one(&*pool)
        .await
        .unwrap();
    let id: i64 = row.get("id");
    let name: String = row.get("name");
    println!("用户: id={}, name={}", id, name);
}
