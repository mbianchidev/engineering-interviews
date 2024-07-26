variable "region" {
  description = "The AWS region to deploy the infrastructure"
  default     = "eu-west-2"
}

variable "domain" {
  description = "The domain name to use"
  default = "code.studucu.com"
}

variable "subdomain" {
  description = "The subdomain to create under the hosted zone"
}

variable "instance_type" {
  description = "The EC2 instance type"
  default     = "t2.micro"
}

variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "private_subnets" {
  description = "List of private subnet CIDRs"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnets" {
  description = "List of public subnet CIDRs"
  type        = list(string)
  default     = ["10.0.101.0/24", "10.0.102.0/24"]
}

