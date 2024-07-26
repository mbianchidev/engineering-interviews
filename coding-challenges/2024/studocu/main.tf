terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.59.0"
    }
  }
  required_version = ">= 0.12"
}

provider "aws" {
  region = var.region
  default_tags {
    tags = {
      Environment = "Test"
      Project     = "Interview-Task-Studocu"
      Owners      = "Studocu"
      Interviewed = "mbianchidev"
    }
  }
}

module "vpc" {
  source = "./vpc"
  private_subnets = var.private_subnets
  public_subnets = var.public_subnets
  vpc_cidr = var.vpc_cidr
}

module "alb" {
  source = "./alb"
  vpc_id = module.vpc.vpc_id
  subnets = module.vpc.vpc_public_subnets
  aws_instance_ids = module.ec2.aws_instance_ids
  certificate_arn = module.dns.acm_certificate.arn
}

module "ec2" {
  source = "./ec2"
  instance_type = var.instance_type
  aws_subnet_ids = module.vpc.vpc_private_subnets
  vpc_id = module.vpc.vpc_id
  lb_sg = module.alb.aws_lb_sg_id
  url = "${var.subdomain}.${var.domain}"
}

// Commented out for permission issues

/*
module "cloudfront" {
  source = "./cloudfront"
  domain = var.domain
  subdomain = var.subdomain
  aws_lb_dns_name = module.alb.aws_lb_dns_name
  acm_certificate = module.dns.acm_certificate
}
*/

module "dns" {
  source = "./dns"
  domain = var.domain
  subdomain = var.subdomain
  aws_lb_dns_name = module.alb.aws_lb_dns_name
  aws_lb_zone_id = module.alb.aws_lb_zone_id
}

output "aws_lb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = module.alb.aws_lb_dns_name
}

output "aws_instances_id" {
  description = "The IDs of the EC2 instances"
  value       = module.ec2.aws_instance_ids
}

output "website_url" {
  description = "The URL of the website"
  value       = "${var.subdomain}.${var.domain}"
}

/*
output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = module.cloudfront.cloudfront_domain_name
}
*/
