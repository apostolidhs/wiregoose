angular.module('wg.app.sections.admin.crud', [])

.config(function ($stateProvider) {
  $stateProvider.state('admin.crudAll', {
    url: '/admin/crudAll',
    templateUrl: 'sections/admin/crud/crud-all.html'
  });
});