server=$1
hugo build --baseURL="http://rogueo7ciqckck2yhf2dqmqxsrav3ydsobcxkun7f5dmysskcxyfgead.onion"
sudo scp -r public/* $server:/var/www/html
