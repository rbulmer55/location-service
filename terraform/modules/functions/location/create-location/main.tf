
resource "aws_iam_role" "create_location_lambda_role" {
  name               = "CreateLocationLambdaRole"
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

resource "aws_iam_policy" "create_location_lambda_role_policy" {

  name        = "CreateLocationLambdaRolePolicy"
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

resource "aws_iam_role_policy_attachment" "create_location_attach_policy_to_role" {
  role       = aws_iam_role.create_location_lambda_role.name
  policy_arn = aws_iam_policy.create_location_lambda_role_policy.arn
}

data "archive_file" "zip_create_location" {
  type        = "zip"
  source_file = "${path.module}/../../dist/create-location-lambda.js"
  output_path = "${path.module}/create-location-lambda.zip"
}

resource "aws_lambda_function" "create_location_function" {
  filename         = data.archive_file.zip_create_location.output_path
  function_name    = var.function_name
  role             = aws_iam_role.create_location_lambda_role.arn
  handler          = "create-location-lambda.handler"
  runtime          = "nodejs20.x"
  depends_on       = [aws_iam_role_policy_attachment.create_location_attach_policy_to_role]
  source_code_hash = data.archive_file.zip_create_location.output_base64sha256
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
