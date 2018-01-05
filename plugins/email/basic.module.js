
'use strict';

KlarkModule(module, 'emailBasicTmpl', (
  _,
  $passportJwt,
  krkModelsUser,
  config
) => {
  const {SECURE_APP_URL} = config;
  const logoUrl = `${SECURE_APP_URL}/public/assets/img/logo-170-nologo.png`;

  return { template };

  function template({
    styling = '',
    contentTitle = '',
    contentBody = '',
    ctaUrl = '',
    ctaTitle = ''
  }) {
    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no">
  <style type="text/css">
    * {
      font-family: sans-serif;
    }
    body {
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      margin: 0;
      padding: 0;
      mso-line-height-rule: exactly;
    }

    table td {
      border-collapse: collapse;
    }

    table td {
      border-collapse: collapse;
    }

    img {
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    a img {
      border: none;
    }

    a {
      text-decoration: blink;
      color: white;
    }

    @media only screen and (max-device-width: 480px) {
      table[id="outercontainer_div"] {
        max-width: 480px !important;
      }
      table[id="nzInnerTable"],
      table[class="nzpImageHolder"],
      table[class="imageGroupHolder"] {
        width: 100% !important;
        min-width: 320px !important;
      }
      table[class="nzpImageHolder"] td,
      td[class="table_seperator"],
      td[class="table_column"] {
        display: block !important;
        width: 100% !important;
      }
      table[class="nzpImageHolder"] img {
        /* width: 100% !important; */
      }
      table[class="nzpButt"] {
        display: block !important;
        width: auto !important;
      }
      #nzInnerTable td,
      #outercontainer_div td {
        padding: 0px !important;
        margin: 0px !important;
      }
      #nzpButt td {
        padding: 7px !important;
      }
    }

    ${styling}
  </style>
</head>

<body style="padding: 0; margin: 0; -webkit-font-smoothing:antialiased; -webkit-text-size-adjust:none; background: #EEEEEE;" data-gr-c-s-loaded="true">
  <table width="100%" cellpadding="30" id="outercontainer_div">
    <tbody>
      <tr>
        <td align="center">
          <table width="600" bgcolor="#FFFFFF" cellpadding="15" cellspacing="0" id="nzInnerTable" border="0" style="border: 1px solid #FFFFFF;">
            <tbody>
              <tr>
                <td>
                  <div id="innerContent" style="padding:10px;">
                    <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 0px;" class="nzpImageHolder">
                      <tbody>
                        <tr>
                          <td align="center">
                            <div style="padding: 0px;">
                              <a href="${SECURE_APP_URL}"
                                target="_blank">
                                <img src="${logoUrl}" class="bigImg editableImg" id="img-2"
                                  width="100" border="0" alt="" title="">
                              </a>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table width="100%" cellspacing="0" cellpadding="0" style="padding: 0px; padding-top: 0px; padding-bottom: 15px;">
                      <tbody>
                        <tr>
                          <td>
                            <table width="100%" cellpadding="0" cellspacing="0" style="">
                              <tbody>
                                <tr>
                                  <td bgcolor="">
                                    <div id="txtHolder-3" class="txtEditorClass" style="color: #000000; font-size: 26px; font-family: &#39;Impact&#39;; text-align: Left">
                                      <div style="text-align: center;">
                                        <a href="${SECURE_APP_URL}" style="font-size: xx-large;color: #000000;">wiregoose.com</a>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table width="100%" cellspacing="0" cellpadding="0" style="padding: 0px; padding-top: 0px; padding-bottom: 25px;">
                      <tbody>
                        <tr>
                          <td>
                            <table width="100%" cellpadding="0" cellspacing="0" style="">
                              <tbody>
                                <tr>
                                  <td bgcolor="">
                                    <div id="txtHolder-4" class="txtEditorClass" style="color: #666666; font-size: 14px; font-family: &#39;Arial&#39;; text-align: Left">
                                      <span style="font-weight: bold; font-size: large;">${contentTitle}</span>
                                      <br>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table width="100%" cellspacing="0" cellpadding="0" style="padding: 0px; padding-top: 0px; padding-bottom: 25px;">
                      <tbody>
                        <tr>
                          <td>
                            <table width="100%" cellpadding="0" cellspacing="0" style="">
                              <tbody>
                                <tr>
                                  <td bgcolor="">
                                    <div id="txtHolder-5" class="txtEditorClass" style="color: #666666; font-size: 14px; font-family: &#39;Arial&#39;; text-align: Left">
                                      <span style="color: rgb(51, 51, 51); font-family: &quot;Helvetica Neue&quot;, Arial, Helvetica; font-size: 15px; background-color: rgb(255, 255, 255);">${contentBody}</span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table width="100%" cellspacing="0" cellpadding="0" style="padding-bottom: 0px;">
                      <tbody>
                        <tr>
                          <td>
                            <table cellpadding="0" cellspacing="0" width="100%">
                              <tbody>
                                <tr>
                                  <td bgcolor="">
                                    <table cellpadding="10" cellspacing="0" align="Center"
                                      id="nzpButt">
                                      <tbody>
                                        <tr>
                                          <td bgcolor="#337ab7" style=" border-radius: 3px;color: #ffffff; text-align: center; font-size: 26pxpx; font-family: &#39;Sans Serif&#39;; cursor: pointer; text-decoration: none;">
                                            <a href="${ctaUrl}" target="_blank" style=" color: #ffffff; text-align: center; font-size: 26pxpx; font-family: &#39;Sans Serif&#39; cursor: pointer; text-decoration: none;">
                                              <span style="font-size: 22px; color: #ffffff;font-weight: 100;">${ctaTitle}</span>
                                            </a>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>

</html>
    `;
  }

});
