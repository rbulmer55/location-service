variable "environment" {
  description = "The environment using the resource"
  type        = string
}

variable "project" {
  description = "The project name"
  type        = string
}

variable "tags" {
  description = "Tags passed into the resource"
  type        = map(string)
  default     = {}
}
