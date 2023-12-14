include .env
ctr = 'api'

# The $(notdir) function in GNU Make takes a list of arguments, separated by spaces.
# Some functions support escaping spaces with \\, but $(notdir) is not one of them.
# This defines a "space-safe" version of notdir called notdirx. It's quite simple:
# s^ first turns all spaces to circumflex accents (hoping that they cannot be present
# in file names), and ^s converts back. In between we can safely call the original
# notdir function.
# https://stackoverflow.com/questions/1189781/using-make-dir-or-notdir-on-a-path-with-spaces

s^ = $(subst $(empty) ,^,$1)
^s = $(subst ^, ,$1)
notdirx = $(call ^s,$(notdir $(call s^,$1)))

_dir = $(call notdirx,${PWD})
dir = $(subst #,,${_dir})
sep = $(shell command -vp docker >/dev/null && echo - || echo _)

args = $(shell arg="$(filter-out $@,$(MAKECMDGOALS))" && echo $${arg:-${1}})

upd:
	docker-compose up -d $(call args,)

up:
	make ${args} && make logs

down:
	docker-compose down $(call args,)

stop:
	docker-compose stop $(call args,)

restart:
	docker-compose restart $(call args,)

build:
	docker-compose build --no-cache $(call args,)

logs:
	docker-compose logs -f

sh:
	docker-compose exec $(call args,${ctr}) sh

prod:
	docker-compose run -e NODE_ENV=production --name ${ctr}_production -p 5001:${PORT} \
		--rm $(call args,${ctr}) sh -c "npm run build && npm start"

test:
	docker-compose exec $(call args,${ctr}) npm test

coverage:
	docker-compose exec $(call args,${ctr}) npm run coverage

rm:
	docker rmi ${dir}${sep}$(call args,${ctr})

rmf:
	docker rmi ${dir}${sep}$(call args,${ctr}) -f

redeploy:
	make down; make build; make up

# This allows us to accept extra arguments (by doing nothing when we get a job that
# doesn't match, rather than throwing an error).
%:
	@:

.PHONY: upd up down stop restart build logs sh prod test coverage rm rmf redeploy
