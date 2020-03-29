FROM alpine:3.11

LABEL version="1.0.0"
LABEL repository="http://github.com/kter/label-manager"
LABEL homepage="http://github.com/kter/label-manager"
LABEL maintainer="Takahashi Tomohiko <takahashi@tomohiko.io>"

RUN apk add --no-cache bash curl jq

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
