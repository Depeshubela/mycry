 FROM python:3.11
 RUN mkdir /backend
 WORKDIR /backend
 ADD requirements.txt /backend/
 RUN apt update
 RUN apt-get -y install sqlite3
 RUN pip install --upgrade pip
 RUN pip install -r requirements.txt
 ADD . /backend/
 EXPOSE 8000