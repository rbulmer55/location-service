


module "mdb_atlas" {
  providers = {
    mongodbatlas = mongodbatlas
  }
  source                  = "../../modules/atlas"
  cluster_name            = "${local.project_name}-${var.ENVIRONMENT}"
  mongodbatlas_project_id = var.MDB_ATLAS_PROJECT_ID

  depends_on = []
}

module "location_vpc" {
  providers = {
    mongodbatlas = mongodbatlas
  }

  source                              = "../../modules/vpc"
  environment                         = var.ENVIRONMENT
  vpcName                             = "${local.project_name}-vpc"
  atlas_private_endpoint_service_name = module.mdb_atlas.atlas_private_endpoint_service_name
  atlas_private_endpoint_link_id      = module.mdb_atlas.atlas_private_endpoint_link_id
  atlas_project_id                    = var.MDB_ATLAS_PROJECT_ID

  tags = local.common_tags

  depends_on = [module.mdb_atlas]
}


module "application_secrets" {
  source      = "../../modules/secrets"
  environment = var.ENVIRONMENT
  project     = local.project_name
  tags        = local.common_tags
}

module "create_location_function" {
  source                  = "../../modules/functions/location/create-location"
  function_name           = "${local.project_name}-${var.ENVIRONMENT}-CreateLocation"
  db_connection_secret    = module.application_secrets.db_connection_secret
  vpc_cidr                = module.location_vpc.vpc_cidr
  vpc_id                  = module.location_vpc.vpc_id
  private_subnet_id       = module.location_vpc.vpc_prv_subnet_id
  atlas_security_group_id = module.location_vpc.atlas_security_group_id
  tags                    = local.common_tags

  depends_on = [
    module.application_secrets,
    module.location_vpc
  ]
}

module "get_locations_function" {
  source                  = "../../modules/functions/location/get-locations"
  function_name           = "${local.project_name}-${var.ENVIRONMENT}-GetLocations"
  db_connection_secret    = module.application_secrets.db_connection_secret
  vpc_cidr                = module.location_vpc.vpc_cidr
  vpc_id                  = module.location_vpc.vpc_id
  private_subnet_id       = module.location_vpc.vpc_prv_subnet_id
  atlas_security_group_id = module.location_vpc.atlas_security_group_id
  tags                    = local.common_tags

  depends_on = [
    module.application_secrets,
    module.location_vpc
  ]
}

module "api_gateway" {
  source          = "../../modules/api-gateway"
  api_name        = "${local.project_name}-${var.ENVIRONMENT}-API"
  api_description = "API for location operations"
  stage_name      = lower(var.ENVIRONMENT)
  tags            = local.common_tags

  create_location_lambda_arn  = module.create_location_function.invoke_arn
  create_location_lambda_name = module.create_location_function.function_name
  get_locations_lambda_arn    = module.get_locations_function.invoke_arn
  get_locations_lambda_name   = module.get_locations_function.function_name

  depends_on = [module.create_location_function, module.get_locations_function]
}


