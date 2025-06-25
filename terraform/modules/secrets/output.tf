output "db_connection_secret" {
  description = "DB Connection Secret Name"
  value       = aws_secretsmanager_secret.db_connection_secret.name
}

output "db_connection_secret_arn" {
  description = "DB Connection Secret ARN"
  value       = aws_secretsmanager_secret.db_connection_secret.arn
}
