# geekfindr-node.js-microservice
## backend for the Geefindr developer community.

Geekfindr is a platform where developers can post what's on their mind, see what other developers are doing 
and to find interesting projects to work on as well as finding a solid team to help build your next app idea.
Geekfindr also has a basic project management section where you can manage your open-source or startup project.
Right now, it is an MVP with the basic features that gets you going.

This project is designed and developed with scalability & maintainability in mind. It is following a 
microservice pattern which is stateless(well mostly, because of the web-socket connection in the chat service) 
with an asynchronous message queue system that is setup using NATS streaming. The project is containerized using 
docker and orchestrated using kubernetes. Deployment is done using DigitalOcean kubernetes cluster and a CD pipeline
setup using GitHub-Actions.

### Checkout the React client repo, [here](https://github.com/rahulnj/geekfindr-reactjs-client).
    
### Checkout the Flutter client repo, [here](https://github.com/fasil721/geekfindr-flutter-client).  

## Tech Stack: 
  * Node.js
  * Typescript 
  * MongoDB
  * basic Docker
  * basic Kubernetes
  * JWT
  * NATS Streaming
  * Socket.io
## Services used:
  * S3 signed-URLs
  * Atlas
  * Gravatar
  * DO Kubernetes Cluster
  * GitHub-Actions



