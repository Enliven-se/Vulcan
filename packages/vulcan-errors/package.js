Package.describe({
  name: 'vulcan:errors',
  summary: 'Vulcan error tracking package',
  version: '1.13.2',
  git: 'https://github.com/VulcanJS/Vulcan.git',
});

Package.onUse(function(api) {

  api.use(['ecmascript', 'vulcan:core@1.13.2']);

  api.mainModule('lib/server/main.js', 'server');
  api.mainModule('lib/client/main.js', 'client');

});
