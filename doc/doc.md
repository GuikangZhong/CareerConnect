# Career Connect GraphQL and REST API Documentation
Note: GraphQL only returns data with status code 200 or 500.
The way of crafting cURL requests for GraphQL file upload is referenced here: https://github.com/jaydenseric/graphql-multipart-request-spec

## GraphQL API

### Login System API
#### Sign in
- description: User sign in
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes email, password as parameters
- response example: 200
  - body: {"data":{"signin":{"username":"u1","email":"u1@example.com","role":1}}} 
- response example: 500
  - body: {"errors":[{"message":"Your email or password is incorrect","locations":[{"line":1,"column":8}],"path":["signin"]}],"data":null} 

``` 
$ curl -X POST -c cookies.txt 
       -H 'Content-Type: application/json' 
       -d '{"query":"query {signin(email: \"u1@example.com\", password: \"u1\") {username email role}}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### signinCompany
- description: Company sign in
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes email, password as parameters
- response example: 200
  - body: {"data":{"signinCompany":{"username":"c1","email":"c1@example.com","role":2}}} 
- response example: 500
  - body: {"errors":[{"message":"Your email or password is incorrect","locations":[{"line":1,"column":8}],"path":["signin"]}],"data":null} 

``` 
$ curl -X POST -c cookies.txt 
       -H 'Content-Type: application/json' 
       -d '{"query":"query {signinCompany(email: \"c1@example.com\", password: \"c1\") {username email role}}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### signup
- description: users sign up (need a real email account to sign up)
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes email, username, and password as parameters
- response example: 200
  - body: {"data":{"signup":{"username":"u1","email":"u1@example.com","role":1}}} 
- response example: 500
  - body: {"errors":[{"message":"This account already registered as a company","locations":[{"line":1,"column":11}],"path":["signup"]}],"data":{"signup":null}}

``` 
$ curl -X POST 
       -H 'Content-Type: application/json' 
       -d '{"query":"mutation {signup(userInput: {email: \"u1@example.com\", username: \"u1\", password: \"u1\"}) {username email role}}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### createCompany
- description: Companies sign up (need a real email account to sign up)
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes email, company name, and password as parameters
- response example: 200
  - body: {"data":{"createCompany":{"companyName":"c1","email":"c1@example.com","role":1}}} 
- response example: 500
  - body: {"errors":[{"message":"Company existed","locations":[{"line":1,"column":11}],"path":["createCompany"]}],"data":{"createCompany":null}}

``` 
$ curl -X POST 
       -H 'Content-Type: application/json' 
       -d '{"query":"mutation {createCompany(companyInput: {email: \"c1@example.com\", companyName: \"c1\", password: \"c1\"}) {companyName email role}}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### confirmRegister
- description: it receives the correct token in order to confirm the registeration
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes no argument
- response example: 200
  - body: {"data":{"confirmRegister":true}}
- response example: 500
  - body: {"errors":[{"message":"This account already registered as a company","locations":[{"line":1,"column":11}],"path":["signup"]}],"data":{"signup":null}}

``` 
$ curl -X POST 
       -H 'Content-Type: application/json' 
       -d '{"query":"mutation {confirmRegister(token: \"2f260814-52d1-4100-8868-62038c52b031\")}"}' 
       'https://bubblecareerconnect.me/graphql'
```

### User API
#### getUser
- description: get a user's infomation by the signed-in user id
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes no argument
- response example: 200
  - body: {"data":{"getUser":{"username":"u1","email":"u1@example.com","schedule":[{"start":"2021-03-24T23:33:00.000Z","end":"2021-03-25T00:33:00.000Z"}]}}}
- response example: 500
  - body: {"errors":[{"message":"Access Denied","locations":[{"line":1,"column":8}],"path":["getUser"]}],"data":null} 

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type: application/json' 
       -d '{"query":"query {getUser {username email schedule{start end}}}"}' 
       'https://bubblecareerconnect.me/graphql'
```

### Company API
#### getCompany
- description: get a company's infomation by the company id
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes a company id as parameter
- response example: 200
  - body: {"data":{"getCompany":{"companyName":"c1","profile":{"description":"test","location":"Facebook, Hacker Way, Menlo Park, CA, USA"}}}}
- response example: 500
  - body: {"errors":[{"message":"The company does not exist","locations":[{"line":1,"column":8}],"path":["getCompany"]}],"data":null} 

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type: application/json' 
       -d '{"query":"query {getCompany(id: \"60581800603fe20015ba8c0d\") {companyName profile {description location}}}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### updateProfile
- description: companies update their profiles
- request: `POST /graphql/`
    - content-type: `multipart/form-data`
    - body: a json object
      - query: a graphql query like the curl example below, it takes a logo file location which is optional, name, description, company location as parameters
- response example: 200
  - body: {"data":{"updateProfile":{"_id":"60581800603fe20015ba8c0d"}}}
- response example: 500
  - body: {"errors":[{"message":"Access Denied","locations":[{"line":2,"column":21}],"path":["updateProfile"]}],"data":{"updateProfile":null}}

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type:multipart/form-data' 
       -F operations='{"query": "mutation UpdateProfile($logo: Upload, $name: String!, $description: String!, $location: String!) {updateProfile (logo: $logo, name: $name, description: $description, location: $location) {_id}}", "variables": {"logo": null, "name": "c1", "description": "bank", "location": "canada"}}' 
       -F map='{"0": ["variables.files.0"]}' 
       -F 0=@logo.png 
       'https://bubblecareerconnect.me/graphql'
```

### Application API
#### changeStatus
- description: Change an application's status like rejecting the applicant or offering the applicant an interview. This action can be done either by users or companies.
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes an application id, a status code, an interview title, the start time of the interview, and the end time of the interview. The title, start time, end time are optional depended on the status code.
- response example: 200
  - body: {"data":{"changeStatus":{"_id":"604d457034e8800bcc1a4246"}}}
- response example: 500
  - body: {"errors":[{"message":"Application id does not exist.","locations":[{"line":1,"column":11}],"path":["changeStatus"]}],"data":{"changeStatus":null}}

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type: application/json' 
       -d '{"query":"mutation {changeStatus(id: \"604d457034e8800bcc1a4246\", code: 1, title: \"c1 developer\", start: \"Sat Mar 13 2021 19:29:08 GMT-0500\", end: \"Mon Mar 15 2021 19:29:08 GMT-0500\") {_id}}"}' 
       'https://bubblecareerconnect.me/graphql'
```
#### getApplication
- description: get an application for a job by ID
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes an application ID as parameter
- response example: 200
  - body: {"data":{"getApplication":{"job":{"title":"data analyst","creator":{"companyName":"c1"}}}}} 
- response example: 500
  - body: {"errors":[{"message":"Access Denied","locations":[{"line":1,"column":8}],"path":["getApplication"]}],"data":null} 

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type: application/json' 
       -d '{"query":"query {getApplication(id: \"6058182b603fe20015ba8c10\") {job {title creator {companyName}}}}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### getApplicationsByUser
- description: get a user's applications by signed-in user id
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes a page number as parameter
- response example: 200
  - body: {"data":{"getApplicationsByUser":[{"job":{"title":"data analyst","creator":{"companyName":"c1"}},"history":[{"status":5},{"status":0}]}]}} 
- response example: 500
  - body: {"errors":[{"message":"Access Denied","locations":[{"line":1,"column":8}],"path":["getApplicationsByUser"]}],"data":null} 

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type: application/json' 
       -d '{"query":"query {getApplicationsByUser(page: 0) {job {title creator {companyName}} history {status}}}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### getTotalApplicationsPages
- description: return the total number of the application pages for a user
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes no argument
- response example: 200
  - body: {"data":{"getTotalApplicationsPages":1}}
- response example: 500
  - body: {"errors":[{"message":"Access Denied","locations":[{"line":1,"column":8}],"path":["getTotalApplicationsPages"]}],"data":null}

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type: application/json' 
       -d '{"query":"query {getTotalApplicationsPages}"}' 
       'https://bubblecareerconnect.me/graphql'
```

### Job API
#### getJob
- description: get a job's infomation by the given job id
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes a job id as parameter
- response example: 200
  - body: {"data":{"getJob":{"title":"data analyst","labels":["Business"],"description":"test","dueDate":"2021-03-30T00:00:00.000Z","creator":{"companyName":"c1"}}}}
- response example: 500
  - body: {"errors":[{"message":"The job does not exist","locations":[{"line":1,"column":8}],"path":["getJob"]}],"data":null}

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type: application/json' 
       -d '{"query":"query {getJob(id: \"60581816603fe20015ba8c0e\") {title labels description dueDate creator{companyName}}}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### getLabels
- description: get a list of labels for jobs
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes a job id as parameter
- response example: 200
  - body: {"data":{"getLabels":["Accounting","Arts Design","Business","Communication","Computing","Consulting","Engineering","Finance","Marketing","Research","Technology"]}}
- response example: 500
  - body: {"errors":[{"message":"Something wrong","locations":[{"line":1,"column":8}],"path":["getLabels"]}],"data":null}

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type: application/json' 
       -d '{"query":"query {getLabels}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### getAllJobs
- description: get a list of jobs based on search keywords and labels
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes page number, search keyword, and labels as parameters
- response example: 200
  - body: {"data":{"getAllJobs":[{"_id":"606100fc221f534244fd23ca","title":"business analyst","dueDate":"2021-04-10T00:00:00.000Z","labels":["Business","Finance"],"creator":{"companyName":"c1"}}]}}
- response example: 500
  - body: {"errors":[{"message":"Something wrong","locations":[{"line":1,"column":8}],"path":["getAllJobs"]}],"data":null}

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type: application/json' 
       -d '{"query":"query {getAllJobs(page: 0, searchKeyword: \"business\", labels:[\"Business\"]) {_id title dueDate labels creator {companyName}}}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### getTotalPages
- description: return the total number of the job pages
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes no argument
- response example: 200
  - body: {"data":{"getTotalPages":1}}
- response example: 500
  - body: {"errors":[{"message":"Something wrong","locations":[{"line":1,"column":8}],"path":["getAllJobs"]}],"data":null}

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type: application/json' 
       -d '{"query":"query {getTotalPages}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### createJob
- description: companies post their new jobs
- request: `POST /graphql/`
    - content-type: `application/json`
    - body: a json object
      - query: a graphql query like the curl example below, it takes title, labels, description, requirement, dueDate, and salary as parameters
- response example: 200
  - body: {"data":{"createJob":{"_id":"606bce85018da003a8d4a4a0"}}}
- response example: 500
  - body: {"errors":[{"message":"Access Denied","locations":[{"line":1,"column":11}],"path":["createJob"]}],"data":{"createJob":null}}

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type: application/json' 
       -d '{"query":"mutation {createJob(jobInput: {title: \"developer\", labels: [\"Computing\"], description: \"test\", requirement: \"Python\", dueDate: \"Sun Feb 28 2021 23:14:27 GMT-0500\", salary: \"$40/hr\"}) {_id}}"}' 
       'https://bubblecareerconnect.me/graphql'
```

#### applyJob
- description: companies post their new jobs
- request: `POST /graphql/`
    - content-type: `multipart/form-data`
    - body: a json object
      - query: a graphql query like the curl example below, it takes a job id, a file location as parameters
- response example: 200
  - body: {"data":{"applyJob":{"files":[{"location":"resume/606a73d7dd541f1e8c690517/ZhongG_Resume.pdf"}]}}}
- response example: 500
  - body: {"errors":[{"message":"Access Denied","locations":[{"line":2,"column":21}],"path":["applyJob"]}],"data":{"applyJob":null}}

``` 
$ curl -X POST -b cookies.txt
       -H 'Content-Type:multipart/form-data' 
       -F operations='{"query": "mutation ResumeSubmit($jobId: ID!, $files: [Upload!]!) {applyJob (jobId: $jobId, files: $files) {files {location}}}", "variables": {"jobId": "606100c8221f534244fd23c9", "files": [null]}}' 
       -F map='{"0": ["variables.files.0"]}' 
       -F 0=@ZhongG_Resume.pdf 
       'https://bubblecareerconnect.me/graphql'
```

## REST API
#### GET: Company logo
- description: get a company logo picture
- request: `GET /api/uploads/profile/:id/logo/`
    - content-type: `application/json`
- response: 200
  - body: a json object
    - url: a link to the image file
- response: 404
  - body: "The company does not exist"

``` 
$ curl -b cookies.txt https://bubblecareerconnect.me/api/uploads/profile/60581800603fe20015ba8c0d/logo/
```

#### GET: Application file
- description: get a application file
- request: `GET /api/uploads/resume/:id/`
    - content-type: `application/json`
- response: 200
  - body: a json object
    - url: a link to the pdf file
- response: 401
  - body: "Access denied"
- response: 404
  - body: "The application does not exist"

``` 
$ curl -b cookies.txt https://bubblecareerconnect.me/api/uploads/resume/6058182b603fe20015ba8c10/
```

#### GET: Resume files
- description: compress and download the zip file of resumes of a job
- request: `GET /api/downloads/resume/:id/`
    - content-type: `application/json`
- response: 200
  - content-type: `application/pdf`
  - body: a binary a json object
- response: 401
  - body: "Access denied"
- response: 404
  - body: "The job does not exist"

``` 
$ curl -b cookies.txt https://bubblecareerconnect.me/api/downloads/resumes/60581816603fe20015ba8c0e/
```

#### GET: signout
- description: sign out the current logged in account
- request: `GET /signout/`
- response: 200
  - content-type: `text/html`
  - body: "sign out!"

``` 
$ curl https://bubblecareerconnect.me/signout/
```