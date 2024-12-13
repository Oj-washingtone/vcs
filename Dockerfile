# Use the Node.js official image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Globally install the CLI tool
RUN npm install -g .

# Set the default entrypoint to the CLI command
ENTRYPOINT ["sc"]
