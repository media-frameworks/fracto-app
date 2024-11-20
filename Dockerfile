  # Use an official Node.js runtime as a parent image
  FROM node:21

  # Set the working directory in the container
  WORKDIR /

  # Copy package.json and package-lock.json (if available)
  COPY package*.json ./

  # Install dependencies
  RUN npm install

  # Copy the rest of the application code
  COPY . .

  # Expose the port the app will listen on
  EXPOSE 3000

  # Define the command to run the app
  CMD ["npm", "run", "start"]