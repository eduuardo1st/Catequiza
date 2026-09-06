FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY Logo /usr/share/nginx/html/Logo
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]