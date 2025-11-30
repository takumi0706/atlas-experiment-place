data "external_schema" "drizzle" {
  program = [
    "yarn",
    "drizzle-kit",
    "export",
  ]
}

env "local" {
  src = data.external_schema.drizzle.url
  dev = "postgresql://postgres:postgres@localhost:5432/atlas_experiment?sslmode=disable"
  url = "postgresql://postgres:postgres@localhost:5432/atlas_experiment?sslmode=disable"
}
