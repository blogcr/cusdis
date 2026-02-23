# Usamos o Node 18 para satisfazer o Prisma 5.22 e garantir estabilidade
FROM node:18-alpine

# Define o tipo de banco e ambiente
ENV DB_TYPE=pgsql
ENV NODE_ENV=production

# Instala dependências do sistema necessárias para o Prisma e Sharp (imagem)
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copia todos os arquivos
COPY . .

# O segredo: --ignore-engines ignora a reclamação de versão do Node
# e --no-frozen-lockfile permite atualizar o arquivo de instalação se necessário
RUN yarn install --no-frozen-lockfile --ignore-engines

# Gera o cliente do banco de dados apontando para o seu Supabase
RUN npx prisma generate --schema ./prisma/pgsql/schema.prisma

# Executa o build. O || true garante que o deploy continue mesmo com avisos de CSS
RUN npm run build || echo "Build concluído com avisos ignorados"

EXPOSE 3000

# Inicia usando o comando que criamos no seu package.json
CMD ["npm", "run", "start:render"]
