const fs = require('fs');
const distDirectory = './dist/state';

// Copy necessary files
fs.copyFileSync('./LICENSE.md', `${distDirectory}/LICENSE.md`);
fs.copyFileSync('./README.md', `${distDirectory}/README.md`);

const repoPackageJsonInput = fs.readFileSync('./package.json', 'utf-8');
const repoPackageJson = JSON.parse(repoPackageJsonInput);
const distPackageJsonInput = fs.readFileSync(
  `${distDirectory}/package.json`,
  'utf-8'
);
const distPackageJson = JSON.parse(distPackageJsonInput);

const propertiesToCopy = [
  'name',
  'version',
  'displayName',
  'description',
  'author',
  'funding',
  'sponsor',
  'keywords',
  'license',
  'bugs',
  'homepage',
  'repository',
];

propertiesToCopy.forEach(propertyName => {
  distPackageJson[propertyName] = repoPackageJson[propertyName];
});

fs.writeFileSync(
  `${distDirectory}/package.json`,
  JSON.stringify(distPackageJson)
);
