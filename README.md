# introduce

平时造的小轮子，用于练手或个人使用。

# environment

node: v18.16.0

pnpm + monorepo

# to add packages/xx
```shell
# /
cd ./packages & mkdir xx && cd ./xx && pnpm init
# 修改package.json包名为@attachments/xx
cd ../../ && pnpm i @attachments/xx -w
```
