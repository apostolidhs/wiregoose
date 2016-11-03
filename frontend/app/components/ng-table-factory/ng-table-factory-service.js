(function () {

'use strict';

wg.service('wg.app.components.ngTableFactory', 'ngTableFactory', (NgTableParams, wgServicesApi) => {

  return {
    dynamicCrud,
    dynamicCrudCols
  };

  function dynamicCrud(model) {
    const tableParams = {
      page: 1, // show first page
      count: 10, // count per page
      sorting: {}
    };

    const tableSettings = {
      filterDelay: 300,
      getData: params => {
        const opts = {};

        opts.pagination = {
          count: params.count(),
          page: params.page()
        };

        const paramSorting = _.first(_.toPairs(params.sorting()));
        if (!_.isEmpty(paramSorting)) {
          opts.pagination.sortBy = paramSorting[0];
          opts.pagination.asc = paramSorting[1] === 'asc' ? 'true' : 'false';
        }

        const filters = _.transform(params.filter(), (result, value, key) => {
          if (!(_.isNil(value) || (_.isString(value) && !value))) {
            result[key] = valueToFilter(value);
          }
        }, {});

        if (!_.isEmpty(filters)) {
          opts.filters = filters;
        }

        return wgServicesApi.crud.retrieveAll(model, opts)
          .then(resp => {
            params.total(resp.data.total);
            return resp.data.content;
          });
      }
    };
    return new NgTableParams(tableParams, tableSettings);
  }

  function dynamicCrudCols(model) {
    const schemaCols = _.map(model.schema, (opts, name) => {
      const col = {
        show: true,
        field: name,
        title: name
      };
      if (opts.type === 'String' || opts.type === 'Email') {
        col.sortable = name;
        col.filter = _.fromPairs([[name, 'text']]);
      } else if (opts.type === 'Number') {
        col.filter = _.fromPairs([[name, 'number']]);
      } else if (opts.type === 'Date') {
        col.filter = _.fromPairs([[name, 'text']])
      } else {
        wg.assert(false, `unsupported content type: ${opts.type}`);
      }
      return col;
    });

    const IdCol = {
      show: true,
      field: '_id',
      title: 'id',
      sortable: '_id'
    };

    return [].concat(IdCol)
            .concat(schemaCols)
  }

  function valueToFilter(value) {
    return value;
  }

})})();