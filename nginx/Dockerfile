FROM nginx:1.27
RUN mkdir -p /etc/nginx/logs
COPY nginx-proxy.conf /etc/nginx/nginx.conf
RUN apt-get update
RUN apt install nano
EXPOSE 80
CMD [ "nginx","-g","deaemon off;" ]