variable "domain" {
  description = "The domain to be validated"
}

variable "subdomain" {
  description = "The subdomain to create"
}

variable "aws_lb_dns_name" {
  description = "The DNS name of the load balancer"
}

variable "aws_lb_zone_id" {
  description = "The zone ID of the load balancer"
}

data "aws_route53_zone" "main" {
  name = "code.studucu.com"
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "${var.subdomain}.${var.domain}"
  type    = "A"

  alias {
    name                   = var.aws_lb_dns_name
    zone_id                = var.aws_lb_zone_id
    evaluate_target_health = true
  }
}

resource "aws_acm_certificate" "main" {
  domain_name       = var.domain
  validation_method = "DNS"

  subject_alternative_names = [
    "*.${var.domain}",
    "${var.subdomain}.${var.domain}",
  ]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true

  name    = each.value.name
  type    = each.value.type
  zone_id = data.aws_route53_zone.main.zone_id
  records = [each.value.record]
  ttl     = 60
}

// Certificate seems already validated

/*
resource "aws_acm_certificate_validation" "main" {
  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}
*/

output "acm_certificate" {
  description = "The ACM certificate"
  value       = aws_acm_certificate.main
}
