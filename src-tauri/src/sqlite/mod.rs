pub mod tools;
use sqlx::{sqlite::{SqlitePool, SqlitePoolOptions}, migrate::Migrator};
use std::sync::Arc;
use once_cell::sync::OnceCell;

static DB_POOL: OnceCell<Arc<SqlitePool>> = OnceCell::new();

pub struct SqliteDB;

impl SqliteDB {
    /// 初始化数据库连接池并自动迁移
    pub async fn init(db_url: &str) -> Result<(), sqlx::Error> {
        let pool = SqlitePoolOptions::new()
            .max_connections(5)
            .connect(db_url)
            .await?;
        // 动态获取迁移目录
        let migrations_path = std::env::var("HELPER_MIGRATIONS_PATH").unwrap_or_else(|_| "./migrations".to_string());
        let migrator = Migrator::new(std::path::Path::new(&migrations_path)).await.expect("加载迁移目录失败");
        migrator.run(&pool).await?;
        DB_POOL.set(Arc::new(pool)).ok();
        Ok(())
    }

    /// 获取数据库连接池
    pub fn pool() -> Arc<SqlitePool> {
        DB_POOL.get().expect("DB not initialized").clone()
    }
}
