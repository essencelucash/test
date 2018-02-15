const SheetsAPI = {
  CLIENT_ID : '1073821849521-t3o8s24nlmlfsv1tdpjf02enj9kv3be9.apps.googleusercontent.com',
  REDIRECT_URI : 'http://localhost:3000/',
  queryString : JSON.parse(localStorage.getItem('oauth2-test-params')),
  ACCESS_TOKEN: null,
  authenticated: false,
  id: null,
  Results: null,

  checkSignInStatus(id,userType){
    this.id = id;
    this.userType = userType;
    console.log('in sign in status');
    // Parse query string to see if page request is coming from OAuth 2.0 server.
      var params = this.queryString;
      //var regex = /([^&=]+)=([^&]*)/g, m;
      console.log(params);
      /*while (m = regex.exec(this.queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        // Try to exchange the param values for an access token.
      }
      console.log(params);*/
      let results = this.exchangeOAuth2Token(params);
      return results;
  },

    // If there's an access token, try an API request.
    // Otherwise, start OAuth 2.0 flow.
    trySampleRequest() {
      console.log('in sample request');
      window.history.pushState('access_token',null,'/');
      var params = this.queryString;
      console.log(params);
      if (params && params['access_token']) {
        var batchGetByDataFilter = {
          "valueRenderOption": "UNFORMATTED_VALUE",
          "dataFilters": [
            {
              "gridRange": {
                "sheetId": 540014687
              }
            }
          ],
          "majorDimension": "ROWS"
        };
        return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.id}/values/A:Z?access_token=${params['access_token']}`)
        .then(response => {
          if(response.ok){
            return response.json();
          }
          console.log(response);
          }).then(jsonResponse => {
          console.log(jsonResponse);
          var results =  this.createReturnObject(jsonResponse);
          console.log(results);
          return results.map(property => ({
            name: property.propertyName +': '+property.planLineBuyType,
            property: property.propertyName,
            buyType: property.planLineBuyType,
            maxBudget: parseFloat(property.maxBudget),
            budgetPercent: parseFloat(property.avgPercBudget),
            cpa: parseFloat(Math.round(property.avgCpa*100)/100),
            predictedBudget: 0
          }));
        })
      } else {
        this.oauth2SignIn();
      }
    },

    /*
     * Create form to request access token from Google's OAuth 2.0 server.
     */
    oauth2SignIn() {
      // Google's OAuth 2.0 endpoint for requesting an access token
      var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

      // Create element to open OAuth 2.0 endpoint in new window.
      var form = document.createElement('form');

      form.setAttribute('method', 'GET'); // Send as a GET request.
      form.setAttribute('action', oauth2Endpoint);

      // Parameters to pass to OAuth 2.0 endpoint.
      var params = {'client_id': this.CLIENT_ID,
                    'redirect_uri': this.REDIRECT_URI,
                    'scope': 'https://www.googleapis.com/auth/spreadsheets',
                    'state': 'try_sample_request',
                    'response_type': 'token'};
      // Add form parameters as hidden input values.
      for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
      }

      // Add form to page and submit it to open the OAuth 2.0 endpoint.
      document.body.appendChild(form);
      form.submit();
    },

    /* Verify the access token received on the query string. */
    exchangeOAuth2Token(params) {
      console.log('in exchange');
      var oauth2Endpoint = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
      console.log(params['access_token']);
      if (params['access_token']) {
      var xhr = new XMLHttpRequest();

        xhr.open('POST', oauth2Endpoint + '?access_token=' + params['access_token']);
        xhr.onreadystatechange = (e) => {
          console.log(xhr.response);
          if (xhr.readyState === 4 && xhr.status === 200) {
            var response = JSON.parse(xhr.response);
            console.log(response, params);
            console.log(response['aud'], this.CLIENT_ID)
            if (response['aud'] && response['aud'] === this.CLIENT_ID) {
              // Store granted scopes in local storage to facilitate
              // incremental authorization.
              params['scope'] = response['scope'];
              localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
            }
          } else if (xhr.readyState === 4) {
            console.log('There was an error processing the token, another ' +
                        'response was returned, or the token was invalid.')
                        return {error: 'We encountered an Error'};
          }
        };
        xhr.send(null);
        let results = this.trySampleRequest();
        return results;
      }else{
        this.oauth2SignIn()
      }
    },
    createReturnObject(response){
      var QUARTER = {
        '03' : '1',
        '06' : '2',
        '09' : '3',
        '12' : '4'
      };
      var headers = response.values[0];
      var headersNameToIndex =  {};
      var indexToNamesObject = {};
      for (var i = 0; i < headers.length; i++) {
        if(!headersNameToIndex[headers[i]]){
          headersNameToIndex[headers[i]] = i;
          indexToNamesObject[i] = headers[i];
        }
      }
      response.values.sort(function(a,b) {
        var nameA = a[headersNameToIndex['Olive Plan Name']];
        var nameB = b[headersNameToIndex['Olive Plan Name']];

        if(nameA < nameB){
          return -1;
        }
        if(nameA > nameB){
          return 1;
        }
        return 0;
      });

      response.values = response.values.filter( property => {
        return (property[headersNameToIndex['Olive Goal Category']] !== '' && property[headersNameToIndex['Olive Plan Line Property']] !== '' && property[headersNameToIndex['Olive Plan Line Cost Model']] !== 'Added Value' );
      });

      var propertyObject = {};
      for (var x = 1; x < response.values.length; x++) {
        var mediaPlan = response.values[x][headersNameToIndex['Olive Plan Name']];
        var property = response.values[x][headersNameToIndex['Olive Plan Line Property']];
        var type = response.values[x][headersNameToIndex['Olive Goal Category']];
        var year = response.values[x][headersNameToIndex['Olive Plan Start Date']].substring(0,4) ;
        var quarter = QUARTER[response.values[x][headersNameToIndex['Olive Plan Start Date']].substring(4,6)];
        var propBudget = parseFloat((response.values[x][headersNameToIndex['Olive Total Line Budget']]).replace(/,/g, ''),10);
        if(response.values[x][headersNameToIndex['Performance And Delivery CPA in Buying currency']] !== undefined){
          var cpc = parseFloat((response.values[x][headersNameToIndex['Performance And Delivery CPC in Buying currency']]).replace(/,/g, ''),10);
        }else{
          var cpc = 0;
        }
        if(response.values[x][headersNameToIndex['Performance And Delivery CPA in Buying currency']] !== undefined){
          var cpa = parseFloat((response.values[x][headersNameToIndex['Performance And Delivery CPA in Buying currency']]).replace(/,/g, ''),10);
        }else{
          var cpa = 0;
        }
        if(response.values[x][headersNameToIndex['Performance And Delivery CPM in Buying currency']] !== undefined){
          var cpm = parseFloat((response.values[x][headersNameToIndex['Performance And Delivery CPM in Buying currency']]).replace(/,/g, ''),10);
        }else{
          var cpm = 0;
        }
        var mediaPlanBudget = parseFloat((response.values[x][headersNameToIndex['Olive Total Budget']]).replace(/,/g, ''),10);
        var planLineBuyType = response.values[x][headersNameToIndex['Olive Plan Line Buy Type']];
        var nameAndType = property +': '+planLineBuyType
        if (type !== this.userType){
          continue;
        }else{
        if(!propertyObject[nameAndType]){
          propertyObject[nameAndType]= {
            count : 1,
            mediaPlanName: mediaPlan,
            propertyName: property,
            'cpc' : cpc,
            'cpa' : cpm,
            'cpm' : cpm,
            maxBudget: propBudget,
            lineBudget: propBudget,
            'mediaPlanBudget': mediaPlanBudget,
            'planLineBuyType': planLineBuyType
            //'budgetPercent': Math.round((parseFloat(parseInt(propBudget)/parseInt(mediaPlanBudget))*100)/100),
          };
        }else if(propertyObject[nameAndType].mediaPlanName !== mediaPlan){
          if(propertyObject[nameAndType].maxBudget < propBudget){
            propertyObject[nameAndType].maxBudget = propBudget;
          }
          propertyObject[nameAndType].count += 1;
          propertyObject[nameAndType].mediaPlanName = mediaPlan;
          propertyObject[nameAndType]['cpc'] += cpc;
          propertyObject[nameAndType]['cpa'] += cpa;
          propertyObject[nameAndType]['cpm'] += cpm;
          propertyObject[nameAndType]['mediaPlanBudget'] += mediaPlanBudget;
          propertyObject[nameAndType].lineBudget += propBudget;
        }else{
          if(propertyObject[nameAndType].maxBudget < propBudget){
            propertyObject[nameAndType].maxBudget = propBudget;
          }
          propertyObject[nameAndType].count += 1;
          propertyObject[nameAndType].lineBudget += propBudget;
          propertyObject[nameAndType]['cpc'] += cpc;
          propertyObject[nameAndType]['cpa'] += cpa;
          propertyObject[nameAndType]['cpm'] += cpm;
        }
      }
    }
    var results = [];
    for (property in propertyObject){
      propertyObject[property]['avgCpa'] = propertyObject[property].cpa/propertyObject[property].count;
      propertyObject[property]['avgCpm'] = propertyObject[property].cpm/propertyObject[property].count;
      propertyObject[property]['avgCpc'] = propertyObject[property].cpc/propertyObject[property].count;
      propertyObject[property]['avgPercBudget'] = ((propertyObject[property].lineBudget/propertyObject[property].count)/(propertyObject[property].mediaPlanBudget/propertyObject[property].count));
      results.push(propertyObject[property])
    }
    results.sort(function(a,b) {
      return a.avgCpa - b.avgCpa;
    });
      console.log(propertyObject);
      return results;
  }
}


export default SheetsAPI;
