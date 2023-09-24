# Interview Guidelines

This are guidelines I follow when I interview candidates for an Engineering role.
I have been interviewed by many companies and I have been interviewing candidates for quite a bit now, so I have seen a lot of different approaches to the interview process.

## Intro

- How are you doing/weather, something to break the ice!
- Tell me about your engineering journey so far
- What are you looking for in your next role?
- What is your favorite programming language and why?
- What is your favorite part of this job?

## Git

- What is the difference between a remote branch and a local branch?
- How can I delete a remote branch? Please give the command
- What’s a tag and how is it used?
- What’s a hook? Make an example of its use.
- What’s a submodule and when should it be used?
- How can I rollback the last commit I made on my local branch?
- Rebase vs merge, explain the difference

## GitHub/GitLab

- What’s CI/CD?
- Have you ever used GitHub actions? How does it work?
- Have you ever used GitLab? Does it offer something different from GitHub?

## Networking

- How does the TCP/IP protocol work?
- What’s a DNS and how does that work?
- What is a VPN?
- What is a NAT tunnel?
- How does DHCP work?
- What is a firewall? What is a WAF?
- How would you block a specific IP address from accessing a service?
- What is a proxy? What is a reverse proxy?
- How does a load balancer work?

## Linux and Virtualization

- What is Linux and what makes it different from other operating systems?
- What is a directory?
- What’s "the kernel"?
- How can you install software on a Linux system and what are the common package managers used in Linux?
- What’s the command for changing the permission of a file? Give an example
- What’s the command for changing the ownership of a file? Give an example
- What’s a command for killing a process given its PID? Give an example
- What’s a command to list all the processes running? Give an example
- What’s the command, named after a protocol, to connect to a remote server in Linux? Give an example
- What’s a service in Linux?
- How does SELinux work?
- What does it happen when you launch `$?` in bash?
- What is a virtual machine (VM) and how does it work?
- What’s a hypervisor software?

## Docker and Containerization

- What’s the difference between a virtual machine and a container runtime?
- How does containerization work?
- Is Docker the only way to create a container?
- What is the purpose and power of an image?
- What is the registry and how is it used in containerization?
- What’s a Dockerfile?
- What is the first line of a Dockerfile?
- How do you attach a volume in a Docker container?
- How do you manage or orchestrate multiple containers?
- What’s the purpose of Docker Compose?
- Best practice for building a good Dockerfile
- Why too many lines are bad for a Dockerfile?

## Cloud

- What is cloud computing?
- Define public, hybrid, and private cloud and give a use case for each
- What is serverless?
- Is I say edge computing, what do I mean?
- List some CNCF (Cloud Native Computing Foundation) graduated projects or projects you like

## Site Reliability Engineering

- What is a receiver in an alert manager?
- What happens when you execute a `curl` command on a Prometheus exporter endpoint?
- Give me an example of an OpenMetrics payload
- What is a Service Level Objective (SLO)?
- What is a Service Level Indicator (SLI)?
- What is a Service Level Agreement (SLA)?
- If I say "Error Budget", what do I mean? SLA is 99.9%, what is the error budget?

## Terraform and Infrastructure as Code

- What is Infrastructure as Code and why is it important in modern cloud development?
- Explain the following commands: terraform init, terraform plan, terraform apply
- What is the purpose of the Terraform state file?
- What is Terraform's remote state?
- Where should it be stored, for example, in AWS as a cloud provider?
- What is a Terraform provider and what’s the difference between a provider and a resource?
- What is the way of reusing Terraform templates?
- How can you use Terraform variables?
- What major cloud provider can Terraform work with?
- How does Terraform handle updates to existing resources?
- How does Terraform handle dependencies between resources?

## Ansible

- What is the difference between Playbook and Role?
- How do you debug a Playbook?
- How would you use Ansible to automate the deployment of a web application?

## Kubernetes, Helm, and Container Orchestration

- What is Kubernetes, and what are some of its main features and benefits?
- What are the components of a Kubernetes cluster, and how do they interact with each other?
- How can you interact with Kubernetes API?
- Explain these commands: k create, k get, k describe, k delete, k apply, k logs, k exec, scale, rollout
- How do you create a Kubernetes deployment, and what are some best practices to follow when defining deployments?
- What is an ImagePullPolicy and what values can this parameter hold?
- What is a Kubernetes port forward? Why do you use that? What’s the command to perform that?
- NodePort vs LoadBalancer?
- What is the role of the Scheduler?
- Explain node affinity, node taints, node selectors, and pod priority.
- What are Kubernetes pods, and how do they relate to containers?
- Explain the Pod lifecycle
- What is the CrashLoopBackOff state?
- Explain this command 
```
kubectl run nginx --image=nginx:latest --port=80 --env="ENV_VAR=value" --labels="app=nginx" --
limits="cpu=500m,memory=256Mi" --requests="cpu=250m,memory=128Mi" --dry-run=client -o yaml > nginx.yaml
```
- What’s the difference between resource request and resource limit in Kubernetes?
- When is a Pod evicted?
- How does Kubernetes health checks work?
- What is a livenessProbe ?
- What is a readinessProbe ?
- What is a startupProbe ?
- How many kinds of probe types are there?
- NodeAffinity vs PodAffinity
- What is the POD disruption budget?
- What is a Kubernetes volume?
- How is a Kubernetes volume different from a container's file system?
- What are some types of Kubernetes volumes?
- How do you define a Kubernetes volume in a Pod's YAML configuration?
- How do you mount a Kubernetes volume to a container?
- Can multiple containers in a Pod share the same volume?
- What is a Persistent Volume (PV) in Kubernetes?
- How do you define a Persistent Volume in Kubernetes?
- How do you claim a Persistent Volume in Kubernetes (PVC)?
- How do you use a Persistent Volume in a Pod?
- What is a StorageClass and how does that work?
- What are the benefits of StorageClass?
- What is a Kubernetes namespace, and how can it be used to manage resources in a multi-tenant environment?
- What are Kubernetes Services, and how do they enable application discovery and load balancing?
- What is an Ingress and how does it work?
- What is a Kubernetes Controller and how does it work?
- Explain the difference between ReplicaSet controller, Deployment controller, StatefulSet controller, and DaemonSet controller
- What is a secret, and how can it be used to manage sensitive information like passwords and API keys?
- How do you scale a Kubernetes deployment, and what factors should you consider when determining the optimal number of replicas?
- Also, what metrics exist (natively) that can trigger a new pod?
- What kind of autoscaling is Kubernetes capable of?
- What is HPA and how does it work?
- What is Cluster Autoscaling and how does it work?
- What is a ConfigMap?
- What’s a Kubernetes Operator?
- Explain RBAC - Role Based Access Control
- What is the difference between Role and RoleBinding?
- Role vs ClusterRole, explain the difference
- What are some best practices for monitoring and logging Kubernetes clusters and applications running on them?
- Do you have any experience with Grafana+Prometheus, New Relic, Datadog, Dynatrace, or other similar products?

## Helm

- What is Helm?
- Explain helm create, helm package, and helm install commands
- What does this `replicas: {{ .Values.replicaCount }}` mean?
- How does helm templating work?
- What is Jinja?
- How can you see the story of the releases in helm?
- Describe how to perform a go to the previous version in helm
- Do you have any experience with OpenShift Container Platform?

## OpenShift

- What is OpenShift?

## AWS

- Define these AWS Services: EC2, S3, Route 53, Lambda, IAM
- What kind of different Load Balancers does AWS offer?
- Define these networking resources in AWS: VPC, ACL, NACL
- What’s the difference between EKS, ECS, and ECR?
- What is CloudFormation and how does it work?

## Azure

- How would you deploy a web application to Azure App Service?
- Can you explain the difference between Azure Virtual Machines and Azure Kubernetes Service (AKS), and when you might choose one over the other?
- How do you configure Azure Active Directory for use in a single-sign-on (SSO) scenario?

## Backend

- What is a RESTful API?
- What’s the difference between 2xx, 4xx, and 5xx error codes?
- What is a Microservice architecture and how it differs from a monolithic one?
- Explain OOP
- Explain functional programming
- Explain what is a Queue in programming and make some examples of different types of Queues (LIFO, FIFO...)

## Backend Engineering Scenarios

- What’s canary deployment?
- What if I have two deployments 1.0 (production, stable) and 1.1 (test, maybe stable) and I want to test 1.1 with production traffic, without using the canary deployment technique, what alternatives have I got?

## Frontend

- What is responsive design and how is it achieved?
- What is a CSS preprocessor?
- What is a media query in CSS?
- What’s a CDN?
- How can it help to improve a frontend?
- What kind of CDN have you used?
- What’s caching and how does it work?
- What kind of caches have you used?
- How can you test frontend?
- Have you got any experience with Selenium, Cypress, or Storybook.js?

## React

- What are the benefits of using a virtual DOM in React?
- What is the difference between state and props in React?
- What’s the difference between a class component and a functional component?
- How routing works in React?
- What is the difference between controlled and uncontrolled components in React?
- What is Redux?

## Angular

- What is the difference between ngOnChanges and ngOnInit in Angular?
- What is Angular's change detection mechanism?
- What is an Angular service?
- What is dependency injection in Angular?
- What is Angular routing?
- What is the difference between a component and a directive in Angular?

## Frontend Engineering Scenarios

- What are microfrontends?
- What are the benefits of using micro frontends?
- What is a Progressive Web App (PWA)?
- What are the benefits of using PWA?
- What are the key features of a PWA?
- How can you optimize a PWA for performance?
- Client Side Rendering (CSR) vs Server Side Rendering (SSR), explain the concepts
- Can you describe your approach to optimizing the performance and user experience of a large e-commerce website?
- How would you approach building a highly interactive and responsive web application with real-time updates? E.g. Financial App Stock Market data

## Outro

- Are you satified with our salary offering?
- What is a benefit you would like to see?
- What is a benefit you are glad we offer?
- What is your notice period?
- What would be a reasonable time to come back to you with a feedback?
- Do you have any questions for me?