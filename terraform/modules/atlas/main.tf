
resource "mongodbatlas_cluster" "cluster" {
  project_id   = var.mongodbatlas_project_id
  name         = var.cluster_name
  cluster_type = "REPLICASET"
  replication_specs {
    num_shards = 1
    regions_config {
      region_name     = var.region
      electable_nodes = 3
      priority        = 7
      read_only_nodes = 0
    }
  }
  #cloud_backup = true
  #auto_scaling_disk_gb_enabled = true

  # Provider Settings "block"
  provider_name               = var.cloud_provider
  provider_instance_size_name = "M10"
}

resource "mongodbatlas_privatelink_endpoint" "aws" {
  project_id    = var.mongodbatlas_project_id
  provider_name = var.cloud_provider
  region        = var.region
}


