variable "instance_type" {
  description = "The EC2 instance type"
}

variable "aws_subnet_ids" {
  description = "The IDs of the subnets to deploy the EC2 instances"
  type        = list(string)
}

variable "vpc_id" {
  description = "The name of the security group to attach to the EC2 instances"
}

variable "lb_sg" {
  description = "The ID of the security group of the load balancer"
}

variable "url" {
  description = "The whole domain of the website"
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_security_group" "instance_sg" {
  vpc_id = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    //cidr_blocks = ["0.0.0.0/0"]
    security_groups = [var.lb_sg] # Allow traffic from the load balancer security group
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
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

resource "aws_instance" "web" {
  count         = 2
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  subnet_id     = element(var.aws_subnet_ids, count.index)
  vpc_security_group_ids = [aws_security_group.instance_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              ip=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)
              echo "
              <html>
                <h1>$ip</h1>
              </html>" > /var/www/html/tutorial/index.html
              sudo apt update
              sudo apt install nginx
              echo "
              server {
               listen 80;
               listen [::]:80;

               server_name ${var.url};

               root /var/www/tutorial;
               index index.html;

               location / {
                       try_files $uri $uri/ =404;
               }
              }" > /etc/nginx/sites-available/tutorial
              sudo service nginx restart
              EOF
}

output "aws_instance_ids" {
  value = "${aws_instance.web.*.id}"
}