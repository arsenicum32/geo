rm -rf dist
npm run build
cd dist
echo "pdd.plakot.ru" > CNAME
git init .
git checkout -b gh-pages
git add .
git commit -m "autodeploy"
git remote add origin https://github.com/arsenicum32/pdd.git
git push -f origin gh-pages
