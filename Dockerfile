# Use nginx as the base image
FROM public.ecr.aws/docker/library/nginx:alpine

# Copy pre-built static files to the NGINX HTML directory
COPY dist /usr/share/nginx/html

# Copy the dynamically generated NGINX configuration file

ARG NGINX_CONFIG=nginx.config
COPY ${NGINX_CONFIG} /etc/nginx/conf.d/default.conf

# Expose the default NGINX port
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
 