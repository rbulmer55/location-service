resource "aws_api_gateway_rest_api" "this" {
  name        = var.api_name
  description = var.api_description
  tags        = var.tags
}

# Resource for /v1  
resource "aws_api_gateway_resource" "v1" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_rest_api.this.root_resource_id
  path_part   = "v1"
}

# Resource for /v1/location  
resource "aws_api_gateway_resource" "location" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  parent_id   = aws_api_gateway_resource.v1.id
  path_part   = "location"
}

# Method: POST  
resource "aws_api_gateway_method" "post_location" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.location.id
  http_method   = "POST"
  authorization = "NONE"
}

# Lambda Integration  
resource "aws_api_gateway_integration" "post_location_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.location.id
  http_method             = aws_api_gateway_method.post_location.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.create_location_lambda_arn
}

# Method: GET  
resource "aws_api_gateway_method" "get_locations" {
  rest_api_id   = aws_api_gateway_rest_api.this.id
  resource_id   = aws_api_gateway_resource.location.id
  http_method   = "GET"
  authorization = "NONE"
}

# Lambda Integration  
resource "aws_api_gateway_integration" "get_locations_integration" {
  rest_api_id             = aws_api_gateway_rest_api.this.id
  resource_id             = aws_api_gateway_resource.location.id
  http_method             = aws_api_gateway_method.get_locations.http_method
  integration_http_method = "GET"
  type                    = "AWS_PROXY"
  uri                     = var.get_location_lambda_arn
}

# Deployment and stage  
resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.this.id
  triggers = {
    redeploy = sha1(jsonencode([
      aws_api_gateway_resource.location.id,
      aws_api_gateway_method.post_location.id,
      aws_api_gateway_integration.post_location_integration.id,
      aws_api_gateway_method.get_locations.id,
      aws_api_gateway_integration.get_locations_integration.id
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_integration.post_location_integration,
    aws_api_gateway_integration.get_locations_integration
  ]
}

resource "aws_api_gateway_stage" "stage" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.this.id
  stage_name    = var.stage_name
}

# Lambda permission for API Gateway  
resource "aws_lambda_permission" "apigw_create_locations" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.create_location_lambda_name
  principal     = "apigateway.amazonaws.com"
}

# Lambda permission for API Gateway  
resource "aws_lambda_permission" "apigw_get_locations" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.get_location_lambda_name
  principal     = "apigateway.amazonaws.com"
}
