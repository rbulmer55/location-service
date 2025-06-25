resource "aws_secretsmanager_secret" "db_connection_secret" {
  name = "db/atlas/${lower(var.project)}/${lower(var.environment)}"
}

