#  STAGE 1 — BASE IMAGE
# We define this separately so both "builder" and "runner" stages can reuse it,
# ensuring consistent Node versions and reducing image size.
FROM node:20-alpine3.19 AS base


# STAGE 2 — BUILDER
# This stage is responsible for installing ALL dependencies (including dev
# dependencies such as TypeScript) and compiling TypeScript → JavaScript, and building with src folder
# Nothing from this stage goes to production except the final compiled dist/.
FROM base AS builder

WORKDIR /home/build

COPY package*.json .

# Copy TypeScript config (needed for tsc)
COPY tsconfig.json .

RUN npm install

COPY /src ./src

RUN npm run build


#  STAGE 3 — RUNNER / PRODUCTION IMAGE
# This stage will run the app with only production dependencies.
# It is intentionally minimal to reduce CPU/RAM usage and overall image size.
FROM base AS runner

WORKDIR /home/app

# Copy ONLY the package.json files from builder.
COPY --from=builder /home/build/package*.json .

# Copy the executable (dist/) from builder.
COPY --from=builder /home/build/dist dist/
# After copyig docker deletes all its previous stages so there wil be no src file

# Install ONLY production dependencies (--omit=dev makes dev deps such as typescript are skipped)
RUN npm install --omit=dev

CMD ["npm", "start"]
