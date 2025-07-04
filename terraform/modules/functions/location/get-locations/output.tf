output "invoke_arn" {
  description = "arn of the lambda function"
  value       = aws_lambda_function.get_locations_function.invoke_arn
}

output "function_name" {
  description = "name of the function"
  value       = aws_lambda_function.get_locations_function.function_name
}
