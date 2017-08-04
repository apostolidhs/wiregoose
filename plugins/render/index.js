/* jshint esversion:6, node:true  */

'use strict';

KlarkModule(module, 'render', (
  _,
  $phantom
) => {

  return {
    servePage
  };

  function servePage(url) {
    return $phantom.create()
      .then(phantom => {
        return phantom.createPage()
                        .then(page => {
                            return page.open(url)
                                        .then(status => {
                                          // status sucess
                                          return page.property('content').then(function(content) {
                                            //console.log(status, content);
                                            page.close();
                                            phantom.exit();
                                            return content;
                                          });
                                        });
                          })
      });

  }

});
