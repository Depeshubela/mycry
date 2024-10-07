FROM nginx:1.27
RUN mkdir -p /etc/nginx/logs
COPY nginx-proxy.conf /etc/nginx/nginx.conf
RUN mkdir -p /home/.well-known/pki-validation
COPY CC34E3E5881FA4EE002C4204A376CBB0.txt /home/.well-known/pki-validation/CC34E3E5881FA4EE002C4204A376CBB0.txt
RUN apt-get update
RUN apt install nano
EXPOSE 80
CMD [ "nginx","-g","deaemon off;" ]