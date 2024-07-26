variable "vpc_id" {
  type = string
  description = "The ID of the VPC"
}

variable "subnets" {
  type = list(string)
  description = "The public subnets to deploy the ALB"
}

variable "aws_instance_ids" {
  type = list(string)
}

variable "certificate_arn" {
  type = string
}

resource "aws_alb" "web" {
  name                        = "web-elb"
  internal                    = false
  security_groups             = [aws_security_group.alb_sg.id]
  subnets                     = var.subnets

  enable_deletion_protection       = false
  enable_cross_zone_load_balancing = true
  load_balancer_type               = "application"
}

# Create an HTTP listener
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_alb.web.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# Create an HTTPS listener
resource "aws_lb_listener" "https" {
  load_balancer_arn = aws_alb.web.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08" # You can choose a different policy if needed
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.web_tg.arn
  }
}

resource "aws_lb_target_group" "web_tg" {
  name          = "web-tg"
  port          = 80
  protocol      = "HTTP"
  vpc_id        = var.vpc_id

  health_check {
    path                = "/"
    protocol            = "HTTP"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_security_group" "alb_sg" {
  vpc_id = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group_attachment" "web_attachment" {
    count            = length(var.aws_instance_ids)
    target_group_arn = aws_lb_target_group.web_tg.arn
    target_id        = element(var.aws_instance_ids, count.index)
}

output "aws_lb_dns_name" {
  value = aws_alb.web.dns_name
}

output "aws_lb_zone_id" {
  value = aws_alb.web.zone_id
}

output "aws_lb_sg_id" {
  value = aws_security_group.alb_sg.id
}