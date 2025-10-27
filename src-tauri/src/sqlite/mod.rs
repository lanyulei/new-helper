pub mod tools;
use sqlx::{sqlite::{SqlitePool, SqlitePoolOptions}, migrate::Migrator};
use std::sync::Arc;
use once_cell::sync::OnceCell;

// 路径修正为 src-tauri/migrations，适配 sqlx build/run 目录
// 推荐使用相对于 src-tauri 的路径
static MIGRATOR: Migrator = sqlx::migrate!("./migrations");
static DB_POOL: OnceCell<Arc<SqlitePool>> = OnceCell::new();

pub struct SqliteDB;

impl SqliteDB {
    /// 初始化数据库连接池并自动迁移
    pub async fn init(db_url: &str) -> Result<(), sqlx::Error> {
        let pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect(db_url)
            .await?;
        MIGRATOR.run(&pool).await?;
        DB_POOL.set(Arc::new(pool)).ok();
        Ok(())
    }

    /// 获取数据库连接池
    pub fn pool() -> Arc<SqlitePool> {
        DB_POOL.get().expect("DB not initialized").clone()
    }
}
