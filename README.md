# Что это?

Демо автоматического заполнения заявки для участия в торгах по банкротству на основе данных агрегаторов

# Как пользоваться?

Склонируйте репозиторий, введите свои данные в шаблон my_template.docx и запустите веб-сервер

# Как запустить веб-сервер?

1) Можно просто открыть в браузере index.html

Если вы открыли при помощи Firefox - загляните в  `about:config` и выключите настройку `privacy.file_unique_origin`

2) При помощи docker

```
docker run -d -p 3000:80 -v $(pwd):/usr/share/nginx/html nginx:alpine
```

в production средах при использовании nginx-proxy:

```
docker run -d --name pavelsr_torgi_bid_gen --restart always --network nginx-proxy -v $(pwd):/usr/share/nginx/html -e VIRTUAL_HOST=torgi.example.org -e VIRTUAL_PORT=80 nginx:alpine
```

# Благодарности

1. [docxtemplater](https://github.com/open-xml-templating/docxtemplater)
1. [bootstrap](https://github.com/twbs/bootstrap)
1. [jquery](https://github.com/jquery/jquery)
1. [jquery.datetimepicker](https://github.com/xdan/datetimepicker)
1. [jquery.inputmask](https://github.com/RobinHerbots/Inputmask)
1. [jquery.validationk](https://github.com/jquery-validation/jquery-validation)
1. [js-written-number](https://github.com/yamadapc/js-written-number)
1. [cheeriojs](https://github.com/cheeriojs/cheerio)
1. [officeparser](https://github.com/harshankur/officeParser)
1. [ansicolor](https://github.com/xpl/ansicolor)
