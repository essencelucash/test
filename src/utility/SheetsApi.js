const SheetsAPI = {
  CLIENT_ID : '1073821849521-t3o8s24nlmlfsv1tdpjf02enj9kv3be9.apps.googleusercontent.com',
  API_KEY : 'AIzaSyCJKn2bgloj0fWehzaMqkK_DSREz57Bl9g',
  REDIRECT_URI : 'http://localhost:3000/',
  queryString : window.location.hash.substring(1),
  ACCESS_TOKEN: null,
  id: null,

  checkSignInStatus(id){
    this.id = id;
    console.log(id);
    console.log('in sign in status');
    // Parse query string to see if page request is coming from OAuth 2.0 server.
      var params = {};
      var regex = /([^&=]+)=([^&]*)/g, m;
      console.log(this.queryString);
      while (m = regex.exec(this.queryString)) {
        params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        // Try to exchange the param values for an access token.
      }
      console.log(params);
      this.exchangeOAuth2Token(params);
  },

    // If there's an access token, try an API request.
    // Otherwise, start OAuth 2.0 flow.
    trySampleRequest(params) {
      console.log('in sample request');
      window.history.pushState('access_token',null,'/');
      console.log(localStorage);
      var params = JSON.parse(localStorage.getItem('oauth2-test-params'));
      console.log(params);
      console.log(this.API_KEY);
      if (params && params['access_token']) {
        return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.id}/values/Shhet1!A:Z`,{
          method: 'GET',
          params: {
            key: this.API_KEY,
            access_token: params['access_token']
          }
        }).then(response => {
          return response.json();
        }).then(jsonResponse => {
          console.log(jsonResponse);
        });
        /*var xhr = new XMLHttpRequest();
        xhr.open('GET',
          `https://sheets.googleapis.com/v4/spreadsheets/${this.id}/values/'Shhet1'!A4:A8?key=${this.API_KEY}?access_token=${params['access_token']}`);
        xhr.onreadystatechange = function (e) {
          console.log(xhr.response);
        };
        this.ACCESS_TOKEN = params['access_token'];
        xhr.send(null);*/
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
        /*return fetch(`${oauth2Endpoint}`,{
          method:'POST',
          params: {
            'access_token' : params['access_token']
          }
        }).then(response => {
          if(response.ok){
            return response.json();
          }
          console.log(response);
        }).then(jsonResponse => {
          console.log(jsonResponse);
          if(jsonResponse.readyState === 4 && jsonResponse.status === 200){
            var response = JSON.parse(jsonResponse.response);
            console.log(response, params);
            console.log(response['aud'], this.CLIENT_ID);
            if (response['aud'] && response['aud'] === this.CLIENT_ID) {
              // Store granted scopes in local storage to facilitate
              // incremental authorization.
              params['scope'] = response['scope'];
              localStorage.setItem('oauth2-test-params', JSON.stringify(params) );
              if (params['state'] === 'try_sample_request') {
                this.trySampleRequest(params);
              }
            }
          }else if (jsonResponse.readyState === 4) {
            console.log('There was an error processing the token, another ' +
            'response was returned, or the token was invalid.')
          }
        jsonResponse.send(null);
        });
      }else{
        this.oauth2SignIn();
      }
    }*/
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
              if (params['state'] === 'try_sample_request') {
                this.trySampleRequest(params);
              }
            }
          } else if (xhr.readyState === 4) {
            console.log('There was an error processing the token, another ' +
                        'response was returned, or the token was invalid.')
          }
        };
        xhr.send(null);
      }else{
        this.oauth2SignIn()
      }
    }
}

export default SheetsAPI;
