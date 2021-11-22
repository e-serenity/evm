## Kyve Node - AWS Infrastructure Documentation

All you need to create and manage Kyve Node on AWS 🚀

- [Todo](#todo)
- [Require](#require)
- [Create VPC Stack using Cloudformation](#create-vpc-stack-using-cloudformation)
- [Deploy Kyve Node](#deploy-kyve-node)
- [Additional tools](#extras)

### Todo

* Incoming port ? Remove/Modify port 80 / load balancer
* Securing private-key storing
* Use multiple containers / Same private key ?

### Require

* Create your AWS account and configure aws command line
* Create a role "ecsInstanceRole" in IAM console for EC2 instances: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/instance_IAM_role.html

### Create VPC Stack using Cloudformation

You can import VPC.yaml in Cloudformation Web Console using "Create stack with new ressources" or use below aws cli command :

Check for additionals parameters for your needs using Cloudformation Web Console

```
aws cloudformation create-stack \
    --stack-name kyve-testnet-vpc \
    --template-body file://VPC.yaml \
    --capabilities CAPABILITY_IAM \
    --parameters \
    ParameterKey=VpcEnv,ParameterValue=testnet
```

### Deploy Kyve Node

You can import App.yaml in Cloudformation Web Console using "Create stack with new ressources" or use below aws cli command :

```
aws cloudformation  create-stack \
    --stack-name kyve-testnet-app \
    --template-body file://App.yaml \
    --capabilities CAPABILITY_IAM \
    --parameters \
    ParameterKey=VpcStackName,ParameterValue=kyve-testnet-vpc \
    ParameterKey=NodeImage,ParameterValue=kyve/evm:latest \
    ParameterKey=DesiredCount,ParameterValue=1 \
    ParameterKey=POOL_ADDRESS,ParameterValue="POOL_ADDRESS_TO_CONNECT" \
    ParameterKey=NodeName,ParameterValue="My_Incredible_Kyve_Node"\
    ParameterKey=PRIVATE_KEY,ParameterValue="YOUR_ERC20_PRIVATE_KEY"\
    ParameterKey=StackAmount,ParameterValue="100"
```

You can now check logs in cloudwatch or ECS Web console, Enjoy !

# Extras

## Connect to containers/services

Get clusters list :
```
aws ecs list-clusters
```

Get tasks list :
```
aws ecs list-tasks --container-instance kyve-node --cluster <your-cluster-arn-from-previous-command>
```
!Warning: in the output example :
* "arn:aws:ecs:us-west-2:123456789012:task/a1b2c3d4-5678-90ab-cdef-44444EXAMPLE"

The task id to use is only : `a1b2c3d4-5678-90ab-cdef-44444EXAMPLE`

Connect to Kyve Node container :
```
aws ecs execute-command --cluster <your-cluster-id-from-previous-command> --task <your-task-id-from-previous-command> --container kyve-node --interactive --command /bin/sh
```

## Get load balancer URL
```
aws cloudformation describe-stacks --stack-name kyve-testnet-vpc --query "Stacks[0].Outputs[?OutputKey=='LoadbalancerEndpoint'].OutputValue" --output text
```
