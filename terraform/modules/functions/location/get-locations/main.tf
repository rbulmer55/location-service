
resource "aws_iam_role" "get_locations_lambda_role" {
  name               = "GetLocationsLambdaRole"
  assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "lambda.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF
}

resource "aws_iam_policy" "get_locations_lambda_role_policy" {

  name        = "GetLocationsLambdaRolePolicy"
  path        = "/"
  description = "AWS IAM Policy for managing aws lambda role"
  policy      = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
    {
      "Action": [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
   },
   {
      "Effect": "Allow",
      "Action": [
          "ec2:DescribeNetworkInterfaces",
          "ec2:CreateNetworkInterface",
          "ec2:DeleteNetworkInterface"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "*"
    }
 ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "get_locations_attach_policy_to_role" {
  role       = aws_iam_role.get_locations_lambda_role.name
  policy_arn = aws_iam_policy.get_locations_lambda_role_policy.arn
}

data "archive_file" "zip_get_locations" {
  type        = "zip"
  source_file = "${path.module}/../../dist/get-locations-lambda.js"
  output_path = "${path.module}/get-locations-lambda.zip"
}

resource "aws_lambda_function" "get_locations_function" {
  filename         = data.archive_file.zip_get_locations.output_path
  function_name    = var.function_name
  role             = aws_iam_role.get_locations_lambda_role.arn
  handler          = "get-locations-lambda.handler"
  runtime          = "nodejs20.x"
  depends_on       = [aws_iam_role_policy_attachment.get_locations_attach_policy_to_role]
  source_code_hash = data.archive_file.zip_get_locations.output_base64sha256
  timeout          = 10
  vpc_config {
    subnet_ids         = [var.private_subnet_id]
    security_group_ids = [var.atlas_security_group_id]
  }
  environment {
    variables = {
      DB_CONNECTION_SECRET : var.db_connection_secret
      DB_NAME : "LocationService"
    }
  }
  tags = var.tags
}
