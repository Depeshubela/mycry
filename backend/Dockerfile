 FROM python:3.11
 RUN mkdir /backend
 WORKDIR /backend
 ADD requirements.txt /backend/
 RUN apt update
 RUN pip install --upgrade pip
 RUN pip install -r requirements.txt
 ADD . /backend/
 RUN apt-get update
 RUN apt install nano
 EXPOSE 8000