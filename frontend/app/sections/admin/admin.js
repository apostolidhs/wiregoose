angular.module('wg.app.sections.admin', [])

.config(function ($stateProvider) {
  $stateProvider.state('admin', {
    abstract: true,
    url: '/admin',
    templateUrl: 'sections/admin/admin.html'
  });
});