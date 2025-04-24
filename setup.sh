      GREEN='\033[1;32m'
      YELLOW='\033[1;33m'
      RED='\033[1;31m'
      RESET='\033[0m'
      
      if [ -d "./data/postgres" ] && [ -d "./backend/uploads/policies" ]; then
        echo "${YELLOW}⚠️  Diretórios já existem. Setup não é necessário.${RESET}";
        exit 0;
      fi;
      
      echo "${GREEN}🔧 Criando diretórios de dados e uploads...${RESET}";
      mkdir -p ./data/postgres;
      mkdir -p ./backend/uploads/policies;
      echo "📁 Diretório do PostgreSQL: $(realpath ./data/postgres)";
      echo "📁 Diretório de uploads:    $(realpath ./backend/uploads/policies)";
      
      echo "${GREEN}🔒 Ajustando permissões...${RESET}";
      CURRENT_UID=$(id -u);
      if [ "$CURRENT_UID" -eq 0 ]; then
        echo "${YELLOW}⚠️  Executando como root. Corrigindo dono para UID 1000...${RESET}";
        chown -R 1000:1000 ./data/postgres;
        chown -R 1000:1000 ./backend/uploads/policies;
      else
        echo "${GREEN}✅ Executando como usuário comum (UID $CURRENT_UID). Apenas chmod aplicado.${RESET}";
      fi;
      chmod -R 755 ./data/postgres;
      chmod -R 755 ./backend/uploads/policies;
      echo "${GREEN}✅ Setup concluído com sucesso!${RESET}"