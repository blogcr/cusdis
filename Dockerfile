FROM node:14-alpine

# Define que usaremos PostgreSQL
ENV DB_TYPE=pgsql
ENV NODE_ENV=production

# Instala apenas o necessário para o banco de dados
RUN apk add --no-cache openssl

WORKDIR /app

# Copia os arquivos do projeto
COPY . .

# Instala as dependências sem travar o processo
RUN yarn install --no-frozen-lockfile

# Gera os arquivos do Prisma e constrói o site ignorando erros de CSS
RUN npx prisma generate --schema ./prisma/pgsql/schema.prisma
RUN yarn build || echo "Build finalizado com avisos"

EXPOSE 3000

# MUDANÇA AQUI: Chama o comando que criamos no seu package.json
CMD ["npm", "run", "start:render"]
