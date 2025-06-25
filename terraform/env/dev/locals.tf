locals {
  project_name = "LocationService"
  common_tags = {
    Project     = local.project_name
    Environment = var.ENVIRONMENT
    Owner       = "Robert.Bulmer"
  }
}
