PORT ?= 3000
NPM ?= npm
OLLAMA_MODEL ?= llama3.2

.PHONY: help dev build start stop-port clean ollama-up ollama-pull ollama-down ollama-logs run-ollama stop-ollama

help:
	@echo "Comandos disponiveis:"
	@echo "  make dev        - inicia em modo desenvolvimento (nodemon + ts-node)"
	@echo "  make build      - compila TypeScript para dist/"
	@echo "  make start      - executa build em producao"
	@echo "  make stop-port  - libera a porta configurada em PORT (padrao: 3000)"
	@echo "  make ollama-up  - sobe Ollama em Docker na porta 11434"
	@echo "  make ollama-pull - baixa modelo no container (padrao: llama3.2)"
	@echo "  make run-ollama - sobe Ollama, baixa modelo e inicia API com AI_PROVIDER=ollama"
	@echo "  make ollama-down - para e remove o container do Ollama"
	@echo "  make stop-ollama - libera porta 3000 e derruba Ollama"
	@echo "  make ollama-logs - acompanha logs do Ollama"
	@echo "  make clean      - libera a porta e remove dist/"
	@echo ""
	@echo "Exemplos:"
	@echo "  make dev"
	@echo "  make stop-port PORT=3001"
	@echo "  make ollama-up && make ollama-pull OLLAMA_MODEL=llama3.2"
	@echo "  make run-ollama"
	@echo "  make stop-ollama"

build:
	@$(NPM) run build

dev:
	@$(NPM) run dev

start:
	@$(NPM) run start

ollama-up:
	@docker compose up -d ollama

ollama-pull:
	@docker compose exec ollama ollama pull $(OLLAMA_MODEL)

ollama-down:
	@docker compose down

run-ollama: ollama-up
	@$(MAKE) ollama-pull OLLAMA_MODEL=$(OLLAMA_MODEL)
	@AI_PROVIDER=ollama npx ts-node src/index.ts

stop-ollama:
	@$(MAKE) stop-port PORT=3000
	@$(MAKE) ollama-down

ollama-logs:
	@docker compose logs -f ollama

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