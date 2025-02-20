
# Resume analysis




## Run Locally

Clone the project

```bash
  git clone https://github.com/devMukulSingh/NeobuildAssignment.git
```

Install dependencies

```bash
  bun install or npm install
```
Rename .env.example to .env and enter `DATABASE_URL`,`GEMINI_API_KEY` and `JWT_SECRET`

Start the server

```bash
  bun run dev or npm run dev
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

`JWT_SECRET`

`GEMINI_API_KEY`


## API Reference

### 1. Register new user

```http
  POST /api/v1/auth/register
```
- **Description:** Register a new user using name, email and password.
- **Request Body**:

      {
        "name":"Mukul singh bisht",
        "email":"mukulsingh2276@gmail.com",
        "password":"1234"
      }
- **Success Responses:**

      201 {"msg":"User registered successfully" }
- **Error Responses**

      400 {"error": ["field" is required] }
      409 {"error": "User already exists"}
      500 {"error": "Internal server error"}

### 2. Login 
```http
  POST /api/v1/auth/login
```
- **Description:** Login user using email and password.
- **Request Body**:

      {
        "email":"mukulsingh2276@gmail.com",
        "password":"1234"
      }
- **Success Responses:**

      200 {"JWT":"ey.121212.dfsdfsdfsda.sd12121"}
- **Error Responses**

      400 {"error" : ['field' is required]}
      400 {"error" :"Invalid credentials"} 
      409 {"error" : 'User already exists'}
      500 {"error" : 'Internal server error'}

  ### 3. Create applicant 
```http
  POST /api/v1/applicant/:userId/create-applicant
```
- **Description:** Parses raw data and create an applicant record in the db based on raw resume data.
- **Path parameters:** userId:"67b5dbd2e76a55f64e76638f".

- **Request Body**:

      {
        "url":"https://www.dhli.in/uploaded_files/resumes/resume_3404.pdf"
      }
- **Success Responses:**

        200 {
        "msg": "applicant created successfully",
        "newApplicant": {
            "id": "67b73eadb897ce67131824a4",
            "userId": "67b5dbd2e76a55f64e76638f",
            "name": "Prabhat Bhardwaj",
            "email": "Prabhat.Bhardwaj11@gmail.com",
            "summary": "Looking forward to enrich my knowledge and skills aligned with the organization’ s ultimate goals speci fic ally in Finance and Accounting.",
            "skills": [
                "MS Word",
                "Advanced Excel",
                "MS Power P oint",
                "SAP   (FICO  Module)",
                "FARVISION",
                "TALLY. ERP  9",
                "FINNONE"
            ],
            "createdAt": "2025-02-20T14:39:41.004Z",
            "updatedAt": "2025-02-20T14:39:41.004Z",
            "education": [
                {
                    "id": "67b73eadb897ce67131824a6",
                    "degree": "B.Com",
                    "branch": "Prog.",
                    "institution": "Delhi University",
                    "year": "2010",
                    "applicantId": "67b73eadb897ce67131824a4"
                },

            ],
            "experience": [
                {
                    "id": "67b73eadb897ce67131824a9",
                    "job_title": "EXECUTIVE - ACCOUNTS & FINANCE",
                    "company": "CSL FINANCE LIMITED",
                    "applicantId": "67b73eadb897ce67131824a4"
                },
                {
                    "id": "67b73eadb897ce67131824ac",
                    "job_title": "SENIOR ASSOCIATE (FINANCE)",
                    "company": "INNODATA INDIA P RI V A T E L IMI T ED",
                    "applicantId": "67b73eadb897ce67131824a4"
                }
            ]
        }
    }

- **Error Responses**

      400 {"error":["field" is required]}
      400 {"error":"Invalid credentials"} 
      401 {"error":"Unauthenticated, token not found" }
      401 {"error":"Unauthenticated, invalid userId" }
      401 {"error":"Unauthenticated, invalid token" }
      401 {"error":"Unauthenticated, user not found"}
      500 {"error":"Internal server error"}

    ### 4. Get applicant 
```http
  POST /api/v1/applicant/:userId/get-applicant
```
- **Description:** Queries applicants in the database based on the name of the applicant.
- **Path parameters:** userId:"67b5dbd2e76a55f64e76638f".
- **Request Body**:

      {
        "name":"Scarlett Emerson"
      }
- **Success Responses:**

      200 {"applicants": [
        {
            {
            "id": "67b73eadb897ce67131824a4",
            "userId": "67b5dbd2e76a55f64e76638f",
            "name": "Prabhat Bhardwaj",
            "email": "Prabhat.Bhardwaj11@gmail.com",
            "summary": "Looking forward to enrich my knowledge and skills aligned with the organization’ s ultimate goals speci fic ally in Finance and Accounting.",
            "skills": [
                "MS Word",
                "Advanced Excel",
                "MS Power P oint",
                "SAP   (FICO  Module)",
                "FARVISION",
                "TALLY. ERP  9",
                "FINNONE"
            ],
            "createdAt": "2025-02-20T14:39:41.004Z",
            "updatedAt": "2025-02-20T14:39:41.004Z",
            "education": [
                {
                    "id": "67b73eadb897ce67131824a6",
                    "degree": "B.Com",
                    "branch": "Prog.",
                    "institution": "Delhi University",
                    "year": "2010",
                    "applicantId": "67b73eadb897ce67131824a4"
                },

            ],
            "experience": [
                {
                    "id": "67b73eadb897ce67131824a9",
                    "job_title": "EXECUTIVE - ACCOUNTS & FINANCE",
                    "company": "CSL FINANCE LIMITED",
                    "applicantId": "67b73eadb897ce67131824a4"
                },
                {
                    "id": "67b73eadb897ce67131824ac",
                    "job_title": "SENIOR ASSOCIATE (FINANCE)",
                    "company": "INNODATA INDIA P RI V A T E L IMI T ED",
                    "applicantId": "67b73eadb897ce67131824a4"
                }
            ]
      ]
      }

- **Error Responses**

      400 {"error":["field" is required]}
      400 {"error":"Invalid credentials"} 
      401 {"error":"Unauthenticated, token not found" }
      401 {"error":"Unauthenticated, invalid userId" }
      401 {"error":"Unauthenticated, invalid token" }
      401 {"error":"Unauthenticated, user not found"}
      500 {"error":"Internal server error"}
