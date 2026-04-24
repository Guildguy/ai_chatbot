PORT ?= 3000
NPM ?= npm

.PHONY: help dev build start stop-port clean

help:
	@echo "Comandos disponiveis:"
	@echo "  make dev        - inicia em modo desenvolvimento (nodemon + ts-node)"
	@echo "  make build      - compila TypeScript para dist/"
	@echo "  make start      - executa build em producao"
	@echo "  make stop-port  - libera a porta configurada em PORT (padrao: 3000)"
	@echo "  make clean      - libera a porta e remove dist/"
	@echo ""
	@echo "Exemplos:"
	@echo "  make dev"
	@echo "  make stop-port PORT=3001"

build:
	@$(NPM) run build

dev:
	@$(NPM) run dev

start:
	@$(NPM) run start

stop-port:
	@if command -v fuser >/dev/null 2>&1; then \
		if fuser -n tcp $(PORT) >/dev/null 2>&1; then \
			echo "Liberando porta $(PORT)..."; \
			fuser -k -n tcp $(PORT); \
			echo "Porta $(PORT) liberada."; \
		else \
			echo "Porta $(PORT) ja esta livre."; \
		fi; \
	elif command -v ss >/dev/null 2>&1; then \
		pid=$$(ss -ltnp 2>/dev/null | sed -n 's/.*:'"$(PORT)"'.*pid=\([0-9]\+\).*/\1/p' | head -n 1); \
		if [ -n "$$pid" ]; then \
			echo "Liberando porta $(PORT) (PID $$pid)..."; \
			kill -9 $$pid; \
			echo "Porta $(PORT) liberada."; \
		else \
			echo "Porta $(PORT) ja esta livre."; \
		fi; \
	else \
		echo "Nao foi possivel verificar a porta: comandos fuser e ss nao encontrados."; \
		exit 1; \
	fi

clean: stop-port
	@echo "Removendo dist/..."
	@rm -rf dist
	@echo "Limpeza concluida."