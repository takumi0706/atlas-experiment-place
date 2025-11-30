data "external_schema" "drizzle" {
  program = [
    "yarn",
    "drizzle-kit",
    "export",
  ]
}

// ローカル開発環境
env "local" {
  src = data.external_schema.drizzle.url
  dev = "postgresql://postgres:postgres@localhost:5432/atlas_experiment?sslmode=disable"
  url = "postgresql://postgres:postgres@localhost:5432/atlas_experiment?sslmode=disable"
}

// CI 環境（GitHub Actions 用）
env "ci" {
  src = data.external_schema.drizzle.url
  dev = "postgresql://postgres:postgres@localhost:5432/dev?sslmode=disable"
  url = "postgresql://postgres:postgres@localhost:5432/dev?sslmode=disable"
}

// 本番環境（AWS RDS 用 - サンプル設定）
// 将来的に使用する場合は IAM 認証を推奨
// locals {
//   endpoint = "your-db.ap-northeast-1.rds.amazonaws.com:5432"
//   username = "atlas"
// }
//
// data "aws_rds_token" "db" {
//   endpoint = local.endpoint
//   username = local.username
//   region   = "ap-northeast-1"
// }
//
// env "production" {
//   src = data.external_schema.drizzle.url
//   url = "postgres://${local.username}:${urlescape(data.aws_rds_token.db)}@${local.endpoint}/atlas_experiment"
// }
