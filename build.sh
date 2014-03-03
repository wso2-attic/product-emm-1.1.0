cp -R ../apps/ROOT  modules/apps/
cp -R ../apps/sso  modules/apps/
cp -R ../apps/store-admin  modules/apps/
cp -R ../apps/social  modules/apps/
cp -R ../apps/assets  modules/apps/
cd modules/apps/
git clone git@github.com:WSO2Mobile/mdm.git mdm
git 
git clone git@github.com:WSO2Mobile/mobilepublisher.git publisher
git clone git@github.com:WSO2Mobile/mobilestore.git store
mvn clean install -Dmaven.test.skip=true -o